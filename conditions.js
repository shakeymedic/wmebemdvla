/*
 * DVLA fitness-to-drive standards relevant to emergency medicine.
 *
 * Source: DVLA "Assessing fitness to drive: a guide for medical professionals",
 * November 2025 edition (GOV.UK pages last updated 7 November 2025, checked 10 October 2026).
 * Every entry links to the GOV.UK section it was taken from. Wording is condensed from the
 * guide; where this tool has had to simplify or interpret, the entry carries an `unsure` note.
 *
 * Symbols follow the guide:  x = must not drive,  ! = may drive subject to advice and/or
 * notifying DVLA,  ok = may drive and need not notify DVLA.
 *
 * Each condition: { id, name, cat, aka (extra search words), src: [page key, anchor, label],
 *   rows: [{ when, g1: [[symbol, text], ...], g2: [[symbol, text], ...] }], note, unsure }
 */

const DVLA_EDITION = 'November 2025 edition, updated on GOV.UK 7 November 2025';
const DVLA_CHECKED = '10 October 2026';

const DVLA_PAGES = {
    gen: 'https://www.gov.uk/guidance/general-information-assessing-fitness-to-drive',
    neuro: 'https://www.gov.uk/guidance/neurological-disorders-assessing-fitness-to-drive',
    cardio: 'https://www.gov.uk/guidance/cardiovascular-disorders-assessing-fitness-to-drive',
    diab: 'https://www.gov.uk/guidance/diabetes-mellitus-assessing-fitness-to-drive',
    psych: 'https://www.gov.uk/guidance/psychiatric-disorders-assessing-fitness-to-drive',
    drugs: 'https://www.gov.uk/guidance/drug-or-alcohol-misuse-or-dependence-assessing-fitness-to-drive',
    vision: 'https://www.gov.uk/guidance/visual-disorders-assessing-fitness-to-drive',
    renal: 'https://www.gov.uk/guidance/renal-and-respiratory-disorders-assessing-fitness-to-drive',
    misc: 'https://www.gov.uk/guidance/miscellaneous-conditions-assessing-fitness-to-drive',
    app: 'https://www.gov.uk/guidance/appendices-assessing-fitness-to-drive'
};

const DVLA_CATEGORIES = [
    { id: 'blackouts', name: 'Blackouts & seizures', icon: '⚡' },
    { id: 'neuro', name: 'Stroke, head injury & neurology', icon: '🧠' },
    { id: 'cardio', name: 'Cardiovascular', icon: '🫀' },
    { id: 'diabetes', name: 'Diabetes & metabolic', icon: '🩸' },
    { id: 'psych', name: 'Psychiatric', icon: '💭' },
    { id: 'substances', name: 'Alcohol, drugs & medication', icon: '💊' },
    { id: 'vision', name: 'Vision', icon: '👁️' },
    { id: 'other', name: 'Sleep, respiratory, surgery & other', icon: '🩺' }
];

const G2_ICD_BAR = [['x', 'ICD implantation is a permanent bar to Group 2. Must not drive and must notify DVLA. Licence refused or revoked permanently.']];

