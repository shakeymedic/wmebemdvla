(function () {
    'use strict';

    const SYMBOL = {
        x: { glyph: '✘', cls: 'sym-x', pill: 'pill-x', label: 'Must not drive' },
        '!': { glyph: '!', cls: 'sym-warn', pill: 'pill-warn', label: 'May drive subject to advice and/or notifying DVLA' },
        ok: { glyph: '✓', cls: 'sym-ok', pill: 'pill-ok', label: 'May drive and need not notify DVLA' }
    };
    const SEVERITY = { ok: 0, '!': 1, x: 2 };
    const GROUP_NAME = { 1: 'Group 1 (car and motorcycle)', 2: 'Group 2 (lorry and bus)' };
    const NOTIFY_RE = /must notify|and notify DVLA|must be reported to DVLA|advised to notify/i;

    let group = '1';          // '1', '2' or 'both'
    let filter = 'all';
    let letterCondition = null;
    let letterView = 'letter';
    let lastFocus = null;

    const $ = (id) => document.getElementById(id);

    function store(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
    function recall(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function sourceUrl(c) { return DVLA_PAGES[c.src[0]] + '#' + c.src[1]; }

    function linesFor(c, g) { return c.rows.flatMap((r) => r['g' + g]); }

    function worst(lines) {
        return lines.reduce((w, [s]) => (SEVERITY[s] > SEVERITY[w] ? s : w), 'ok');
    }

    function groupsInView() { return group === 'both' ? ['1', '2'] : [group]; }

    /* ---------- Rendering ---------- */

    function renderNav() {
        const nav = $('navLinks');
        DVLA_CATEGORIES.forEach((cat) => {
            const n = DVLA_CONDITIONS.filter((c) => c.cat === cat.id).length;
            const a = document.createElement('a');
            a.href = '#cat-' + cat.id;
            a.innerHTML = `<span>${cat.icon} ${escapeHtml(cat.name)}</span><span class="count">${n}</span>`;
            nav.appendChild(a);
        });
        nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeSidebar(); });
    }

    function ruleHtml([s, text]) {
        const sym = SYMBOL[s];
        return `<div class="rule"><span class="sym ${sym.cls}" title="${sym.label}" aria-label="${sym.label}">${sym.glyph}</span><span>${escapeHtml(text)}</span></div>`;
    }

    function cardHtml(c) {
        const rows = c.rows.map((r) => `
            <div class="row">
                <div class="row-when">${escapeHtml(r.when)}</div>
                <div class="row-groups">
                    <div class="group-block g1"><div class="group-tag">Group 1 · car and motorcycle</div>${r.g1.map(ruleHtml).join('')}</div>
                    <div class="group-block g2"><div class="group-tag">Group 2 · lorry and bus</div>${r.g2.map(ruleHtml).join('')}</div>
                </div>
            </div>`).join('');

        const note = c.note ? `<div class="card-note"><strong>From the guide:</strong> ${escapeHtml(c.note)}</div>` : '';
        const unsure = c.unsure ? `<div class="card-unsure"><strong>⚠ Tool note:</strong> ${escapeHtml(c.unsure)}</div>` : '';

        return `
            <article class="card" id="c-${c.id}" data-id="${c.id}">
                <div class="card-header">
                    <h4>${escapeHtml(c.name)}</h4>
                    <button class="link-btn" data-copy-link="${c.id}" title="Copy a link to this condition" aria-label="Copy a link to ${escapeHtml(c.name)}">🔗</button>
                </div>
                <div class="pills"></div>
                <div class="rows">${rows}</div>
                ${note}${unsure}
                <div class="card-footer">
                    <a class="source-link" href="${sourceUrl(c)}" target="_blank" rel="noopener">Source: ${escapeHtml(c.src[2])} ↗</a>
                    <button class="btn-action" data-letter="${c.id}">📄 Discharge advice</button>
                </div>
            </article>`;
    }

    function renderList() {
        const list = $('conditionList');
        list.innerHTML = DVLA_CATEGORIES.map((cat) => {
            const items = DVLA_CONDITIONS.filter((c) => c.cat === cat.id);
            return `
                <section class="category" id="cat-${cat.id}" data-cat="${cat.id}">
                    <div class="section-title"><h3>${cat.icon} ${escapeHtml(cat.name)}</h3></div>
                    <div class="grid">${items.map(cardHtml).join('')}</div>
                </section>`;
        }).join('');
    }

    function updatePills() {
        DVLA_CONDITIONS.forEach((c) => {
            const card = $('c-' + c.id);
            const pills = groupsInView().map((g) => {
                const lines = linesFor(c, g);
                const w = worst(lines);
                const mixed = new Set(lines.map(([s]) => s)).size > 1 || c.rows.length > 1;
                const prefix = group === 'both' ? `G${g}: ` : '';
                const label = w === 'x' ? 'Must not drive' : w === '!' ? 'Conditional' : 'May drive';
                return `<span class="pill ${SYMBOL[w].pill}">${prefix}${label}${mixed ? ' (depends on situation)' : ''}</span>`;
            });
            card.querySelector('.pills').innerHTML = pills.join('');
            card.dataset.worst = worst(groupsInView().flatMap((g) => linesFor(c, g)));
        });
    }

    /* ---------- Filtering ---------- */

    const searchIndex = new Map();
    function buildIndex() {
        DVLA_CONDITIONS.forEach((c) => {
            const text = [c.name, c.aka, c.note, c.src[2], ...c.rows.flatMap((r) => [r.when, ...r.g1.map((l) => l[1]), ...r.g2.map((l) => l[1])])].join(' ');
            searchIndex.set(c.id, text.toLowerCase());
        });
    }

    function matchesFilter(c) {
        if (filter === 'all') return true;
        const lines = groupsInView().flatMap((g) => linesFor(c, g));
        if (filter === 'x') return lines.some(([s]) => s === 'x');
        if (filter === 'notify') return lines.some(([, t]) => NOTIFY_RE.test(t));
        return true;
    }

    function applyFilters() {
        const terms = $('searchInput').value.toLowerCase().split(/\s+/).filter(Boolean);
        let shown = 0;
        DVLA_CONDITIONS.forEach((c) => {
            const hay = searchIndex.get(c.id);
            const ok = terms.every((t) => hay.includes(t)) && matchesFilter(c);
            $('c-' + c.id).hidden = !ok;
            if (ok) shown++;
        });
        document.querySelectorAll('.category').forEach((sec) => {
            sec.hidden = !sec.querySelector('.card:not([hidden])');
        });
        $('noResults').hidden = shown > 0;
        $('resultCount').textContent = `${shown} of ${DVLA_CONDITIONS.length} conditions`;
    }

    /* ---------- Group and theme ---------- */

    function setGroup(g) {
        group = g;
        document.body.classList.remove('mode-g1', 'mode-g2', 'mode-both');
        document.body.classList.add(g === 'both' ? 'mode-both' : 'mode-g' + g);
        document.querySelectorAll('.group-btn').forEach((b) => {
            const active = b.dataset.group === g;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
        });
        $('groupDesc').textContent = g === '1' ? 'Car and motorcycle' : g === '2' ? 'Lorry and bus (also C1/D1)' : 'Group 1 and Group 2 side by side';
        store('dvla-group', g);
        updatePills();
        applyFilters();
    }

    function setTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        $('themeToggle').checked = dark;
        store('dvla-theme', dark ? 'dark' : 'light');
    }

    /* ---------- Sidebar ---------- */

    function openSidebar() {
        $('sidebar').classList.add('open');
        $('scrim').hidden = false;
        $('hamburger').setAttribute('aria-expanded', 'true');
    }
    function closeSidebar() {
        $('sidebar').classList.remove('open');
        $('scrim').hidden = true;
        $('hamburger').setAttribute('aria-expanded', 'false');
    }

    /* ---------- Discharge advice ---------- */

    function openLetter(id) {
        letterCondition = DVLA_CONDITIONS.find((c) => c.id === id);
        if (!letterCondition) return;
        lastFocus = document.activeElement;
        $('modalTitle').textContent = 'Driving advice: ' + letterCondition.name;
        const select = $('scenarioSelect');
        select.innerHTML = letterCondition.rows.map((r, i) => `<option value="${i}">${escapeHtml(r.when)}</option>`).join('');
        select.disabled = letterCondition.rows.length === 1;
        $('letterGroup').value = group === '2' ? '2' : '1';
        $('letterModal').hidden = false;
        updateLetter();
        (letterCondition.rows.length > 1 ? select : $('letterGroup')).focus();
    }

    function closeLetter() {
        $('letterModal').hidden = true;
        if (lastFocus) lastFocus.focus();
    }

    function buildLetter() {
        const c = letterCondition;
        const row = c.rows[Number($('scenarioSelect').value) || 0];
        const g = $('letterGroup').value;
        const lines = row['g' + g].map(([, t]) => t);
        const name = $('ptName').value.trim() || '[Patient name]';
        const pid = $('ptId').value.trim() || '[ID]';
        const doc = $('clinicianName').value.trim() || '[Clinician]';
        const date = new Date().toLocaleDateString('en-GB');
        const situation = c.rows.length > 1 ? `\nSituation: ${row.when}` : '';
        const source = `DVLA, Assessing fitness to drive (${DVLA_EDITION}), ${c.src[2]}:\n${sourceUrl(c)}`;

        if (letterView === 'notes') {
            return [
                `DVLA fitness to drive advice (${date})`,
                `Condition: ${c.name}${situation}`,
                `Licence group discussed: ${GROUP_NAME[g]}`,
                '',
                'DVLA standard:',
                ...lines.map((l) => '- ' + l),
                '',
                'Patient advised of the above and of their legal duty to notify DVLA where required, and that driving against medical advice may affect their insurance.',
                'Patient understanding confirmed: [yes/no]',
                '',
                `Source: ${source}`,
                `Clinician: ${doc}`
            ].join('\n');
        }

        const steps = [
            '- Follow the advice above. If it says you must not drive, do not drive until the stated time has passed and any conditions are met.',
            '- If it says you must notify DVLA, it is your legal responsibility to do so: www.gov.uk/driving-medical-conditions (Northern Ireland: www.nidirect.gov.uk/articles/how-tell-dva-about-medical-condition).',
            '- If you drive against medical advice, your motor insurance may not be valid.'
        ];
        if (g === '1') steps.push('- If you also drive lorries, buses or minibuses (Group 2, including C1 or D1), stricter rules apply. Please tell us or your GP.');
        steps.push('- If you are unsure, ask your GP or the specialist looking after you.');

        return [
            'DRIVING ADVICE (FITNESS TO DRIVE)',
            `Date: ${date}`,
            '',
            `Patient: ${name}   ID: ${pid}`,
            `Clinician: ${doc}`,
            '',
            `Condition: ${c.name}${situation}`,
            `Licence: ${GROUP_NAME[g]}`,
            '',
            'What the DVLA guidance says:',
            ...lines.map((l) => '- ' + l),
            '',
            'What you need to do:',
            ...steps,
            '',
            `Source: ${source}`
        ].join('\n');
    }

    function updateLetter() {
        if (!letterCondition) return;
        $('letterText').textContent = buildLetter();
    }

    function copyLetter() {
        const text = $('letterText').textContent;
        const btn = $('copyBtn');
        const done = () => { btn.textContent = '✓ Copied'; setTimeout(() => { btn.textContent = '📋 Copy'; }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
        } else {
            fallbackCopy(text, done);
        }
    }

    function fallbackCopy(text, done) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { alert('Copy failed. Please select the text and copy it manually.'); }
        ta.remove();
    }

    function printLetter() {
        const win = window.open('', '_blank', 'width=800,height=700');
        if (!win) { alert('Please allow pop-ups to print the letter.'); return; }
        const doc = win.document;
        doc.title = 'Driving advice';
        const pre = doc.createElement('pre');
        pre.style.cssText = 'font-family: Arial, sans-serif; font-size: 12pt; padding: 30px; white-space: pre-wrap;';
        pre.textContent = $('letterText').textContent;
        doc.body.appendChild(pre);
        win.focus();
        win.print();
    }

    /* ---------- Links ---------- */

    function copyLink(id, btn) {
        const url = location.href.split('#')[0] + '#c-' + id;
        const done = () => { btn.textContent = '✓'; setTimeout(() => { btn.textContent = '🔗'; }, 1200); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(done, () => { location.hash = 'c-' + id; });
        } else {
            location.hash = 'c-' + id;
        }
    }

    function highlightFromHash() {
        const m = location.hash.match(/^#c-([\w-]+)$/);
        document.querySelectorAll('.card.highlight').forEach((el) => el.classList.remove('highlight'));
        if (!m) return;
        const card = $('c-' + m[1]);
        if (!card) return;
        if (card.hidden) {
            $('searchInput').value = '';
            filter = 'all';
            setChip('all');
            applyFilters();
        }
        card.classList.add('highlight');
        card.scrollIntoView({ block: 'start', behavior: 'instant' });
    }

    function setChip(f) {
        document.querySelectorAll('.chip').forEach((b) => {
            const active = b.dataset.filter === f;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
        });
    }

    /* ---------- Init ---------- */

    function init() {
        $('editionText').textContent = DVLA_EDITION;
        $('checkedText').textContent = DVLA_CHECKED;

        renderNav();
        renderList();
        buildIndex();

        const savedTheme = recall('dvla-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

        const savedGroup = recall('dvla-group');
        setGroup(['1', '2', 'both'].includes(savedGroup) ? savedGroup : '1');

        $('themeToggle').addEventListener('change', (e) => setTheme(e.target.checked));
        document.querySelectorAll('.group-btn').forEach((b) => b.addEventListener('click', () => setGroup(b.dataset.group)));
        document.querySelectorAll('.chip').forEach((b) => b.addEventListener('click', () => {
            filter = b.dataset.filter;
            setChip(filter);
            applyFilters();
        }));
        $('searchInput').addEventListener('input', applyFilters);
        $('hamburger').addEventListener('click', () => ($('sidebar').classList.contains('open') ? closeSidebar() : openSidebar()));
        $('scrim').addEventListener('click', closeSidebar);

        $('conditionList').addEventListener('click', (e) => {
            const letterBtn = e.target.closest('[data-letter]');
            if (letterBtn) { openLetter(letterBtn.dataset.letter); return; }
            const linkBtn = e.target.closest('[data-copy-link]');
            if (linkBtn) copyLink(linkBtn.dataset.copyLink, linkBtn);
        });

        $('closeModal').addEventListener('click', closeLetter);
        $('letterModal').addEventListener('click', (e) => { if (e.target === $('letterModal')) closeLetter(); });
        ['scenarioSelect', 'letterGroup'].forEach((id) => $(id).addEventListener('change', updateLetter));
        ['ptName', 'ptId', 'clinicianName'].forEach((id) => $(id).addEventListener('input', updateLetter));
        document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => {
            letterView = t.dataset.view;
            document.querySelectorAll('.tab').forEach((x) => {
                x.classList.toggle('active', x === t);
                x.setAttribute('aria-selected', String(x === t));
            });
            updateLetter();
        }));
        $('copyBtn').addEventListener('click', copyLetter);
        $('printBtn').addEventListener('click', printLetter);

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (!$('letterModal').hidden) closeLetter();
            else closeSidebar();
        });

        window.addEventListener('hashchange', highlightFromHash);
        highlightFromHash();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
