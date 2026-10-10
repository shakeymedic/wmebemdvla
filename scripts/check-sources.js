#!/usr/bin/env node
/*
 * Checks every source link in conditions.js against the live GOV.UK pages.
 * Usage: node scripts/check-sources.js   (Node 18 or later)
 * Reports anchors that no longer exist and pages updated since the edition this tool was built from.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BUILT_FROM = new Date('2025-11-07T23:59:59Z');
const code = fs.readFileSync(path.join(__dirname, '..', 'conditions.js'), 'utf8');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + ';globalThis.out = { DVLA_PAGES, DVLA_CONDITIONS };', ctx);
const { DVLA_PAGES, DVLA_CONDITIONS } = ctx.out;

(async () => {
    let problems = 0;
    const bodies = {};
    for (const [key, url] of Object.entries(DVLA_PAGES)) {
        const api = url.replace('https://www.gov.uk/', 'https://www.gov.uk/api/content/');
        const res = await fetch(api);
        if (!res.ok) { console.log(`FAIL ${key}: HTTP ${res.status}`); problems++; continue; }
        const json = await res.json();
        bodies[key] = json.details.body;
        const updated = new Date(json.public_updated_at);
        const flag = updated > BUILT_FROM ? '  <-- updated since this tool was built: review' : '';
        if (flag) problems++;
        console.log(`${key.padEnd(7)} updated ${json.public_updated_at}${flag}`);
    }
    for (const c of DVLA_CONDITIONS) {
        const [page, anchor] = c.src;
        if (bodies[page] && !bodies[page].includes(`id="${anchor}"`)) {
            console.log(`MISSING anchor for ${c.id}: ${page}#${anchor}`);
            problems++;
        }
    }
    console.log(problems ? `${problems} item(s) need attention.` : 'All source links found; no newer edition detected.');
    process.exitCode = problems ? 1 : 0;
})();