const DVLA_CONDITIONS = [

    /* ---------------- Blackouts & seizures ---------------- */
    {
        id: 'first-seizure', cat: 'blackouts',
        name: 'First unprovoked seizure (isolated seizure)',
        aka: 'first fit single seizure isolated seizure unprovoked convulsion',
        src: ['neuro', 'epilepsy-and-seizures', 'Neurological disorders: Epilepsy and seizures'],
        rows: [{
            when: 'First unprovoked or isolated seizure',
            g1: [['x', 'Must not drive and must notify DVLA. Driving must stop for 6 months from the date of the seizure, or 12 months if there is an underlying causative factor that may increase the risk of another seizure.']],
            g2: [['x', 'Must not drive and must notify DVLA. Driving must stop for 5 years from the date of the seizure. The licence may then be restored if a recent neurologist assessment shows an annual risk of a further seizure of no more than 2%, and no epilepsy medication has been needed throughout the 5 years.']]
        }],
        note: 'More than one seizure within 24 hours counts as a single event. An "isolated seizure" also includes an unprovoked seizure more than 5 years after the last one. Good prognostic features: no relevant structural abnormality on brain imaging, no definite epileptiform activity on EEG, support of a neurologist.'
    },
    {
        id: 'epilepsy', cat: 'blackouts',
        name: 'Epilepsy (2 or more unprovoked seizures)',
        aka: 'epilepsy recurrent seizures breakthrough seizure fit nocturnal sleep seizure aura absence',
        src: ['neuro', 'epilepsy-and-seizures', 'Neurological disorders: Epilepsy and seizures'],
        rows: [
            {
                when: 'Epilepsy or multiple unprovoked seizures',
                g1: [['x', 'Must not drive and must notify DVLA. Driving must stop for 12 months from the date of the most recent seizure, unless the seizure meets the legal criteria for a permitted seizure (Appendix B).']],
                g2: [['x', 'Must not drive and must notify DVLA. Must remain seizure-free for 10 years without epilepsy medication before licensing may be considered.']]
            },
            {
                when: 'Seizures only ever while asleep',
                g1: [['x', 'Must stop driving and must notify DVLA, unless DVLA has already established an asleep-only pattern. Driving must stop for 1 year from the sleep seizure unless a pattern of seizures only ever while asleep is established over at least 1 year, or a pattern of asleep-only seizures started at least 3 years before the licence application with no other unprovoked seizures in those 3 years.']],
                g2: [['x', 'The Group 2 rules apply: 10 years seizure-free without epilepsy medication. The guide gives no asleep-seizure concession for Group 2.']]
            },
            {
                when: 'Seizures that never affect consciousness or cause functional impairment',
                g1: [['x', 'Must stop driving and must notify DVLA, unless DVLA has already established this pattern. Relicensing may be granted if, over at least 1 year from the first seizure, a pattern of seizures that neither affect consciousness nor cause functional impairment is established, and there has never been any other type of unprovoked seizure.']],
                g2: [['x', 'The Group 2 rules apply: 10 years seizure-free without epilepsy medication.']]
            }
        ],
        note: 'For Group 1, the 1 seizure-free year includes minor seizures, auras, absences and limb jerking. A driver licensed under a pattern concession who then has a different type of seizure loses the concession, must stop driving and must notify DVLA. For licensing purposes, epilepsy means 2 or more unprovoked seizures more than 24 hours and less than 5 years apart.'
    },
    {
        id: 'provoked-seizure', cat: 'blackouts',
        name: 'Provoked seizure',
        aka: 'provoked seizure hyponatraemia hypoglycaemia withdrawal intoxication alcohol withdrawal seizure drug seizure post head injury seizure early post-stroke seizure eclampsia ECT tramadol',
        src: ['app', 'provoked-seizures', 'Appendix B: Provoked seizures'],
        rows: [{
            when: 'Seizure attributable solely to a recognisable, reliably avoidable provoking cause',
            g1: [['x', 'Must not drive and must notify DVLA. In most cases driving must stop for 6 months after the provoked seizure (longer if there is a previous unprovoked seizure or pre-existing cerebral pathology).']],
            g2: [['x', 'Must not drive and must notify DVLA. Driving must stop for up to 5 years after the provoked seizure.']]
        }],
        note: 'May be treated as provoked: true seizures with cardiovascular syncope (convulsive syncope is not a seizure: apply the syncope standard); seizure in the first week after a head injury; seizure in the first week after a stroke, TIA or spontaneous acute subdural haematoma; seizure during or in the first week after intracranial surgery; seizure with severe electrolyte or biochemical disturbance (including hypoglycaemia) documented within 24 hours; seizure with drug or alcohol intoxication or withdrawal, or exposure to well-defined epileptogenic drugs. Exceptions that do not require driving to stop (but the underlying condition standard still applies): seizure at the very moment of a head impact, eclamptic seizures, ECT-induced seizures, and seizures within 5 minutes of stopping repetitive TMS. Alcohol- or drug-related seizures also need the misuse or dependence standards applied; alcohol withdrawal seizures are a high-risk feature of alcohol dependence.'
    },
    {
        id: 'aed-withdrawal', cat: 'blackouts',
        name: 'Stopping, changing or missing epilepsy medication',
        aka: 'antiepileptic withdrawal anti-epileptic medication change omitted doses AED',
        src: ['app', 'withdrawal-of-epilepsy-medication', 'Appendix B: Withdrawal of epilepsy medication'],
        rows: [{
            when: 'Medication being withdrawn, changed or omitted',
            g1: [['!', 'Should usually not drive while epilepsy medication is being withdrawn and for 6 months after the last dose (this may not be appropriate in every case, for example a well-established history of seizures only while asleep). Switching to an equally effective drug: no time off is recommended. Switching to a less effective drug: 6 months off, starting from the end of the change-over.'], ['x', 'If a seizure occurs within 6 months of, and because of, a physician-advised change: must not drive and must notify DVLA. Relicensing may be considered once previously effective medication has been reinstated for at least 6 months and the driver has been seizure-free for at least 6 months.']],
            g2: [['x', 'Group 2 licensing already requires no epilepsy medication for 10 years, so there are no special considerations for withdrawal. A Group 2 driver with a previous provoked seizure who stops anti-seizure medication must stop Group 2 driving and inform DVLA.']]
        }],
        note: 'The licensing rules still apply when medication is omitted rather than withdrawn, for example on admission to hospital. Advise the driver to tell their insurer about medication withdrawal.'
    },
    {
        id: 'dissociative', cat: 'blackouts',
        name: 'Dissociative seizures (non-epileptic attack disorder, functional seizures)',
        aka: 'NEAD PNES psychogenic non-epileptic seizures functional seizures dissociative attacks pseudoseizures',
        src: ['neuro', 'epilepsy-and-seizures', 'Neurological disorders: Epilepsy and seizures'],
        rows: [{
            when: 'Dissociative seizures',
            g1: [['x', 'Must not drive and must notify DVLA. Licensing may be considered after 3 months event-free. If episodes have occurred, or are likely to occur, while driving: at least 6 months off driving plus a specialist review, including any relevant mental health issues.']],
            g2: [['x', 'Must not drive and must notify DVLA. At least 6 months off driving plus a specialist review, including any relevant mental health issues, before relicensing.']]
        }]
    },
    {
        id: 'reflex-syncope-prodrome', cat: 'blackouts',
        name: 'Reflex (vasovagal) syncope with a reliable prodrome',
        aka: 'simple faint vasovagal syncope situational syncope micturition defecation swallow syncope blackout TLoC',
        src: ['app', 'reflex-syncope-often-referred-to-as-vasovagal-syncope-with-a-reliable-prodrome', 'Appendix D: Reflex syncope with a reliable prodrome'],
        rows: [
            {
                when: 'Single episode',
                g1: [['ok', 'If syncope did not occur while driving: may drive and need not notify DVLA.'], ['x', 'If syncope occurred while driving: must not drive for 1 month; need not notify DVLA.']],
                g2: [['!', 'Must notify DVLA.'], ['ok', 'If associated with an avoidable provocation and not while driving: may drive after recovery from the episode.'], ['x', 'If not associated with an avoidable provocation, or it occurred while driving: must not drive. May resume 3 months after the episode, subject to an appropriate specialist report.']]
            },
            {
                when: 'Multiple episodes (2 or more in the preceding 24 months)',
                g1: [['ok', 'If no episode occurred while driving: may drive and need not notify DVLA.'], ['x', 'If any occurred while driving: must not drive and must notify DVLA. May resume 3 months after the most recent episode.']],
                g2: [['x', 'Must notify DVLA and must not drive.'], ['ok', 'If associated with an avoidable provocation and not while driving: may drive after recovery from the most recent episode.'], ['x', 'Otherwise: may resume 6 months after the most recent episode, subject to an appropriate specialist report.']]
            }
        ],
        note: 'Reflex syncope needs a positive diagnosis on the balance of probability; if no cause can be attributed, use the unexplained loss of consciousness standard. A reliable prodrome occurs predictably, is recognised by the driver and lasts long enough to stop the vehicle safely. An avoidable provocation is one not expected to occur while driving (for example a medical procedure or prolonged standing). If any of several episodes lacked a reliable prodrome, use the "without a reliable prodrome" standard.'
    },
    {
        id: 'reflex-syncope-no-prodrome', cat: 'blackouts',
        name: 'Reflex syncope without a reliable prodrome',
        aka: 'vasovagal no warning syncope without prodrome blackout TLoC',
        src: ['app', 'reflex-syncope-without-a-reliable-prodrome', 'Appendix D: Reflex syncope without a reliable prodrome'],
        rows: [
            {
                when: 'Single episode',
                g1: [['x', 'Must not drive and must notify DVLA.'], ['ok', 'If associated with an avoidable provocation and not while driving: may resume driving after recovery from the episode.'], ['x', 'If not associated with an avoidable provocation, or it occurred while driving: may resume 3 months after the episode.']],
                g2: [['x', 'Must not drive and must notify DVLA.'], ['!', 'If associated with an avoidable provocation and not while driving: may resume 3 months after the episode, subject to an appropriate specialist report.'], ['!', 'Otherwise: may resume 12 months after the episode, subject to an appropriate specialist report.']]
            },
            {
                when: 'Multiple episodes (2 or more in the preceding 24 months)',
                g1: [['x', 'Must not drive and must notify DVLA. With an avoidable provocation and not while driving: may resume 3 months after the most recent episode. Otherwise: 6 months after the most recent episode.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered 12 months after the most recent episode, subject to an appropriate specialist report.']]
            }
        ]
    },
    {
        id: 'unexplained-loc', cat: 'blackouts',
        name: 'Unexplained loss of consciousness (no seizure markers)',
        aka: 'unexplained blackout collapse TLoC syncope query cause unknown',
        src: ['app', 'unexplained-loss-of-consciousness-without-seizure-markers', 'Appendix D: Unexplained loss of consciousness'],
        rows: [
            {
                when: 'Single episode',
                g1: [['x', 'Must not drive and must notify DVLA. May resume driving 6 months after the episode.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence revoked for 12 months.']]
            },
            {
                when: 'Multiple episodes (2 or more within 24 months, unless the most recent of that cluster was over 5 years ago)',
                g1: [['x', 'Must not drive and must notify DVLA. Licence revoked for 12 months after the most recent episode.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence revoked for 5 years after the most recent episode.']]
            }
        ],
        note: 'This standard applies until a diagnosis is established. Once a cause is found, apply the standard for that cause. With episodes of mixed cause, the relevant standard applies to each episode.'
    },
    {
        id: 'seizure-markers', cat: 'blackouts',
        name: 'Blackout with seizure markers',
        aka: 'possible seizure tongue biting incontinence post-ictal confusion injury blackout TLoC',
        src: ['app', 'blackouts-with-seizure-markers', 'Appendix D: Blackouts with seizure markers'],
        rows: [
            {
                when: 'Isolated episode',
                g1: [['x', 'Must stop driving and notify DVLA. 6 months off driving from the date of the episode, or 12 months if there are factors that may increase the risk of recurrence.']],
                g2: [['x', 'Must stop driving and notify DVLA. 5 years off driving from the date of the episode.']]
            },
            {
                when: 'Recurrent episodes',
                g1: [['x', 'Must stop driving and notify DVLA. The isolated seizure or epilepsy standards apply, depending on the history.']],
                g2: [['x', 'Must stop driving and notify DVLA. The isolated seizure or epilepsy standards apply, depending on the history.']]
            }
        ],
        note: 'For episodes where, on the balance of probability, a seizure is suspected but not proven. Markers: loss of consciousness for more than 5 minutes, amnesia longer than 5 minutes, injury, tongue biting, incontinence, post-ictal confusion, headache after the attack. Needs specialist assessment and investigation (for example EEG, brain scan) where indicated.'
    },
    {
        id: 'cough-syncope', cat: 'blackouts',
        name: 'Cough syncope',
        aka: 'cough syncope tussive syncope COPD asthma blackout',
        src: ['app', 'cough-syncope', 'Appendix D: Cough syncope'],
        rows: [{
            when: 'Cough syncope',
            g1: [['x', 'Must not drive and must notify DVLA. 6 months off driving after a single episode; 12 months after multiple episodes over 5 years.']],
            g2: [['x', 'Must not drive and must notify DVLA. 12 months off driving after a single episode; 5 years after multiple episodes over 5 years.']]
        }],
        note: 'Episodes within 24 hours count as one; episodes more than 24 hours apart are multiple. Treating or resolving the cause of the cough (for example a chest infection) does not reduce the risk, so the standard still applies.'
    },
    {
        id: 'presyncope-pots', cat: 'blackouts',
        name: 'Presyncope, POTS and orthostatic hypotension',
        aka: 'presyncope near faint dizzy postural hypotension orthostatic hypotension POTS postural tachycardia',
        src: ['app', 'appendix-d-transient-loss-of-consciousness-blackouts-and-lost-or-altered-awareness', 'Appendix D: Transient loss of consciousness'],
        rows: [{
            when: 'Presyncope without loss of consciousness; blackouts attributed to POTS or orthostatic hypotension',
            g1: [['!', 'Presyncope is relevant only if medical opinion considers it made the person unable to safely control or stop a vehicle; the syncope standards then apply. Blackouts attributed to POTS or orthostatic hypotension need notifying (and DVLA enquiry) only if medical opinion considers them relevant to driving.']],
            g2: [['!', 'As for Group 1: notify only if medical opinion considers the episodes relevant to driving; if presyncope prevented safe control of a vehicle, the syncope standards apply.']]
        }],
        note: 'The guide asks for anyone with transient loss of consciousness to be assessed as soon as possible by a healthcare professional for driving advice.'
    },

    /* ---------------- Stroke, head injury & neurology ---------------- */
    {
        id: 'stroke', cat: 'neuro',
        name: 'Stroke (infarct or haemorrhage) or cerebral venous thrombosis',
        aka: 'CVA stroke ischaemic stroke intracerebral haemorrhage ICH CVT venous sinus thrombosis',
        src: ['neuro', 'stroke-transient-ischaemic-attack-tia-and-cerebral-venous-thrombosis--including-amaurosis-fugax-and-retinal-artery-occlusion', 'Neurological disorders: Stroke, TIA and CVT'],
        rows: [{
            when: 'Stroke or cerebral venous thrombosis',
            g1: [['x', 'Must not drive for 1 month. May resume after 1 month if there has been satisfactory clinical recovery. Need not notify DVLA unless there is residual neurological deficit 1 month after the episode, in particular visual field defects, cognitive defects or impaired limb function. Minor limb weakness alone does not need notifying unless vehicle restrictions or adapted controls may be needed.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked for 1 year. Relicensing after 1 year may be considered if there is no debarring residual impairment and no other significant risk factors; a medical report including exercise ECG may be needed. Functional cardiac assessment is not needed after an isolated stroke with imaging showing under 50% carotid stenosis and no previous cardiovascular disease, or after cerebral venous thrombosis. Recurrent strokes need functional cardiac testing.']]
        }],
        note: 'Seizures at the time of a stroke or TIA, or in the following week, may be treated as provoked (if no previous unprovoked seizure or cerebral pathology); provoked seizures usually mean driving must stop. Residual visual field loss: apply the visual field standard.'
    },
    {
        id: 'tia', cat: 'neuro',
        name: 'TIA (including amaurosis fugax and retinal artery occlusion)',
        aka: 'transient ischaemic attack mini stroke amaurosis fugax retinal artery occlusion CRAO BRAO',
        src: ['neuro', 'stroke-transient-ischaemic-attack-tia-and-cerebral-venous-thrombosis--including-amaurosis-fugax-and-retinal-artery-occlusion', 'Neurological disorders: Stroke, TIA and CVT'],
        rows: [{
            when: 'Single or multiple TIAs',
            g1: [['x', 'Must not drive for 1 month; need not notify DVLA. If there is more than one TIA, 1 month off driving after each episode.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked for 1 year (same as stroke). Relicensing as for stroke; recurrent TIAs need functional cardiac testing.']]
        }],
        note: 'If a retinal artery occlusion leaves a visual field or acuity defect, the vision standards also apply.'
    },
    {
        id: 'caa-tfne', cat: 'neuro',
        name: 'Cerebral amyloid angiopathy-related transient focal neurological episodes ("amyloid spells")',
        aka: 'CAA TFNE amyloid spells convexity subarachnoid haemorrhage cortical superficial siderosis',
        src: ['neuro', 'cerebral-amyloid-angiopathy-related-transient-focal-neurologic-episodes-previously-termed-amyloid-spells', 'Neurological disorders: CAA-related TFNE'],
        rows: [{
            when: 'CAA-related TFNE',
            g1: [['x', 'Must not drive and must notify DVLA. Driving must stop for 6 months from the most recent episode.']],
            g2: [['x', 'Must notify DVLA. Driving must stop for 5 years from the most recent episode.']]
        }]
    },
    {
        id: 'pres-rcvs', cat: 'neuro',
        name: 'PRES and reversible cerebral vasoconstriction syndrome (RCVS)',
        aka: 'posterior reversible encephalopathy syndrome RCVS thunderclap',
        src: ['neuro', 'posterior-reversible-encephalopathy-syndrome-pres-and-reversible-cerebral-vasoconstriction-syndrome-rcvs', 'Neurological disorders: PRES and RCVS'],
        rows: [{
            when: 'PRES or RCVS',
            g1: [['x', 'Must not drive but need not notify DVLA. May resume after clinical recovery. If associated with stroke, the stroke standards apply; if associated with seizures, the provoked seizure guidance applies.']],
            g2: [['x', 'Must not drive and must notify DVLA. May resume after clinical recovery. If associated with stroke, the stroke standards apply.']]
        }]
    },
    {
        id: 'carotid', cat: 'neuro',
        name: 'Carotid artery stenosis',
        aka: 'carotid stenosis endarterectomy',
        src: ['cardio', 'carotid-artery-stenosis', 'Cardiovascular disorders: Carotid artery stenosis'],
        rows: [{
            when: 'Carotid artery stenosis',
            g1: [['ok', 'May drive and need not notify DVLA.']],
            g2: [['!', 'Should not drive unless an appropriate healthcare professional considers it safe. Must notify DVLA. If stenosis is over 50%, the exercise or other functional test requirements (Appendix C) must be met.']]
        }]
    },
    {
        id: 'sah-perimesencephalic', cat: 'neuro',
        name: 'Subarachnoid haemorrhage: perimesencephalic (non-aneurysmal)',
        aka: 'SAH non-aneurysmal perimesencephalic subarachnoid',
        src: ['neuro', 'perimesencephalic-non-aneurysmal-haemorrhage', 'Neurological disorders: Perimesencephalic haemorrhage'],
        rows: [{
            when: 'Perimesencephalic (non-aneurysmal) SAH',
            g1: [['x', 'Must not drive and must notify DVLA. May resume on clinical confirmation of recovery and, if no other cause is identified, documented normal angiographic imaging.']],
            g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 6 months if comprehensive cerebrovascular imaging is normal, no other cause is found and there is no debarring residual impairment.']]
        }]
    },
    {
        id: 'sah-aneurysm', cat: 'neuro',
        name: 'Subarachnoid haemorrhage from an intracranial aneurysm (symptomatic aneurysm)',
        aka: 'aneurysmal SAH subarachnoid haemorrhage coiling clipping berry aneurysm',
        src: ['neuro', 'symptomatic-intradural-intracranial-aneurysm-present-with-haemorrhage-or-other-symptoms-related-to-the-aneurysm', 'Neurological disorders: Symptomatic intracranial aneurysm'],
        rows: [
            {
                when: 'No intervention received',
                g1: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 6 months, on an individual basis, if there is no debarring residual impairment.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; relicensing considered on an individual basis.']]
            },
            {
                when: 'Non-middle cerebral artery aneurysm: treated by craniotomy (clipping)',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume after clinical recovery.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 1 year if modified Rankin Scale was below 2 at 2 months; if 2 or higher, not before 2 years and with no debarring residual impairment.']]
            },
            {
                when: 'Non-middle cerebral artery aneurysm: treated endovascularly (coiling)',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume after clinical recovery.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 6 months if modified Rankin Scale was below 2 at 2 months; if 2 or higher, not before 2 years and with no debarring residual impairment.']]
            },
            {
                when: 'Middle cerebral artery aneurysm: craniotomy or endovascular treatment',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume after clinical recovery.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 2 years if modified Rankin Scale was below 2 at 2 months. If 2 or higher, licence refused or revoked; not reconsidered for at least 2 years, and only after specialist assessment (annual seizure risk no more than 2%, no residual impairment).']]
            }
        ],
        note: 'With multiple aneurysms, assess against the one with the greatest risk. Any seizures: apply the seizure rules as well.'
    },
    {
        id: 'aneurysm-incidental', cat: 'neuro',
        name: 'Unruptured intracranial aneurysm (incidental finding)',
        aka: 'incidental aneurysm unruptured aneurysm',
        src: ['neuro', 'intradural-intracranial-aneurysm--truly-incidental-finding-without-haemorrhage-or-local-symptoms', 'Neurological disorders: Incidental intracranial aneurysm'],
        rows: [
            {
                when: 'Not treated',
                g1: [['ok', 'Providing there is no other relevant condition, may drive and need not notify DVLA.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing considered individually where an anterior circulation aneurysm (excluding cavernous carotid) is under 13 mm, or a posterior circulation aneurysm is under 7 mm.']]
            },
            {
                when: 'Treated by craniotomy',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume after clinical recovery.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 1 year.']]
            },
            {
                when: 'Treated endovascularly',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume after clinical recovery.']],
                g2: [['x', 'Must not drive. Need not notify DVLA unless there are complications or clinician concern about the outcome. May resume after clinical recovery.']]
            }
        ],
        note: 'Cavernous sinus (extradural) aneurysms have separate standards; see the source.'
    },
    {
        id: 'avm', cat: 'neuro',
        name: 'Arteriovenous malformation (AVM) with or without haemorrhage',
        aka: 'AVM arteriovenous malformation intracerebral haemorrhage embolisation',
        src: ['neuro', 'arteriovenous-malformation-avm', 'Neurological disorders: Arteriovenous malformation'],
        rows: [
            {
                when: 'Supratentorial AVM haemorrhage: no treatment currently needed, or treated by embolisation or stereotactic radiotherapy',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume after 1 month if no debarring residual impairment.']],
                g2: [['x', 'Must not drive and must notify DVLA. No treatment: licence refused or revoked permanently. Embolisation: relicensing may be considered after 10 years seizure-free since the last definitive treatment, if the lesion was completely removed or ablated. Stereotactic radiotherapy: after 5 years on the same basis.']]
            },
            {
                when: 'Supratentorial AVM haemorrhage: treated by craniotomy',
                g1: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 6 months if no debarring residual impairment.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing may be considered after 10 years seizure-free since the last definitive treatment, if the lesion was completely removed or ablated.']]
            },
            {
                when: 'Incidental supratentorial AVM, no treatment needed',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked permanently.']]
            }
        ],
        note: 'Infratentorial AVM haemorrhage (any treatment): Group 1 may drive after 1 month if no debarring residual impairment and need not notify; Group 2 must not drive and must notify (see source for relicensing). If another procedure is done (for example a shunt or craniotomy for haematoma), its standard also applies.'
    },
    {
        id: 'tbi', cat: 'neuro',
        name: 'Traumatic brain injury (head injury)',
        aka: 'head injury TBI concussion skull fracture contusion post-traumatic amnesia PTA traumatic subarachnoid',
        src: ['neuro', 'traumatic-brain-injury', 'Neurological disorders: Traumatic brain injury'],
        rows: [
            {
                when: 'Full clinical recovery, no seizures (other than at the moment of impact), post-traumatic amnesia 24 hours or less, and no haematoma or contusion on CT',
                g1: [['x', 'Must not drive until recovered. Need not notify DVLA, and may resume on recovery, if all of these criteria are met. A small isolated traumatic subarachnoid haemorrhage is acceptable for Group 1.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing can be reconsidered after 3 months if all the criteria are met. If there was a small subarachnoid haemorrhage but the other criteria are met with documented full recovery: may resume after 6 months.']]
            },
            {
                when: 'Any of: seizures (other than at impact), post-traumatic amnesia over 24 hours, dural tear, haematoma or contusion on CT, incomplete recovery',
                g1: [['x', 'Must not drive. Relicensing is usually considered after 6 to 12 months, depending on these features, with satisfactory recovery and no visual field defect or cognitive impairment likely to affect driving.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked. Relicensing when the annual seizure risk has fallen to 2% or below and there is no debarring residual impairment; the Advisory Panel suggests this is usually by 5 years, sometimes after 2 to 3 years.']]
            }
        ],
        unsure: 'For Group 1 drivers who do not meet all the criteria, the guide says "must not drive but may need to notify DVLA" and describes DVLA relicensing after 6 to 12 months. It does not spell out a separate notification sentence for this group; because DVLA makes the relicensing decision, advising notification is this tool\'s reading of the guide.',
        note: 'A seizure in the first week after a head injury may be treated as provoked. Traumatic subdural haematoma has its own standard. Persisting behavioural change: see behavioural disorders after head injury.'
    },
    {
        id: 'subdural', cat: 'neuro',
        name: 'Subdural haematoma',
        aka: 'SDH subdural chronic subdural burr hole',
        src: ['neuro', 'subdural-haematoma', 'Neurological disorders: Subdural haematoma'],
        rows: [
            {
                when: 'Isolated subdural haematoma without brain injury (treated surgically or not)',
                g1: [['x', 'Must not drive and must notify DVLA. May resume on recovery.']],
                g2: [['x', 'Must not drive and must notify DVLA. At least 6 months off driving, with individual assessment.']]
            },
            {
                when: 'Chronic or acute-on-chronic subdural haematoma (with or without surgery)',
                g1: [['x', 'Must not drive and must notify DVLA. May resume on recovery.']],
                g2: [['x', 'Must not drive and must notify DVLA. 6 months off if uncomplicated, only 1 drainage procedure, no recurrence and no multiple membranes; otherwise 1 year. Seizure risk must be under 2%.']]
            },
            {
                when: 'Traumatic subdural haematoma',
                g1: [['x', 'Must not drive and must notify DVLA. At least 6 months off driving.']],
                g2: [['x', 'Must not drive and must notify DVLA. Traumatic brain injury standards apply; may return when seizure risk is no greater than 2% a year.']]
            }
        ],
        note: 'If another procedure is done (for example a shunt or craniotomy), that standard also applies and may take precedence.'
    },
    {
        id: 'meningitis', cat: 'neuro',
        name: 'Meningitis or encephalitis',
        aka: 'meningitis encephalitis limbic encephalitis viral encephalitis HSV',
        src: ['neuro', 'acute-encephalitic-illness-and-meningitis---including-limbic-encephalitis-associated-with-seizures', 'Neurological disorders: Encephalitis and meningitis'],
        rows: [
            {
                when: 'No seizures',
                g1: [['x', 'Must not drive. May resume after complete clinical recovery; need not notify DVLA unless there is residual disability.']],
                g2: [['x', 'Must not drive. May resume after complete clinical recovery; need not notify DVLA unless there is residual disability.']]
            },
            {
                when: 'With seizures',
                g1: [['x', 'Must not drive and must notify DVLA. Seizures only during the acute febrile illness (no previous unprovoked seizure or cerebral pathology): licence refused or revoked for 6 months. Seizures during or after convalescence, or with previous unprovoked seizure or cerebral pathology: 12 months.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until the seizure regulations (Appendix B) are met.']]
            }
        ]
    },
    {
        id: 'abscess', cat: 'neuro',
        name: 'Intracerebral abscess or subdural empyema',
        aka: 'brain abscess cerebral abscess empyema',
        src: ['neuro', 'intracerebral-abscesssubdural-empyema', 'Neurological disorders: Intracerebral abscess/subdural empyema'],
        rows: [{
            when: 'Intracerebral abscess or subdural empyema',
            g1: [['x', 'Must not drive but need not notify DVLA. May resume after 1 year.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; relicensing not considered for 10 years, with no seizures and no seizure treatment in that time.']]
        }]
    },
    {
        id: 'tga', cat: 'neuro',
        name: 'Transient global amnesia',
        aka: 'TGA amnesia memory loss',
        src: ['neuro', 'transient-global-amnesia', 'Neurological disorders: Transient global amnesia'],
        rows: [{
            when: 'Transient global amnesia',
            g1: [['!', 'May drive once epilepsy, any sequelae of head injury and other causes of altered awareness have been excluded. Need not notify DVLA.']],
            g2: [['!', 'A single confirmed episode does not bar driving. Driving should stop if 2 or more episodes occur, and DVLA must be notified; specialist assessment is needed to exclude other causes of altered awareness.']]
        }]
    },
    {
        id: 'dizziness', cat: 'neuro',
        name: 'Sudden disabling dizziness or vertigo',
        aka: 'vertigo dizziness Meniere vestibular labyrinthitis acoustic neuroma vestibular schwannoma',
        src: ['neuro', 'dizziness--liability-to-sudden-and-unprovoked-or-unprecipitated-episodes-of-disabling-dizziness', 'Neurological disorders: Dizziness'],
        rows: [{
            when: 'Liability to sudden, unprovoked or unprecipitated episodes of disabling dizziness',
            g1: [['x', 'Must not drive on presentation and must notify DVLA. Relicensing may be considered once symptoms are satisfactorily controlled.']],
            g2: [['x', 'Must not drive on presentation and must notify DVLA. Licence refused or revoked if there are sudden disabling symptoms. If the underlying diagnosis is likely to recur, must be asymptomatic and controlled for 1 year from an episode before reapplying.']]
        }],
        note: '"Sudden" means without enough warning to take safe evasive action; "disabling" means unable to continue safely with the activity. Acoustic neuroma/schwannoma: may drive and need not notify unless there is sudden disabling giddiness (or, for Group 2, it is bilateral).'
    },
    {
        id: 'visual-inattention', cat: 'neuro',
        name: 'Visual inattention (neglect)',
        aka: 'neglect visual inattention parietal',
        src: ['neuro', 'visual-inattention', 'Neurological disorders: Visual inattention'],
        rows: [{
            when: 'Clinically apparent visual inattention',
            g1: [['x', 'Must not drive and must notify DVLA. Debarring for licensing.']],
            g2: [['x', 'Must not drive and must notify DVLA. Debarring for licensing.']]
        }]
    },
    {
        id: 'brain-tumour', cat: 'neuro',
        name: 'Brain tumour or brain metastases (summary)',
        aka: 'brain tumour glioma meningioma glioblastoma metastases cerebral metastasis lymphoma',
        src: ['neuro', 'brain-tumours', 'Neurological disorders: Brain tumours'],
        rows: [{
            when: 'Primary brain tumour, metastases or CNS lymphoma',
            g1: [['!', 'Usually must not drive and must notify DVLA; the time off depends on tumour risk group and treatment. The guide classes tumours as very low risk (0 to 6 months off for Group 1), low risk (6 months to 1 year), high risk (2 years), and metastatic disease or CNS lymphoma (most treatments 1 year, whole-brain radiotherapy 2 years). Very low risk tumours under observation only: may drive and need not notify. Untreated high-risk or symptomatic metastatic tumours: a licence will not be considered.']],
            g2: [['x', 'Must not drive and must notify DVLA. Periods range from at least 1 year (with scans 12 months apart confirming stability) to permanent refusal for high-risk tumours.']]
        }],
        unsure: 'Summary only. The guide has a detailed matrix by tumour type, location and treatment; use the source section for any individual patient. Seizure rules apply in addition, and a tumour usually counts as a factor increasing seizure risk.'
    },
    {
        id: 'pituitary', cat: 'neuro',
        name: 'Pituitary tumour (including craniopharyngioma)',
        aka: 'pituitary adenoma apoplexy craniopharyngioma transsphenoidal',
        src: ['neuro', 'pituitary-tumour-including-craniopharyngioma', 'Neurological disorders: Pituitary tumour'],
        rows: [
            {
                when: 'Treated by craniotomy',
                g1: [['x', 'Must not drive and must notify DVLA. May resume after 6 months if there is no visual field defect.']],
                g2: [['x', 'Must not drive and must notify DVLA. Driving prohibited for 2 years.']]
            },
            {
                when: 'No treatment needed, or treated by transsphenoidal surgery, drugs or radiotherapy',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume on recovery if there is no debarring visual field defect.']],
                g2: [['x', 'Must not drive but need not notify DVLA. May resume on recovery if there is no debarring visual field defect.']]
            }
        ]
    },
    {
        id: 'shunt', cat: 'neuro',
        name: 'Shunt or external ventricular drain: insertion or revision of the upper end',
        aka: 'VP shunt ventriculoperitoneal shunt EVD shunt revision hydrocephalus',
        src: ['neuro', 'intraventricular-shunt-or-extraventricular-drain--insertion-or-revision-of-upper-end-of-shunt-or-drain', 'Neurological disorders: Shunt or drain'],
        rows: [{
            when: 'Insertion or revision of the upper end of a shunt or drain',
            g1: [['x', 'Must not drive and must notify DVLA. May be relicensed after 6 months if no debarring residual impairment.']],
            g2: [['x', 'Must not drive and must notify DVLA. May be relicensed after at least 6 months, depending on the underlying condition.']]
        }]
    },
    {
        id: 'chronic-neuro', cat: 'neuro',
        name: 'Chronic neurological disorders (including MS and motor neurone disease)',
        aka: 'multiple sclerosis MS motor neurone disease MND myasthenia neuropathy',
        src: ['neuro', 'chronic-neurological-disorders--including-multiple-sclerosis-and-motor-neurone-disease', 'Neurological disorders: Chronic neurological disorders'],
        rows: [{
            when: 'Any chronic neurological disorder that may affect vehicle control',
            g1: [['!', 'Must notify DVLA. May continue to drive as long as safe vehicle control is maintained at all times. A 1, 2, 3 or 5 year licence may be issued; it may be restricted to cars with certain controls.']],
            g2: [['!', 'Must notify DVLA. May continue as long as safe control is maintained. Licence refused or revoked if the condition is progressive or disabling; otherwise considered individually with annual review.']]
        }]
    },
    {
        id: 'parkinsons', cat: 'neuro',
        name: "Parkinson's disease",
        aka: 'parkinsons parkinson disease movement disorder',
        src: ['neuro', 'parkinsons-disease', "Neurological disorders: Parkinson's disease"],
        rows: [{
            when: "Parkinson's disease",
            g1: [['!', 'Must notify DVLA. May drive as long as safe vehicle control is maintained. Licence refused or revoked if disabling or with clinically significant variability in motor function.']],
            g2: [['!', 'Must notify DVLA. As for Group 1, with assessment and annual review.']]
        }]
    },

    /* ---------------- Cardiovascular ---------------- */
    {
        id: 'angina', cat: 'cardio',
        name: 'Angina (including INOCA)',
        aka: 'angina chest pain stable angina INOCA ischaemia non-obstructive',
        src: ['cardio', 'angina---to-include-inoca-ischaemia-with-non-obstructive-arteries', 'Cardiovascular disorders: Angina'],
        rows: [{
            when: 'Angina',
            g1: [['x', 'Must not drive when symptoms occur at rest, with emotion or at the wheel. May resume after satisfactory symptom control. Need not notify DVLA.']],
            g2: [['x', 'Must notify DVLA. Must not drive when symptoms occur; licence refused or revoked if symptoms continue. May be relicensed if there has been no angina for at least 6 weeks and the exercise or functional test requirements (Appendix C) are met.']]
        }]
    },
    {
        id: 'acs', cat: 'cardio',
        name: 'Acute coronary syndrome (including MINOCA and Takotsubo)',
        aka: 'ACS MI myocardial infarction STEMI NSTEMI heart attack type 2 MI MINOCA Takotsubo stent PCI',
        src: ['cardio', 'ACS', 'Cardiovascular disorders: Acute coronary syndrome'],
        rows: [
            {
                when: 'Treated by successful PCI',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume 1 week after the ACS if no other urgent revascularisation is planned (within 4 weeks), LV ejection fraction is at least 40% before discharge, and there is no other disqualifying condition. If any of these is not met: 4 weeks.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked. May be relicensed after at least 6 weeks if LV ejection fraction is at least 40%, the exercise or functional test requirements (Appendix C) are met and there is no other disqualifying condition.']]
            },
            {
                when: 'Not treated by PCI',
                g1: [['x', 'Must not drive but need not notify DVLA. May resume 4 weeks after the acute event if there is no other disqualifying condition.']],
                g2: [['x', 'Must not drive and must notify DVLA. As above: at least 6 weeks, LVEF at least 40% and functional tests met.']]
            }
        ],
        note: 'Takotsubo cardiomyopathy without known coronary artery disease does not need a functional cardiac test for Group 2. A transient arrhythmia during an ACS is covered by the ACS standard.'
    },
    {
        id: 'elective-pci', cat: 'cardio',
        name: 'Elective PCI (angioplasty)',
        aka: 'elective PCI angioplasty stent',
        src: ['cardio', 'elective-percutaneous-coronary-intervention-pci', 'Cardiovascular disorders: Elective PCI'],
        rows: [{
            when: 'Elective PCI',
            g1: [['x', 'Must not drive for at least 1 week; need not notify DVLA.']],
            g2: [['x', 'Must not drive and must notify DVLA. May be relicensed after at least 6 weeks if LVEF is at least 40% and the functional test requirements are met.']]
        }]
    },
    {
        id: 'cabg', cat: 'cardio',
        name: 'Coronary artery bypass graft (CABG)',
        aka: 'CABG bypass cardiac surgery',
        src: ['cardio', 'coronary-artery-bypass-graft-cabg', 'Cardiovascular disorders: CABG'],
        rows: [{
            when: 'CABG',
            g1: [['x', 'Must not drive for at least 4 weeks; need not notify DVLA.']],
            g2: [['x', 'Must not drive and must notify DVLA. May be relicensed after 3 months if LVEF is at least 40% and the functional test requirements are met at least 3 months after surgery.']]
        }]
    },
    {
        id: 'scad', cat: 'cardio',
        name: 'Spontaneous coronary artery dissection (SCAD)',
        aka: 'SCAD coronary dissection',
        src: ['cardio', 'spontaneous-coronary-artery-dissection-scad', 'Cardiovascular disorders: SCAD'],
        rows: [{
            when: 'SCAD',
            g1: [['x', 'Must not drive but need not notify DVLA. May resume 4 weeks after recovery from the acute event.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; relicensing on individual assessment.']]
        }]
    },
    {
        id: 'arrhythmia', cat: 'cardio',
        name: 'Arrhythmia (AF, flutter, SVT, VT, heart block, sinoatrial disease)',
        aka: 'arrhythmia AF atrial fibrillation atrial flutter SVT tachycardia VT ventricular tachycardia heart block complete heart block bradycardia sick sinus palpitations',
        src: ['cardio', 'arrhythmias', 'Cardiovascular disorders: Arrhythmias'],
        rows: [{
            when: 'Arrhythmia that has caused, or is likely to cause, incapacity',
            g1: [['x', 'Must not drive and must notify DVLA. May resume 4 weeks after an incapacitating event if the cause has been identified and treated and there has been no recurrence of arrhythmia likely to cause incapacity for at least 4 weeks.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked. May be relicensed only if the cause has been identified and treated, no further arrhythmia likely to cause incapacity for at least 3 months, and LVEF is at least 40%.']]
        }],
        note: '"Incapacity" means any condition, symptom or treatment likely to make the person unable to safely control or stop a vehicle. A ventricular arrhythmia leading to a clinical indication or recommendation for an ICD: 6 months off Group 1 driving; Group 2 licence permanently revoked even if no ICD is implanted. Pacemakers and ICDs have separate standards.',
        unsure: 'The guide only sets a restriction for arrhythmias that have caused, or are likely to cause, incapacity. It does not state a separate rule for arrhythmias that are not, so that judgement rests with the clinician.'
    },
    {
        id: 'ablation', cat: 'cardio',
        name: 'Catheter ablation',
        aka: 'ablation EP study AF ablation SVT ablation VT ablation',
        src: ['cardio', 'successful-catheter-ablation', 'Cardiovascular disorders: Successful catheter ablation'],
        rows: [
            {
                when: 'VT ablation with impaired ventricular function, or congenital heart disease',
                g1: [['x', 'Must not drive for at least 4 weeks; need not notify DVLA. Arrhythmia must be controlled.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing after arrhythmia controlled for at least 3 months and LVEF at least 40%.']]
            },
            {
                when: 'Other ablations',
                g1: [['x', 'Must not drive for at least 2 days; need not notify DVLA.']],
                g2: [['x', 'Must not drive for at least 2 weeks; need not notify DVLA. LVEF must be at least 40%.']]
            }
        ]
    },
    {
        id: 'pacemaker', cat: 'cardio',
        name: 'Pacemaker implant or box change',
        aka: 'pacemaker PPM permanent pacemaker box change generator change',
        src: ['cardio', 'pacemaker-implant--including-box-change', 'Cardiovascular disorders: Pacemaker implant'],
        rows: [{
            when: 'Pacemaker implant or box change',
            g1: [['x', 'Must not drive for at least 1 week. Must notify DVLA of a pacemaker implant; need not notify of a box change.']],
            g2: [['x', 'Must not drive for at least 6 weeks. Must notify DVLA of a pacemaker implant; need not notify of a box change.']]
        }]
    },
    {
        id: 'icd', cat: 'cardio',
        name: 'Implantable cardioverter defibrillator (ICD), including ICD shocks',
        aka: 'ICD defibrillator shock appropriate shock inappropriate shock ATP CRT-D',
        src: ['cardio', 'implantable-cardioverter-defibrillator-icd', 'Cardiovascular disorders: ICD'],
        rows: [
            {
                when: 'ICD for sustained ventricular arrhythmia (secondary prevention)',
                g1: [['x', 'Must not drive and must notify DVLA. May resume 6 months after implantation, if the device is under regular review and no further restrictions apply.']],
                g2: G2_ICD_BAR
            },
            {
                when: 'Appropriate shock or incapacitating anti-tachycardia pacing (for VT or VF)',
                g1: [['x', 'Must not drive and must notify DVLA. May resume 6 months after the most recent appropriate therapy.']],
                g2: G2_ICD_BAR
            },
            {
                when: 'Inappropriate shock (for example due to AF or programming)',
                g1: [['x', 'Must not drive. May resume 1 month after complete control of the cause to the cardiologist\'s satisfaction; need not notify DVLA.']],
                g2: G2_ICD_BAR
            },
            {
                when: 'Electrode revision or anti-arrhythmic drug change',
                g1: [['x', 'Must not drive for 1 month; need not notify DVLA.']],
                g2: G2_ICD_BAR
            },
            {
                when: 'ICD box change',
                g1: [['x', 'Must not drive for 1 week; need not notify DVLA.']],
                g2: G2_ICD_BAR
            },
            {
                when: 'Prophylactic ICD (primary prevention) in an asymptomatic person',
                g1: [['x', 'Must not drive for 1 month after implantation and must notify DVLA. If it later delivers a shock or incapacitating anti-tachycardia pacing, apply the secondary prevention rules.']],
                g2: [['x', 'Licence refused or revoked permanently. This also applies if an ICD is recommended but not implanted or is declined.']]
            }
        ]
    },
    {
        id: 'aortic-aneurysm', cat: 'cardio',
        name: 'Aortic aneurysm (thoracic or abdominal, including AAA repair)',
        aka: 'AAA abdominal aortic aneurysm thoracic aneurysm EVAR TEVAR aortic repair ruptured AAA',
        src: ['cardio', 'aortic-aneurysm--ascending-or-descending-thoracic-aorta-which-includes-the-aortic-arch-or-abdominal', 'Cardiovascular disorders: Aortic aneurysm'],
        rows: [
            {
                when: 'Unrepaired aneurysm',
                g1: [['!', 'Under 6.0 cm: may drive and need not notify DVLA.'], ['!', '6.0 to 6.4 cm: may drive but must notify DVLA (annual review licence).'], ['x', '6.5 cm or more: must not drive and must notify DVLA. Licence refused or revoked.']],
                g2: [['!', '5.5 cm or less: may drive but must notify DVLA.'], ['x', 'Over 5.5 cm: must not drive and must notify DVLA. Licence refused or revoked.']]
            },
            {
                when: 'After open repair, EVAR or TEVAR',
                g1: [['!', 'May be relicensed after successful repair, with compliance with clinical review. Endoleak with a stable sac may be relicensed; endoleak with an enlarging sac depends on individual assessment. No unrepaired segment above threshold.']],
                g2: [['!', 'May be relicensed after successful repair. Endoleak with a stable sac: individual assessment. Endoleak with an enlarging sac: not licensed. Functional test requirements apply for abdominal, descending thoracic and arch aneurysms.']]
            }
        ],
        note: 'All patients need regular medical review. Bicuspid aortopathy and Marfan syndrome have separate thresholds: see the source.'
    },
    {
        id: 'aortic-dissection', cat: 'cardio',
        name: 'Aortic dissection',
        aka: 'aortic dissection type A type B',
        src: ['cardio', 'aortic-dissection', 'Cardiovascular disorders: Aortic dissection'],
        rows: [
            {
                when: 'Type A',
                g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked. May be relicensed after successful surgery if aortic diameter (including false lumen) is under 6 cm, blood pressure is satisfactorily controlled with treatment adherence, and there is satisfactory follow-up.']],
                g2: [['x', 'Must not drive and must notify DVLA. May be relicensed after successful surgery if maximum aortic diameter is under 5.5 cm (including false lumen), with complete thrombosis of the false lumen, satisfactory blood pressure control and follow-up.']]
            },
            {
                when: 'Type B',
                g1: [['x', 'Must not drive and must notify DVLA. May be relicensed after successful surgical, interventional or medical treatment if no aortic segment (including false lumen) exceeds 6 cm, with satisfactory blood pressure control and follow-up.']],
                g2: [['x', 'Must not drive and must notify DVLA. May be relicensed if no segment exceeds 5.5 cm, the false lumen is completely thrombosed, and blood pressure and follow-up are satisfactory.']]
            }
        ]
    },
    {
        id: 'hypertension', cat: 'cardio',
        name: 'Hypertension (including malignant hypertension)',
        aka: 'hypertension high blood pressure malignant hypertension hypertensive emergency',
        src: ['cardio', 'hypertension', 'Cardiovascular disorders: Hypertension'],
        rows: [{
            when: 'Hypertension',
            g1: [['!', 'May drive and need not notify DVLA.'], ['x', 'Malignant hypertension (systolic 180 mmHg or more or diastolic 110 mmHg or more, with progressive organ damage): must not drive until effectively treated or controlled; need not notify DVLA.']],
            g2: [['!', 'May drive and need not notify DVLA, except:'], ['x', 'Resting BP consistently 180 mmHg systolic or more and/or 100 mmHg diastolic or more, or malignant hypertension: must not drive and must notify DVLA. May be relicensed once controlled, without treatment side effects affecting driving.']]
        }]
    },
    {
        id: 'heart-failure', cat: 'cardio',
        name: 'Heart failure (including cardiomyopathy)',
        aka: 'heart failure LVSD cardiomyopathy dilated cardiomyopathy NYHA LVAD',
        src: ['cardio', 'heart-failure-including-ischaemic-cardiomyopathy-and-dilated-cardiomyopathy', 'Cardiovascular disorders: Heart failure'],
        rows: [
            {
                when: 'NYHA class I (asymptomatic)',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['!', 'May drive if LVEF is at least 40%, but must notify DVLA.']]
            },
            {
                when: 'NYHA class II',
                g1: [['!', 'May drive if symptoms are stable and not likely to distract or affect safe driving; need not notify DVLA.']],
                g2: [['!', 'May drive if LVEF is at least 40% and symptoms are stable and not distracting, but must notify DVLA.']]
            },
            {
                when: 'NYHA class III',
                g1: [['!', 'May drive if symptoms are stable and not likely to distract or affect safe driving; need not notify DVLA.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; relicensing only when NYHA I or II and LVEF at least 40%.']]
            },
            {
                when: 'NYHA class IV',
                g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; relicensing only when symptoms controlled and NYHA I to III.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing only when NYHA I or II and LVEF at least 40%.']]
            },
            {
                when: 'Left ventricular assist device',
                g1: [['x', 'Must not drive and must notify DVLA. Relicensing on individual assessment, not before 3 months after implantation.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked permanently.']]
            }
        ],
        note: 'DVLA bars Group 2 licensing when LVEF is below 40%.'
    },
    {
        id: 'hcm', cat: 'cardio',
        name: 'Hypertrophic cardiomyopathy (HCM)',
        aka: 'HCM hypertrophic cardiomyopathy HOCM',
        src: ['cardio', 'hypertrophic-cardiomyopathy-hcm', 'Cardiovascular disorders: HCM'],
        rows: [
            {
                when: 'Asymptomatic',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['x', 'Must notify DVLA. Must not drive if high risk on the ESC HCM Risk-SCD calculator or an ICD is indicated or implanted. Low or intermediate risk: licensing permitted if the full 9 minutes of the Bruce protocol can be completed.']]
            },
            {
                when: 'Symptomatic',
                g1: [['ok', 'May drive and need not notify DVLA if symptoms do not cause incapacity or affect safe driving.'], ['x', 'After syncope: must not drive and must notify DVLA. Relicensing needs consultant cardiologist assessment of the cause and risk.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until symptoms are controlled and the asymptomatic criteria are met.']]
            }
        ]
    },
    {
        id: 'aortic-stenosis', cat: 'cardio',
        name: 'Aortic stenosis',
        aka: 'aortic stenosis AS valve',
        src: ['cardio', 'aortic-stenosis-to-include-sub-aortic-and-supra-aortic-stenosis', 'Cardiovascular disorders: Aortic stenosis'],
        rows: [
            {
                when: 'No syncope, presyncope or symptoms likely to affect safe driving',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['!', 'Mild or moderate: may drive and need not notify DVLA (moderate must be under regular review; notify if it becomes severe).'], ['x', 'Severe: must not drive and must notify DVLA. An annual licence may be issued if DVLA exercise test requirements are met.']]
            },
            {
                when: 'With syncope, presyncope or symptoms likely to affect safe driving',
                g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked pending assessment and treatment.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked pending assessment and treatment.']]
            }
        ]
    },
    {
        id: 'valve-surgery', cat: 'cardio',
        name: 'Heart valve surgery or percutaneous valve intervention (including TAVI)',
        aka: 'valve replacement AVR MVR TAVI TAVR mitral clip',
        src: ['cardio', 'heart-valve-surgery--including-percutaneous-valve-intervention', 'Cardiovascular disorders: Heart valve surgery'],
        rows: [{
            when: 'Valve surgery or percutaneous intervention',
            g1: [['x', 'Must not drive for 4 weeks after surgical intervention or 2 weeks after percutaneous intervention; need not notify DVLA.']],
            g2: [['x', 'Must not drive for 3 months and must notify DVLA. Relicensing after 3 months if LVEF at least 40% and no ongoing symptoms.']]
        }]
    },
    {
        id: 'valve-disease', cat: 'cardio',
        name: 'Heart valve disease (other than aortic stenosis)',
        aka: 'mitral regurgitation aortic regurgitation valve disease endocarditis murmur',
        src: ['cardio', 'heart-valve-disease', 'Cardiovascular disorders: Heart valve disease'],
        rows: [
            {
                when: 'Asymptomatic',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['ok', 'May drive and need not notify DVLA.']]
            },
            {
                when: 'Symptomatic',
                g1: [['ok', 'May drive and need not notify DVLA if there is no other disqualifying condition (apply heart failure standards if relevant).']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing once asymptomatic. After cerebral embolism: relicensing may be considered after 12 months following cardiological assessment.']]
            }
        ]
    },
    {
        id: 'long-qt', cat: 'cardio',
        name: 'Long QT syndrome',
        aka: 'long QT QTc torsades de pointes',
        src: ['cardio', 'long-qt-syndrome', 'Cardiovascular disorders: Long QT syndrome'],
        rows: [{
            when: 'History of syncope or torsades de pointes, or QTc over 500 ms',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; relicensing after specialist cardiologist assessment and the syncope standards are met.']],
            g2: [['x', 'Must not drive and must notify DVLA (also if symptomatic). Relicensing once asymptomatic, after specialist cardiologist assessment and the syncope standards are met.']]
        }],
        unsure: 'The guide does not give a separate standard for asymptomatic long QT with QTc of 500 ms or less and no syncope or torsades.'
    },
    {
        id: 'brugada', cat: 'cardio',
        name: 'Brugada syndrome (type 1 ECG pattern)',
        aka: 'Brugada type 1 pattern',
        src: ['cardio', 'brugada-syndrome-found-by-an-ecg-type-1-pattern', 'Cardiovascular disorders: Brugada syndrome'],
        rows: [
            {
                when: 'Brugada ECG with no symptoms',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['x', 'Licence revoked. Relicensing depends on a favourable report from an appropriate specialist.']]
            },
            {
                when: 'Symptoms clinically confirmed to be reflex syncope only',
                g1: [['ok', 'May drive and need not notify DVLA provided the relevant transient loss of consciousness standards are met.']],
                g2: [['x', 'Licence revoked. Relicensing depends on a favourable specialist report.']]
            },
            {
                when: 'Arrhythmia with incapacity, or aborted sudden cardiac death',
                g1: [['x', 'Must not drive and must notify DVLA. Relicensing after specialist assessment, with the TLoC, ICD and arrhythmia standards met.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence permanently revoked.']]
            },
            {
                when: 'Loss of consciousness with no cause identified',
                g1: [['x', 'Must not drive and must notify DVLA. Relicensing after specialist assessment, with the loss of consciousness, ICD and arrhythmia standards met.']],
                g2: [['x', 'Must not drive and must notify DVLA. Relicensing after specialist assessment, with the loss of consciousness, ICD and arrhythmia standards met.']]
            }
        ],
        note: 'Appropriate specialist: a consultant electrophysiologist or a specialist in inherited cardiac conditions. Their report should address the risk of a further event (no more than 20% a year for Group 1, 2% a year for Group 2).'
    },
    {
        id: 'pre-excitation', cat: 'cardio',
        name: 'Pre-excitation (for example WPW pattern)',
        aka: 'WPW Wolff-Parkinson-White pre-excitation delta wave',
        src: ['cardio', 'pre-excitation', 'Cardiovascular disorders: Pre-excitation'],
        rows: [{
            when: 'Pre-excitation',
            g1: [['ok', 'May drive and need not notify DVLA.']],
            g2: [['!', 'May drive and need not notify DVLA, unless associated with arrhythmia, when the arrhythmia standards apply.']]
        }]
    },
    {
        id: 'lbbb', cat: 'cardio',
        name: 'Left bundle branch block',
        aka: 'LBBB bundle branch block',
        src: ['cardio', 'left-bundle-branch-block', 'Cardiovascular disorders: Left bundle branch block'],
        rows: [{
            when: 'Left bundle branch block',
            g1: [['ok', 'May drive and need not notify DVLA.']],
            g2: [['!', 'May drive but must notify DVLA. Relicensing if myocardial perfusion scan or stress echo requirements (Appendix C) are met.']]
        }]
    },
    {
        id: 'pulm-htn', cat: 'cardio',
        name: 'Pulmonary arterial hypertension (established diagnosis)',
        aka: 'pulmonary hypertension PAH CTEPH',
        src: ['cardio', 'pulmonary-arterial-hypertension-including-chronic-thromboembolic-pulmonary-hypertension--an-established-diagnosis-under-the-care-of-a-specialist-centre', 'Cardiovascular disorders: Pulmonary arterial hypertension'],
        rows: [{
            when: 'Pulmonary arterial hypertension under a specialist centre',
            g1: [['!', 'Must notify DVLA. Low or intermediate risk: may drive (3-year review licence). High risk: may drive only if a specialist assesses the risk of a sudden disabling event as under 20% a year and the syncope standards are met (1-year licence).']],
            g2: [['x', 'Must not drive and must notify DVLA. Low risk: driving may be allowed if a specialist assesses the risk as under 2% a year (1-year licence). Intermediate or high risk: licence refused or revoked.']]
        }]
    },
    {
        id: 'pad', cat: 'cardio',
        name: 'Peripheral arterial disease',
        aka: 'PAD peripheral vascular disease claudication',
        src: ['cardio', 'peripheral-arterial-disease', 'Cardiovascular disorders: Peripheral arterial disease'],
        rows: [{
            when: 'Peripheral arterial disease',
            g1: [['ok', 'May drive and need not notify DVLA.']],
            g2: [['!', 'May drive but must notify DVLA. Licensed only if no symptomatic myocardial ischaemia and the functional test requirements are met.']]
        }]
    },

    /* ---------------- Diabetes & metabolic ---------------- */
    {
        id: 'insulin', cat: 'diabetes',
        name: 'Insulin-treated diabetes',
        aka: 'insulin type 1 diabetes type 2 insulin new insulin CGM Libre Dexcom glucose monitoring',
        src: ['diab', 'insulin-treated-diabetes', 'Diabetes mellitus: Insulin-treated diabetes'],
        rows: [{
            when: 'On insulin (other than temporary treatment)',
            g1: [['!', 'Must notify DVLA and meet all the criteria: adequate awareness of hypoglycaemia; not 2 or more severe hypos while awake in the last 12 months (and the most recent over 3 months ago); appropriate glucose monitoring (at the start of the first journey and at least every 2 hours while driving); meets the vision standards; no disqualifying complications; under regular review. Licence for 1, 2 or 3 years.']],
            g2: [['!', 'Must stop Group 2 driving when starting insulin until DVLA decides, and must notify DVLA. Needs full hypoglycaemia awareness, no severe hypo in the last 12 months, glucose testing at least twice daily (including non-driving days) and before and every 2 hours during driving, 4 weeks of stored meter readings, and an annual independent diabetes specialist examination. 1-year licence.']]
        }],
        note: 'CGM may be used for driving if approved for non-adjunctive use; drivers must also carry a finger-prick meter. Alarms should be set above 4.0 mmol/L while driving. A driver who depends on alarms to recognise low glucose must stop driving and notify DVLA.'
    },
    {
        id: 'severe-hypo', cat: 'diabetes',
        name: 'Severe hypoglycaemia in diabetes',
        aka: 'hypo hypoglycaemia severe hypo paramedic glucagon low sugar',
        src: ['diab', 'recurrent-severe-hypoglycaemia-guidance', 'Diabetes mellitus: Recurrent severe hypoglycaemia'],
        rows: [
            {
                when: 'Severe hypoglycaemia (needing another person\'s help) while driving',
                g1: [['x', 'Must not drive and must notify DVLA.']],
                g2: [['x', 'Must not drive and must notify DVLA.']]
            },
            {
                when: 'Severe hypoglycaemia not while driving',
                g1: [['x', '2 or more episodes while awake in the last 12 months: must not drive and must notify DVLA. DVLA will make medical enquiries.'], ['!', 'Episodes during established sleep are not relevant for Group 1 licensing unless there are concerns about the ability to recognise low glucose.']],
                g2: [['x', 'Any episode in the last 12 months, including during sleep: must not drive and must notify DVLA.']]
            }
        ],
        unsure: 'For Group 1, the guide sets the threshold at 2 or more severe episodes while awake in 12 months. It has no separate rule for a single episode, so check the driver still meets the other criteria (awareness, monitoring) for their treatment.',
        note: 'If the hypoglycaemia caused a seizure: must not drive and must notify DVLA (both groups); the provoked seizure standard applies.'
    },
    {
        id: 'hypo-unawareness', cat: 'diabetes',
        name: 'Impaired awareness of hypoglycaemia',
        aka: 'hypo unawareness hypoglycaemia unawareness',
        src: ['diab', 'impaired-awareness-of-hypoglycaemia--hypoglycaemia-unawareness', 'Diabetes mellitus: Impaired awareness of hypoglycaemia'],
        rows: [{
            when: 'Impaired awareness (no warning symptoms of a low or falling glucose)',
            g1: [['x', 'Must not drive and must notify DVLA. May resume once a GP or consultant diabetes specialist report confirms awareness has been regained.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked; full awareness is required.']]
        }]
    },
    {
        id: 'sulphonylurea', cat: 'diabetes',
        name: 'Diabetes on tablets with hypoglycaemia risk (sulphonylureas, glinides)',
        aka: 'gliclazide sulphonylurea glinide repaglinide nateglinide tablets',
        src: ['diab', 'managed-by-tablets-carrying-hypoglycaemia-risk', 'Diabetes mellitus: Tablets carrying hypoglycaemia risk'],
        rows: [{
            when: 'Sulphonylureas or glinides',
            g1: [['!', 'May drive and need not notify DVLA, provided: adequate awareness of hypoglycaemia; not 2 or more severe hypos while awake in the last 12 months (most recent over 3 months ago); under regular review; no disqualifying complications. Glucose monitoring at times relevant to driving is advisable.']],
            g2: [['!', 'May drive but must notify DVLA. Needs no severe hypo in 12 months, full awareness, glucose testing at least twice daily and at times relevant to driving, understanding of hypoglycaemia risks and regular review.']]
        }]
    },
    {
        id: 'other-diabetes', cat: 'diabetes',
        name: 'Diabetes on other medication or diet alone',
        aka: 'metformin gliptin DPP-4 SGLT2 GLP-1 semaglutide diet controlled',
        src: ['diab', 'managed-by-other-medication---such-medication-includes-metformin-dpp-4-inhibitors-gliptins-sglt2-inhibitors-glp-1-agonists-and-non-insulin-injectables', 'Diabetes mellitus: Other medication'],
        rows: [
            {
                when: 'Metformin, DPP-4 inhibitors, SGLT2 inhibitors, GLP-1 agonists, other non-insulin injectables',
                g1: [['!', 'May drive and need not notify DVLA, provided the Appendix E requirements are met, under regular review and no disqualifying complications.']],
                g2: [['!', 'May drive but must notify DVLA.']]
            },
            {
                when: 'Diet or lifestyle alone',
                g1: [['ok', 'May drive and need not notify DVLA, if no disqualifying complications.']],
                g2: [['ok', 'May drive and need not notify DVLA, if no disqualifying complications.']]
            }
        ]
    },
    {
        id: 'temporary-insulin', cat: 'diabetes',
        name: 'Temporary insulin (for example gestational diabetes, post-MI)',
        aka: 'gestational diabetes temporary insulin post MI insulin',
        src: ['diab', 'temporary-insulin-treatment--including-gestational-diabetes-or-post-myocardial-infarction', 'Diabetes mellitus: Temporary insulin treatment'],
        rows: [{
            when: 'Temporary insulin treatment',
            g1: [['!', 'May drive and need not notify DVLA if under medical supervision and not advised as at risk of disabling hypoglycaemia. Must notify DVLA if disabling hypoglycaemia occurs, or treatment continues for more than 3 months (gestational diabetes: more than 3 months after delivery).']],
            g2: [['x', 'Must notify DVLA and meet the insulin-treated standards.']]
        }]
    },
    {
        id: 'nondiabetic-hypo', cat: 'diabetes',
        name: 'Severe hypoglycaemia from causes other than diabetes treatment',
        aka: 'post bariatric hypoglycaemia dumping eating disorder hypoglycaemia insulinoma',
        src: ['diab', 'severe-hypoglycaemia-due-to-causes-other-than-diabetes-management', 'Diabetes mellitus: Severe hypoglycaemia from other causes'],
        rows: [{
            when: 'Severe hypoglycaemia (for example after bariatric surgery or with an eating disorder)',
            g1: [['x', 'Must stop driving and must notify DVLA. Licensing needs adequate awareness, appropriate glucose monitoring, understanding of the risks and regular clinical review.']],
            g2: [['x', 'Must stop driving and must notify DVLA. Licensing also needs full awareness and no severe episode in the last 12 months.']]
        }]
    },
    {
        id: 'hepatic-enceph', cat: 'diabetes',
        name: 'Hepatic encephalopathy',
        aka: 'hepatic encephalopathy cirrhosis liver failure liver transplant',
        src: ['misc', 'hepatic-encephalopathy', 'Miscellaneous conditions: Hepatic encephalopathy'],
        rows: [
            {
                when: 'Overt hepatic encephalopathy',
                g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked. Licensing may be considered 6 months after recovery, with a consultant hepatologist report.']],
                g2: [['x', 'Must not drive and must notify DVLA. As for Group 1, and a formal driving assessment will be needed.']]
            },
            {
                when: 'Minimal hepatic encephalopathy (diagnosed on testing)',
                g1: [['!', 'May drive but must notify DVLA. Licensing depends on a consultant hepatologist report; a review licence may be issued.']],
                g2: [['x', 'Must not drive and must notify DVLA.']]
            }
        ]
    },
    {
        id: 'renal', cat: 'diabetes',
        name: 'Renal failure and dialysis',
        aka: 'CKD renal failure dialysis haemodialysis peritoneal dialysis CAPD hyperkalaemia electrolyte',
        src: ['renal', 'chronic-renal-failure', 'Renal and respiratory disorders: Chronic renal failure'],
        rows: [{
            when: 'Haemodialysis or peritoneal dialysis (CAPD)',
            g1: [['!', 'May drive and need not notify DVLA unless there is a disability likely to affect driving and/or significant electrolyte disturbance likely to cause symptoms.']],
            g2: [['!', 'As for Group 1. Individual assessment is needed for relicensing.']]
        }, {
            when: 'All other renal disorders',
            g1: [['!', 'May drive and need not notify DVLA unless associated with a disability likely to affect driving.']],
            g2: [['!', 'May drive and need not notify DVLA unless associated with a disability or any significant symptoms likely to affect driving.']]
        }]
    },

    /* ---------------- Psychiatric ---------------- */
    {
        id: 'mild-depression', cat: 'psych',
        name: 'Anxiety or depression: mild to moderate',
        aka: 'anxiety depression low mood panic',
        src: ['psych', 'anxiety-or-depression--mild-to-moderate', 'Psychiatric disorders: Anxiety or depression, mild to moderate'],
        rows: [{
            when: 'Without significant memory or concentration problems, agitation, behavioural disturbance or suicidal thoughts',
            g1: [['ok', 'May drive and need not notify DVLA. Consider medication effects (Appendix F).']],
            g2: [['ok', 'May drive and need not notify DVLA. Consider medication effects (Appendix F).']]
        }],
        note: 'If the illness has been associated with substance misuse, continued misuse rules out driving. Persistent alcohol or drug misuse: apply those standards too.'
    },
    {
        id: 'severe-depression', cat: 'psych',
        name: 'Anxiety or depression: severe (including suicidal thoughts)',
        aka: 'severe depression suicidal ideation suicidal thoughts self-harm overdose suicide attempt agitation',
        src: ['psych', 'severe-anxiety-or-depression', 'Psychiatric disorders: Severe anxiety or depression'],
        rows: [{
            when: 'Significant memory or concentration problems, agitation, behavioural disturbance or suicidal thoughts',
            g1: [['x', 'Must not drive and must notify DVLA. Licensing may be granted after 3 months if well and stable, adhering to agreed treatment and free of medication side effects affecting alertness or concentration.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licensing may be granted after 6 months on the same conditions; DVLA may need a psychiatrist report. Usually permitted after 6 months if long-standing symptoms are controlled and maintenance psychotropic medication does not impair driving.']]
        }],
        note: 'The guide highlights the particular danger from people who may attempt suicide at the wheel. The effects of severe illness matter more than medication.',
        unsure: 'The guide has no separate standard for self-harm or overdose. This tool lists them here because the severe anxiety or depression standard covers suicidal thoughts; apply the substance misuse standards as well where relevant.'
    },
    {
        id: 'psychosis', cat: 'psych',
        name: 'Psychotic disorder (including an acute episode)',
        aka: 'psychosis acute psychosis first episode psychosis drug-induced psychosis delusions hallucinations',
        src: ['psych', 'psychotic-disorder--including-acute-episode', 'Psychiatric disorders: Psychotic disorder'],
        rows: [{
            when: 'Psychotic disorder',
            g1: [['x', 'Must not drive during acute illness and must notify DVLA. Licensing may be considered when well and stable for at least 3 months, adhering to treatment, free of medication effects that impair driving, with a favourable specialist report. Lack of insight that affects safe driving bars licensing; instability or poor engagement means a longer period off.']],
            g2: [['x', 'Must not drive during acute illness and must notify DVLA. As for Group 1 but at least 12 months well and stable, with a favourable psychiatrist report; minimum effective antipsychotic dose and low relapse risk.']]
        }],
        note: 'Psychosis caused by alcohol: see alcohol-related disorders. Continued substance misuse rules out licensing.'
    },
    {
        id: 'mania', cat: 'psych',
        name: 'Hypomania or mania (bipolar disorder)',
        aka: 'mania hypomania bipolar affective disorder mood swings',
        src: ['psych', 'hypomania-or-mania', 'Psychiatric disorders: Hypomania or mania'],
        rows: [
            {
                when: 'Stable (no driving during any acute illness)',
                g1: [['x', 'Must not drive and must notify DVLA. Licensing may be considered when well and stable for at least 3 months, adhering to treatment, free of impairing medication effects, with a favourable specialist report. Lack of insight affecting safe driving bars licensing.']],
                g2: [['x', 'Must not drive and must notify DVLA. As for Group 1 but at least 12 months well and stable, with a favourable psychiatrist report.']]
            },
            {
                when: 'Unstable: 4 or more episodes of significant mood swing in the previous 12 months',
                g1: [['x', 'Must not drive and must notify DVLA. Licensing may be considered when well and stable for at least 6 months, with the other conditions above.']],
                g2: [['x', 'Must not drive and must notify DVLA. At least 12 months well and stable, with a favourable psychiatrist report.']]
            }
        ],
        note: 'For Group 2, the minimum effective antipsychotic dose should be used, without driving-impairing side effects, and relapse risk must be low.'
    },
    {
        id: 'schizophrenia', cat: 'psych',
        name: 'Schizophrenia and other chronic relapsing or remitting disorders',
        aka: 'schizophrenia schizoaffective chronic psychosis',
        src: ['psych', 'schizophrenia--and-other-chronic-relapsingremitting-disorders', 'Psychiatric disorders: Schizophrenia'],
        rows: [{
            when: 'Schizophrenia (no driving during any acute illness)',
            g1: [['x', 'Must not drive and must notify DVLA. Licensing may be considered when well and stable for at least 3 months, adequately adhering to treatment, free of impairing medication effects, with a favourable specialist report. Continuing symptoms do not necessarily preclude licensing, but lack of insight affecting safe driving does.']],
            g2: [['x', 'Must not drive and must notify DVLA. At least 12 months well and stable (longer with a history of relapses), favourable psychiatrist report, minimum effective antipsychotic dose and low relapse risk.']]
        }],
        note: 'Driving is particularly dangerous if psychotic symptoms relate to other road users.'
    },
    {
        id: 'neurodevelopmental', cat: 'psych',
        name: 'Neurodevelopmental conditions (ADHD, autism)',
        aka: 'ADHD autism ASD ASC attention deficit neurodivergent',
        src: ['psych', 'neurological-developmental-conditions', 'Psychiatric disorders: Neurological developmental conditions'],
        rows: [{
            when: 'Any neurodevelopmental condition, including ADHD and autism',
            g1: [['!', 'The diagnosis is not in itself a bar. Must notify DVLA only if the condition affects the ability to drive safely (for example significant problems with attention, memory, impulsivity, emotional regulation, insight, anticipating others, sensory processing or motor control), if it changes, or if medication or its side effects are likely to impair driving.']],
            g2: [['!', 'As for Group 1.']]
        }],
        note: 'Someone who has passed a driving test has already demonstrated the attributes for safe driving.'
    },
    {
        id: 'cognitive-impairment', cat: 'psych',
        name: 'Cognitive impairment (not dementia)',
        aka: 'cognitive impairment MCI memory problems confusion',
        src: ['psych', 'cognitive-impairment-not-mild-dementia', 'Psychiatric disorders: Cognitive impairment'],
        rows: [
            {
                when: 'No likely driving impairment',
                g1: [['ok', 'May drive and need not notify DVLA.']],
                g2: [['ok', 'May drive and need not notify DVLA.']]
            },
            {
                when: 'Possible driving impairment',
                g1: [['!', 'May be able to drive but must notify DVLA. Poor short-term memory, disorientation and lack of insight and judgement almost certainly mean not fit to drive. A formal driving assessment may be needed; a review licence may be issued.']],
                g2: [['!', 'May be able to drive but must notify DVLA. As for Group 1.']]
            }
        ]
    },
    {
        id: 'dementia', cat: 'psych',
        name: 'Dementia or any organic syndrome affecting cognition',
        aka: 'dementia Alzheimer vascular dementia organic brain syndrome',
        src: ['psych', 'dementia--andor-any-organic-syndrome-affecting-cognitive-functioning', 'Psychiatric disorders: Dementia'],
        rows: [{
            when: 'Dementia',
            g1: [['!', 'May be able to drive but must notify DVLA. Poor short-term memory, disorientation and lack of insight and judgement almost certainly mean no fitness to drive. In early dementia with slow progression a licence may be issued with annual review. A formal driving assessment may be needed.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked.']]
        }],
        note: 'GMC guidance: if a patient cannot understand the advice (for example because of dementia), inform DVLA as soon as practicable.'
    },
    {
        id: 'learning-disability', cat: 'psych',
        name: 'Learning disability',
        aka: 'learning disability intellectual disability',
        src: ['psych', 'learning-disability', 'Psychiatric disorders: Learning disability'],
        rows: [
            {
                when: 'Mild or moderate',
                g1: [['!', 'May be able to drive but must notify DVLA. Licensing granted if no other relevant problems; the driving test is the arbiter.']],
                g2: [['!', 'May be able to drive but must notify DVLA. Only minor degrees, stable and without complications.']]
            },
            {
                when: 'Severe',
                g1: [['x', 'Must not drive and must notify DVLA. Licence refused.']],
                g2: [['x', 'Must not drive and must notify DVLA. Licence refused.']]
            }
        ],
        note: 'Learning difficulties such as dyslexia or dyscalculia are not a bar to Group 1 and DVLA need not be told.'
    },
    {
        id: 'behavioural', cat: 'psych',
        name: 'Behavioural disorders (including after head injury)',
        aka: 'behavioural disturbance aggression post head injury disinhibition',
        src: ['psych', 'behavioural-disorders--including-post-head-injury', 'Psychiatric disorders: Behavioural disorders'],
        rows: [{
            when: 'Severe disturbance, for example a syndrome after head injury',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked if there is serious disturbance (for example violent behaviour or alcohol misuse likely to be dangerous at the wheel). Licensing once medical reports confirm satisfactory control and stability.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licensing if a specialist confirms satisfactory control and stability.']]
        }]
    },
    {
        id: 'personality', cat: 'psych',
        name: 'Personality disorders',
        aka: 'personality disorder EUPD BPD emotionally unstable antisocial',
        src: ['psych', 'personality-disorders', 'Psychiatric disorders: Personality disorders'],
        rows: [{
            when: 'Severe disturbance',
            g1: [['!', 'May be able to drive but must notify DVLA. Licence refused or revoked if likely to be a danger at the wheel; may be granted if behavioural disturbance is not related to, or not likely to adversely affect, driving.']],
            g2: [['x', 'Must not drive and must notify DVLA. As for Group 1, and a specialist must confirm stability.']]
        }]
    },
    {
        id: 'ect', cat: 'psych',
        name: 'Electroconvulsive therapy (ECT)',
        aka: 'ECT electroconvulsive therapy',
        src: ['app', 'electroconvulsive-therapy', 'Appendix F: Electroconvulsive therapy'],
        rows: [{
            when: 'Acute or maintenance ECT',
            g1: [['x', 'Should be advised to notify DVLA. Must not drive during an acute course, nor until the standard for the underlying condition is met. Must not drive for 48 hours after any anaesthetic. Infrequent maintenance ECT with minimal symptoms does not affect licensing if there is no relapse.']],
            g2: [['x', 'As for Group 1.']]
        }],
        note: 'An ECT-induced seizure is provoked and is not a bar to licensing for either group.'
    },
    {
        id: 'psych-other', cat: 'psych',
        name: 'Other mental health conditions not listed',
        aka: 'eating disorder anorexia PTSD OCD dissociation other psychiatric',
        src: ['app', 'all-mental-health-symptoms-must-be-considered', 'Appendix F: All mental health symptoms must be considered'],
        rows: [{
            when: 'A psychiatric condition that does not fit the listed classifications',
            g1: [['!', 'Must be reported to DVLA if it is causing, or likely to cause, symptoms that would affect driving, such as impaired consciousness or awareness, increased distractibility, or other symptoms affecting safe vehicle control. Declare both the condition and the symptoms.']],
            g2: [['!', 'As for Group 1; Group 2 standards are stricter.']]
        }],
        unsure: 'The guide does not name specific conditions such as eating disorders, PTSD or OCD. They are listed here as search terms only; the Appendix F principle is what applies. Severe hypoglycaemia linked to an eating disorder has its own standard.'
    },

    /* ---------------- Alcohol, drugs & medication ---------------- */
    {
        id: 'alcohol-misuse', cat: 'substances',
        name: 'Persistent alcohol misuse, or dependence without high-risk features',
        aka: 'alcohol misuse alcohol use disorder harmful drinking alcohol dependence ETOH',
        src: ['drugs', 'persistent-alcohol-misuse', 'Drug or alcohol misuse: Persistent alcohol misuse'],
        rows: [{
            when: 'Persistent misuse or dependence without high-risk features',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until at least 6 months of controlled drinking or abstinence.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until at least 1 year of controlled drinking or abstinence.']]
        }],
        note: 'High-risk features: alcohol withdrawal seizures (not alcohol-associated seizures) and/or needing medication-assisted withdrawal. If either is present, use the dependence with high-risk features standard.'
    },
    {
        id: 'alcohol-dependence', cat: 'substances',
        name: 'Alcohol dependence with high-risk features (withdrawal seizures or medication-assisted withdrawal)',
        aka: 'alcohol dependence detox chlordiazepoxide medically assisted withdrawal alcohol withdrawal seizure delirium tremens',
        src: ['drugs', 'alcohol-dependence', 'Drug or alcohol misuse: Alcohol dependence'],
        rows: [{
            when: 'Dependence with one or more high-risk features',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until at least 1 year of abstinence; continued licensing needs ongoing abstinence for at least 3 years, monitored by DVLA.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until at least 3 years of abstinence; continued licensing needs abstinence for at least 5 years.']]
        }],
        note: 'Alcohol-related seizures may be treated as provoked, but the dependence standards also apply.'
    },
    {
        id: 'alcohol-related', cat: 'substances',
        name: 'Alcohol-related disorders (for example alcohol-induced psychosis, cognitive impairment)',
        aka: 'alcohol induced psychosis Korsakoff Wernicke alcohol related brain damage',
        src: ['drugs', 'alcohol-related-disorders', 'Drug or alcohol misuse: Alcohol-related disorders'],
        rows: [{
            when: 'Alcohol-related disorder',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until recovery is satisfactory and any other relevant standards (for example psychiatric) are met.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked until recovery is satisfactory.']]
        }]
    },
    {
        id: 'drugs-a', cat: 'substances',
        name: 'Drug misuse or dependence: cannabis, amphetamines, MDMA, ketamine, LSD and other psychoactive substances',
        aka: 'cannabis weed amphetamine speed ecstasy MDMA ketamine LSD hallucinogens psychoactive',
        src: ['drugs', 'drug-misuse-or-dependence', 'Drug or alcohol misuse: Drug misuse or dependence'],
        rows: [{
            when: 'Persistent misuse or dependence',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked for at least 6 months free of misuse or dependence. Relicensing may need a DVLA medical and urine screen.']],
            g2: [['x', 'Must not drive and must notify DVLA. At least 1 year free of misuse or dependence; relicensing usually needs a DVLA medical and urine screen.']]
        }],
        note: 'These periods apply to single-substance misuse. Multiple substance problems, including with alcohol, are not compatible with licensing in either group. Methamphetamine is in the higher-risk group.'
    },
    {
        id: 'drugs-b', cat: 'substances',
        name: 'Drug misuse or dependence: opiates, opioids, benzodiazepines, cocaine, methamphetamine, synthetic cannabinoids',
        aka: 'heroin opiates opioids codeine benzodiazepines diazepam street benzos cocaine crack methamphetamine crystal meth synthetic cannabinoids spice synthetic benzodiazepines methadone',
        src: ['drugs', 'drug-misuse-or-dependence', 'Drug or alcohol misuse: Drug misuse or dependence'],
        rows: [{
            when: 'Persistent misuse or dependence',
            g1: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked for at least 1 year free of misuse or dependence. Relicensing may need a DVLA medical and urine screen.']],
            g2: [['x', 'Must not drive and must notify DVLA. At least 3 years free of misuse or dependence; relicensing usually needs a DVLA medical and urine screen.']]
        }],
        note: 'Multiple substance problems, including with alcohol, are not compatible with licensing. Drug-related seizures may be treated as provoked, but the misuse standards also apply.'
    },
    {
        id: 'ost', cat: 'substances',
        name: 'Methadone or buprenorphine maintenance programme',
        aka: 'methadone buprenorphine opioid substitution OST Subutex Espranor',
        src: ['drugs', 'note-on-methadonebuprenorphine-treatment-programmes', 'Drug or alcohol misuse: Methadone/buprenorphine programmes'],
        rows: [{
            when: 'Complying fully with a maintenance programme',
            g1: [['!', 'May be licensed after favourable assessment, normally with annual review, once stable on the programme for at least 1 year, with full compliance, oral or sublingual treatment (long-acting subcutaneous buprenorphine or naltrexone implants may be considered), and no non-prescribed drug use.']],
            g2: [['!', 'May be considered for an annual review licence once stable on the programme for at least 3 years, on the same conditions.']]
        }]
    },
    {
        id: 'medication', cat: 'substances',
        name: 'Prescribed medication effects (sedating drugs)',
        aka: 'drug driving benzodiazepines opioids morphine antidepressants antipsychotics sedation gabapentinoids prescription',
        src: ['misc', 'medication-effects', 'Miscellaneous conditions: Medication effects'],
        rows: [{
            when: 'Taking medication that may impair driving',
            g1: [['!', 'It is an offence to drive while unfit through any drug, prescribed or not. Advise about sedation and impaired judgement, especially when starting or increasing a dose, and that alcohol potentiates effects. Drivers on drugs covered by drug-driving law should carry evidence that they were prescribed.']],
            g2: [['!', 'As for Group 1; also consider sedating and epileptogenic effects carefully in professional drivers.']]
        }],
        note: 'The guide names benzodiazepines (especially long-acting), sedating tricyclics, sedating antipsychotics and opioids. Doctors have a duty to advise patients about adverse effects and interactions, especially with alcohol (Appendix F).'
    },

    /* ---------------- Vision ---------------- */
    {
        id: 'vision-standard', cat: 'vision',
        name: 'Visual acuity: minimum eyesight standard',
        aka: 'visual acuity eyesight number plate Snellen 6/12 reduced vision',
        src: ['vision', 'minimum-eyesight-standards--all-drivers', 'Visual disorders: Minimum eyesight standards'],
        rows: [{
            when: 'Cannot meet the minimum standard',
            g1: [['x', 'Must be able to read a number plate at 20 metres in good daylight (glasses or contact lenses allowed) and have acuity of at least 6/12 with both eyes open (or in the only eye). If not met: must not drive and must notify DVLA.']],
            g2: [['x', 'Also needs at least 6/7.5 in the better eye and 6/60 in the poorer eye (glasses no stronger than +8 dioptres). If not met: must not drive and must notify DVLA.']]
        }]
    },
    {
        id: 'visual-field', cat: 'vision',
        name: 'Visual field defects (including hemianopia)',
        aka: 'visual field defect hemianopia quadrantanopia glaucoma field loss bitemporal',
        src: ['vision', 'visual-field-defects', 'Visual disorders: Visual field defects'],
        rows: [{
            when: 'Any disorder producing a field defect, for example homonymous hemianopia or quadrantanopia, complete bitemporal hemianopia, bilateral glaucoma',
            g1: [['!', 'Must notify DVLA. The field standard must be met: at least 120° horizontally, at least 50° left and right, and no significant defect within 20° of fixation. Homonymous or bitemporal defects close to fixation are not usually acceptable.']],
            g2: [['!', 'Must notify DVLA. Needs at least 160° horizontally, 70° left and right, 30° up and down, and no defect within the central 30°.']]
        }]
    },
    {
        id: 'diplopia', cat: 'vision',
        name: 'Diplopia (double vision)',
        aka: 'diplopia double vision cranial nerve palsy sixth nerve third nerve',
        src: ['vision', 'diplopia', 'Visual disorders: Diplopia'],
        rows: [{
            when: 'Diplopia',
            g1: [['x', 'Must not drive and must notify DVLA. May resume once DVLA has confirmation that the diplopia is controlled, for example by glasses or a patch used while driving (monocular rules then apply). Stable uncorrected diplopia for 6 months or more may exceptionally be licensable with a specialist report.']],
            g2: [['x', 'Must not drive and must notify DVLA. Licence refused or revoked permanently for insuperable diplopia. Patching is not acceptable.']]
        }]
    },
    {
        id: 'monocular', cat: 'vision',
        name: 'Monocular vision (loss of vision in one eye)',
        aka: 'monocular one eye loss of vision enucleation sudden visual loss',
        src: ['vision', 'monocular-vision', 'Visual disorders: Monocular vision'],
        rows: [{
            when: 'Complete loss of vision in one eye (any light perception is not monocular)',
            g1: [['x', 'Must not drive until clinically advised of successful adaptation. Must meet the same acuity and field standards as binocular drivers; only those who do not meet them need to notify DVLA.']],
            g2: [['x', 'Must not drive and must notify DVLA. The law bars licensing if one eye has no vision or corrected acuity below 3/60 (some older licences have exceptions).']]
        }]
    },

    /* ---------------- Sleep, respiratory, surgery & other ---------------- */
    {
        id: 'osa', cat: 'other',
        name: 'Obstructive sleep apnoea and excessive sleepiness',
        aka: 'OSA sleep apnoea OSAS excessive daytime sleepiness tired driving CPAP',
        src: ['misc', 'excessive-sleepiness--including-obstructive-sleep-apnoea-syndrome', 'Miscellaneous conditions: Excessive sleepiness'],
        rows: [
            {
                when: 'Excessive sleepiness with moderate or severe OSA (AHI 15 or more)',
                g1: [['x', 'Must not drive and must notify DVLA. Licensing needs control of the condition, improved sleepiness and treatment adherence, with review at least every 3 years.']],
                g2: [['x', 'Must not drive and must notify DVLA. As for Group 1, with review at least annually.']]
            },
            {
                when: 'Excessive sleepiness with suspected OSA, mild OSA (AHI under 15), another medical condition or medication',
                g1: [['x', 'Must not drive until satisfactory symptom control. Must notify DVLA if control cannot be achieved within 3 months.']],
                g2: [['x', 'Must not drive until satisfactory symptom control. Must notify DVLA if control cannot be achieved within 3 months.']]
            }
        ],
        note: 'The standard applies to excessive sleepiness that has, or is likely to have, an adverse effect on driving.'
    },
    {
        id: 'narcolepsy', cat: 'other',
        name: 'Narcolepsy and other central hypersomnias',
        aka: 'narcolepsy cataplexy hypersomnia',
        src: ['neuro', 'primarycentral-hypersomnias--including-narcolepsy-type-1-narcolepsy-with-cataplexy-and-type-2', 'Neurological disorders: Primary/central hypersomnias'],
        rows: [{
            when: 'Narcolepsy (type 1 or 2) or other central hypersomnia',
            g1: [['x', 'Must not drive and must notify DVLA. Licence only after satisfactory symptom control for at least 3 months.']],
            g2: [['x', 'Must not drive and must notify DVLA. At least 3 months of control, annual specialist review, OSA excluded or meeting its standard, and a satisfactory on-road assessment (at least 90 minutes).']]
        }]
    },
    {
        id: 'respiratory', cat: 'other',
        name: 'Respiratory disorders (including asthma and COPD)',
        aka: 'asthma COPD respiratory lung disease',
        src: ['renal', 'disorders-of-respiratory-function---including-asthma-and-copd', 'Renal and respiratory disorders: Respiratory function'],
        rows: [{
            when: 'Asthma, COPD and other respiratory disorders',
            g1: [['!', 'May drive and need not notify DVLA unless complicated by cough syncope, disabling dizziness, fainting or loss of consciousness, when the transient loss of consciousness standards apply.']],
            g2: [['!', 'As for Group 1.']]
        }]
    },
    {
        id: 'surgery', cat: 'other',
        name: 'Driving after surgery',
        aka: 'post-operative surgery operation anaesthetic sedation laparoscopy',
        src: ['misc', 'driving-after-surgery', 'Miscellaneous conditions: Driving after surgery'],
        rows: [{
            when: 'After surgery (unless another standard applies)',
            g1: [['!', 'Need not notify DVLA unless recovery is likely to affect driving and persist for more than 3 months. The driver should agree with their own doctors when it is safe to return, considering recovery from the procedure and anaesthetic, distracting pain, analgesia-related impairment and other restrictions. They must remain insured.']],
            g2: [['!', 'As for Group 1.']]
        }]
    },
    {
        id: 'temporary', cat: 'other',
        name: 'Temporary conditions expected to last under 3 months',
        aka: 'temporary DVT PE pulmonary embolism migraine limb injury pregnancy hyperemesis pre-eclampsia caesarean',
        src: ['misc', 'temporary-medical-conditions', 'Miscellaneous conditions: Temporary medical conditions'],
        rows: [{
            when: 'Clinical advice is less than 3 months off driving',
            g1: [['!', 'Generally need not notify DVLA. If the treating clinician judges DVLA should be told, advise the patient to contact DVLA. Examples in the guide: postoperative recovery, severe migraine, limb injuries expected to recover, pregnancy with fainting or light-headedness, hyperemesis, hypertension of pregnancy, recovery after caesarean section, DVT or PE.']],
            g2: [['!', 'As for Group 1.']]
        }]
    },
    {
        id: 'fracture', cat: 'other',
        name: 'Fractures and limb injuries',
        aka: 'fracture broken bone cast plaster limb injury ankle wrist',
        src: ['misc', 'fractures', 'Miscellaneous conditions: Fractures'],
        rows: [{
            when: 'Fracture',
            g1: [['!', 'Need not notify DVLA of a fracture. If recovery is prolonged beyond 3 months, the treating clinician should advise on a safe time to resume driving. The driver must be able to control the vehicle safely at all times.']],
            g2: [['!', 'As for Group 1.']]
        }]
    },
    {
        id: 'disability', cat: 'other',
        name: 'Permanent limb or spinal disability (including amputation)',
        aka: 'amputation hemiplegia disability adapted controls automatic spinal cord injury',
        src: ['app', 'appendix-g-disabilities-and-vehicle-adaptations', 'Appendix G: Disabilities and vehicle adaptations'],
        rows: [{
            when: 'Permanent limb or spinal disability',
            g1: [['!', 'Driving often remains possible with adaptations (from automatic transmission upwards). DVLA needs to know about the disability and any modified controls; the licence is coded accordingly.']],
            g2: [['!', 'Mild, non-progressive disabilities may be compatible with Group 2. Must notify DVLA for individual assessment.']]
        }]
    },
    {
        id: 'cancer', cat: 'other',
        name: 'Cancer (not covered elsewhere)',
        aka: 'cancer malignancy chemotherapy radiotherapy bone metastases',
        src: ['misc', 'cancers--not-covered-in-other-sections', 'Miscellaneous conditions: Cancers'],
        rows: [{
            when: 'Cancer',
            g1: [['!', 'Must be assessed but may not need to notify DVLA. Must notify if cerebral metastasis and seizure are likely. There must be no significant complication relevant to driving, such as limb impairment from bone tumour or general weakness or cachexia; consider the effects of treatment.']],
            g2: [['!', 'Must be assessed but may not need to notify DVLA. Licensing specifically considers the likelihood of cerebral metastasis and seizure.']]
        }]
    }
];
