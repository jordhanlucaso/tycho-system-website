# Photography

Five placeholders ship with the template. Replace all five per client — generic stock is
the fastest way to make a contractor site look like every other contractor site, and the
whole pitch here is that the crew in the photo is the crew that shows up.

Keep the **filenames identical** and no config edit is needed. Change a filename and update
the matching `image` field in `config/site.ts`.

| File | Used by | Shot |
| --- | --- | --- |
| `hero-roofer-wide.jpg` | Hero, OpenGraph | Roofer at work, **wide**. The scrim covers the left ~60%, so the subject must sit right of centre or it disappears behind the headline. Shoot or crop 16:9, 2000px wide. |
| `crew-reviewing-plans.jpg` | Who we are | Two or three of the crew reviewing plans on a tailgate or at the truck. Portrait-ish crop, 1200×1000; it renders in a 420px-tall box, so keep faces in the middle band. |
| `project-shingle-replacement.jpg` | Recent work, card 1 | Finished shingle replacement, shot from the ground at an angle that shows a full plane and a ridge. 4:3, 1200×900. |
| `project-metal-roof.jpg` | Recent work, card 2 | Standing-seam metal, raking light along the seams. 4:3, 1200×900. |
| `project-storm-repair.jpg` | Recent work, card 3 | Storm damage repair in progress — tarps, torn decking, crew working. 4:3, 1200×900. |

## Before you commit them

- **Compress.** Aim under 250KB each, under 400KB for the hero. `squoosh-cli`, `sharp` or
  `magick in.jpg -quality 76 -strip out.jpg`.
- **Strip EXIF.** `-strip` above. Client photos carry GPS coordinates of client houses.
- **No people you have not cleared.** A recognisable homeowner in a marketing photo needs
  their say-so.
- The hero is the LCP element and loads with `priority`. It is the one image whose weight
  actually shows up in the Lighthouse score.

The testimonial avatar is optional. Leave `testimonial.avatar` unset and the initials
render on an accent-tinted circle, which looks deliberate; a bad crop of a stranger does not.
