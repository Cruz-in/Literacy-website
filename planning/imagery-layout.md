# Imagery Poster — Layout & Design Spec

> A scroll-driven single-page site. The reader descends through a forest at dusk, moving through each sense as its own color-temperature world.

---

## Design references (what we're basing the look on)

Images in this folder, and what each one teaches us:

| Reference image | What we take from it |
|---|---|
| **SŌM Power** (orange → forest → underwater green scroll) | **THE PRIMARY BLUEPRINT.** Each scroll section is its own atmospheric color world. Macro sensory close-ups (eye, hand, water). This is imagery-as-scroll. |
| **forest. app** (misty green forest, thin rounded type) | **Soft / gradual contrast** for the sense sections. Type sits *inside* the atmosphere, close in value to the background. Immersive, dreamlike. The exact mood for our setting. |
| **sukoya** (bright serif on near-black split panel) | **Hard / high contrast** for the teaching sections. Solid dark panel, heavy bright headline that snaps. Used for Definition, Examples, citation — where text must read clearly. |
| **Qualitätskamera** (red/black film studio) | Oversized display type, one accent color on dark, images breaking the grid at angles. Used for the big sense LABELS. |
| **Cartier** (elegant serif, warm neutrals, lots of space) | Restraint. A reminder not to overcrowd — protects the rubric line "enhances without overwhelming." |

---

## The contrast-weight system (core design rule)

Two contrast weights, each assigned to the job it does best:

- **Sense sections = SOFT / gradual contrast** (forest-app style). Feel, not read. Type close in value to the color world, with a subtle scrim/glow so it stays legible.
- **Teaching sections (Definition, Examples, Closing) = HARD / high contrast** (sukoya style). Read, not feel. Bright heavy text on solid dark. Clear headings.

The contrast weight itself becomes wayfinding: **soft = experience, sharp = information.**

---

## Scroll order (top → bottom) and info displayed

The logic: **tell → show → prove → cite → close.**

### 1. HERO — *orientation*
- **Shows:** device name "IMAGERY", one-line hook, your credit, scroll cue.
- **Layout:** full viewport (100vh). Title is the screen's anchor. Hook fades in a beat after. Background hints at the first sense's color world.
- **Contrast:** hard (this is a title, must read).

### 2. DEFINITION — *teach*
- **Shows:** heading "WHAT IS IMAGERY" + 1–2 sentence definition in own words.
- **Layout:** calm, lots of breathing room. Text reveals on scroll-in.
- **Contrast:** hard. Solid dark panel, bright text.

### 3. THE FIVE SENSES — *immerse (the heart · Visual Design 8 marks)*
Five full-height (100vh) sections, same skeleton each:
- A huge sense label (SIGHT / SOUND / SMELL / TOUCH / TASTE)
- One or two lines of sensory writing
- A visual treatment (color wash + macro image + motion)

Color worlds (adjust freely):

| Sense | Mood / temp | Visual idea |
|---|---|---|
| Sight | cool, open | wide light, dusk blues + gold |
| Sound | warm amber | implies vibration / echo |
| Smell | soft, hazy | drifting, diffuse, abstract |
| Touch | cold grey / sharp | texture close-up, temperature |
| Taste | rich, deep | small, intimate framing |

- **Layout:** background color/image shifts as you enter each → "scrolling through temperatures." Sense label oversized, can run partly off-screen. Sensory line fades/slides in as the section centers.
- **Contrast:** soft. Keep text SHORT — the feeling carries it.

### 4. ORIGINAL EXAMPLE — *your proof*
- **Shows:** heading "ORIGINAL EXAMPLE — written by [you]" + the five senses woven into one paragraph.
- **Layout:** a "zoom out" moment. Blended palette or calm neutral so the writing is the star. Give the paragraph room to be read.
- **Contrast:** hard (reading moment).

### 5. REAL-WORLD EXAMPLE — *external proof + citation*
- **Shows:** heading + short cited quote + **visible citation** (author, title, year) + one-line analysis.
- **Layout:** visually distinct from Section 4 so it reads as "mine vs. theirs." Citation styled clearly (smaller / accent) — never hidden in decoration.
- **Contrast:** hard. The citation MUST read — it's an easy mark to lose.

### 6. CLOSING — *reflect / exit*
- **Shows:** one closing line + credit (name, class, date).
- **Layout:** echo the hero (same type, calmer) to close the loop. Fade to the quietest color in the palette.
- **Contrast:** medium → soft.

---

## NOT on the site

- **Explanation paragraph (8 marks)** → separate attached document. The assignment is explicit about this.

---

## Technical notes

- Single page, section-based, each major block ~100vh.
- Scroll-triggered reveals (IntersectionObserver) — you already do this.
- One accent color against dark, per the moodboard.
- Mobile: sections stack naturally; keep type scaling (clamp) so labels don't overflow.
- Headings on every section = free "clear headings" rubric marks. Make each block unmistakably labeled.
- **Printing note:** assignment says posters get printed and hung. Confirm a live site is accepted, or plan to submit as link + screenshots.

---

## Build order (suggested)

1. HTML skeleton — all 6 sections with real copy from `imagery-copy.md`, headings in place.
2. Base CSS — dark theme, accent color, type scale, section sizing.
3. The contrast system — hard vs. soft section styles.
4. The five color worlds for the sense sections.
5. Scroll reveals + background transitions.
6. Images (macro sensory shots) into the sense sections.
7. Polish: hero, closing loop, mobile pass, proofread.
