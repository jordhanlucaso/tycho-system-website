# Photo shot list — Classic Frisør

Every photograph on the site should be of **this salon**. No stock, and nothing from a
competitor's site or social account.

Shoot on a bright but overcast day if possible, or mid-morning. Available light only — a
flash makes a small warm room look like a clinic. A recent phone is genuinely good enough;
consistency of light matters far more than the camera.

**Consent:** written permission before any photograph of a person — customer or staff —
goes online. A verbal yes at the chair is not enough once it is on the internet.

---

## Priority 1 — the site cannot open without these

| # | Shot | Format | Used for |
| --- | --- | --- | --- |
| 1 | **Exterior with signage**, from across Smidsrødveien | 3:2 landscape | So a customer recognises the door. Also the Google cover photo |
| 2 | **The chair and the mirror**, empty, in daylight | 4:5 portrait | Hero. The single most important image on the site |
| 3 | **The room**, wide, showing the whole space | 16:9 landscape | Honest about scale. Small is fine when it looks chosen |
| 4 | **Hands cutting** — no face needed | 4:5 portrait | Craft, without a consent problem |

`CLIENT_PHOTO_EXTERIOR` · `CLIENT_PHOTO_HERO` · `CLIENT_PHOTO_ROOM` · `CLIENT_PHOTO_HANDS`

## Priority 2 — trust

| # | Shot | Format | Used for |
| --- | --- | --- | --- |
| 5 | **Stylist portrait**, at the chair, looking at camera, not posed | 4:5 portrait | The trust page. Needs consent |
| 6 | **Stylist working**, from behind the chair | 3:2 landscape | About section |
| 7 | **Consultation** — hands and hair, talking through what happens | 3:2 landscape | Process section |
| 8 | **Washing station** | 4:5 portrait | Signals a real salon, not a room with a chair |

`CLIENT_PHOTO_STYLIST` · `CLIENT_PHOTO_WORKING` · `CLIENT_PHOTO_CONSULT` · `CLIENT_PHOTO_WASH`

## Priority 3 — the work itself

| # | Shot | Format | Used for |
| --- | --- | --- | --- |
| 9 | **Finished cut**, from behind, natural light | 4:5 portrait | Gallery |
| 10 | **Hair texture close-up** — movement, shine, cut line | 1:1 square | Gallery |
| 11 | **Colour work**, if colour is confirmed | 4:5 portrait | Gallery — **only if §4.1 confirms colour** |
| 12 | **Before / after**, same light, same angle | 1:1 pair | Highest-converting image type. Explicit consent |
| 13 | **Product shelf**, if products are sold | 3:2 landscape | Only if §4.8 confirms |
| 14 | **Detail of the room** — a plant, the light, the tools | 1:1 square | Texture between sections |

`CLIENT_PHOTO_CUT` · `CLIENT_PHOTO_TEXTURE` · `CLIENT_PHOTO_COLOR_WORK` · `CLIENT_PHOTO_BEFORE_AFTER` · `CLIENT_PHOTO_PRODUCTS` · `CLIENT_PHOTO_DETAIL`

---

## Summary

| Priority | Shots | Blocks |
| --- | --- | --- |
| 1 | 4 | The site opening at all |
| 2 | 4 | The trust and about sections |
| 3 | 6 | The gallery |

**Fourteen photographs, one session, roughly ninety minutes.** Shots 11 and 13 depend on
answers in the questionnaire; do not shoot them speculatively.

## Where each shot appears in the concept

The frames on the demo are this list, rendered. Every `CLIENT_PHOTO_*` token on the site is a
row above — that is what lets the page say *"Rammene under viser nøyaktig hvilke bilder som
skal tas"* without it being a figure of speech.

| Token | Shot | Where it appears |
| --- | --- | --- |
| `CLIENT_PHOTO_HERO` | 2 | Front page hero, desktop |
| `CLIENT_PHOTO_DETAIL` | 14 | Front page, section 01 — treatments |
| `CLIENT_PHOTO_EXTERIOR` | 1 | Front page, section 02 — why here |
| `CLIENT_PHOTO_CUT` · `CLIENT_PHOTO_TEXTURE` · `CLIENT_PHOTO_HANDS` | 9 · 10 · 4 | Front page, section 03 — and /arbeid |
| `CLIENT_PHOTO_COLOR_WORK` · `CLIENT_PHOTO_BEFORE_AFTER` · `CLIENT_PHOTO_WASH` | 11 · 12 · 8 | /arbeid |
| `CLIENT_PHOTO_STYLIST` | 5 | /frisorene |

Shots 3, 6, 7 and 13 are quoted for but not placed in the concept — they are the reserve for
the Google profile and for the pages that follow confirmation.

## For Google Business Profile

Google weights recency, so hold some back rather than uploading everything at once. Two or
three a month keeps the profile active. Shot 1 is the cover.
