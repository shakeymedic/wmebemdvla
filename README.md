# DVLA Fitness to Drive: EM decision tool

Live at https://wmebemdvla.netlify.app (linked from [emevidence.org](https://emevidence.org)).

A static, no-build site that summarises the DVLA's *Assessing fitness to drive: a guide for medical professionals* for emergency medicine, for Group 1 (car and motorcycle) and Group 2 (lorry and bus) licences.

## Files

- `index.html`: page layout, key principles and GMC guidance.
- `conditions.js`: every condition, its Group 1 and Group 2 standards, and a link to the GOV.UK section it came from. This is the only file that holds clinical content.
- `app.js`: search, filters, group switch, dark mode and the discharge advice and notes generator.
- `styles.css`: styles.
- `scripts/check-sources.js`: checks every source link against the live GOV.UK pages and flags any page updated since this tool was built.

## Updating when DVLA revises the guide

1. Run `node scripts/check-sources.js` (Node 18 or later). It lists each chapter's last-updated date and any anchors that no longer exist.
2. Read the GOV.UK change notes for each flagged chapter and update the matching entries in `conditions.js`.
3. Update `DVLA_EDITION` and `DVLA_CHECKED` at the top of `conditions.js`, and `BUILT_FROM` in the script.

Where the tool simplifies or interprets the guide, the entry has an `unsure` note, which the page shows as a "Tool note". Keep those honest when editing.
