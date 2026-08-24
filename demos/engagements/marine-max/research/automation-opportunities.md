# Automatiseringsmuligheter — Marine Max

**Reading rule for this document.** Everything is split into two columns:

- **NÅ (current capability)** — what the delivered website does today, with no integrations,
  no credentials, no subscriptions.
- **SENERE (future Tycho system opportunity)** — what becomes possible once Trond wants it.
  Nothing here is built. Nothing here is promised. Nothing here is priced.

No ROI figures, no conversion percentages, no traffic estimates appear in this document.

**Gating rule.** Several opportunities below depend on services we have not verified.
Winterisation, storage and mobile service are all `[TO_CONFIRM]`. Each is marked with the
questionnaire item that unblocks it. **A reminder about a service Trond does not offer is
worse than no reminder** — it generates enquiries he has to decline, which costs him time and
costs the customer goodwill.

---

## 1. Why automation matters here specifically

Marine Max is one person. That single fact drives the whole analysis.

For a sole operator, the constraint is never demand generation in isolation — it is that
**every hour spent on the phone is an hour not spent on an engine, and the phone rings
hardest exactly when the workshop is busiest.** Marine work is violently seasonal: spring
commissioning and autumn lay-up compress most of the year's demand into a few weeks.

So the goal is not "more leads". A sole operator flooded with unqualified leads is worse off.
The goal is:

1. **Fewer wasted conversations** — arrive at the phone call already knowing the job.
2. **Demand smoothing** — move work out of the peak weeks by booking earlier.
3. **Repeat business without selling** — a boat needs service every year, forever. The
   customer relationship is naturally recurring; only the *reminder* is missing.

---

## 2. The enquiry pipeline

```
Google / GBP
   │
   ▼
Website  ──────────────────────────────────────────────  NÅ
   │
   ▼
Structured ServiceLead  (typed, enumerated, triaged)  ──  NÅ
   │
   ├──────────────► CRM / database                    ──  SENERE
   ├──────────────► SMS/e-post varsel til Trond       ──  SENERE
   ├──────────────► Bekreftelse til kunden            ──  SENERE
   │
   ▼
Telefonsamtale (nå kortere — jobben er allerede beskrevet)
   │
   ▼
Avtale og utført jobb
   │
   ├──────────────► Oppfølging etter jobb             ──  SENERE
   ├──────────────► Google-anmeldelse                 ──  SENERE
   └──────────────► Vedlikeholdspåminnelse neste år   ──  SENERE
```

Everything above the first divider is delivered. Everything below is an interface, not an
implementation.

---

## 3. What the site does today (NÅ)

### 3.1 Structured capture instead of a free-text box

Every competitor's enquiry route ends in "Melding". Marine Max's ends in a typed object:

```ts
interface ServiceLead {
  id: string;
  submittedAt: string;        // ISO 8601
  customer: Customer;
  boat: Boat;
  engine?: Engine;
  request: ServiceRequest;
  location: BoatLocation;     // i sjøen | på land | på henger
  attachments: Attachment[];
  source: LeadSource;         // UTM + referrer + landing page
  triage: Triage;             // derived, not asked
}
```

Defined in `src/lib/lead.ts`. Enumerated fields — `location`, `fuel`, `mounting`, `urgency`,
`contactPreference` — are unions, not strings. That is what makes every later step possible:
you cannot filter, route or report on free text.

### 3.2 Automatic triage — derived, never asked

`triage()` computes, from what was submitted:

- **`urgency`** — `akutt` | `snarlig` | `planlagt`. Inferred from the request type and the
  "does the engine start?" answer. The customer is never asked "how urgent is this?" — a
  question everybody answers "very".
- **`completeness`** — 0–100. How much of the job is knowable before the call.
- **`route`** — `ring-kunde-i-dag` | `svar-innen-24t` | `legg-i-kø`.
- **`flags`** — e.g. `mangler-motoropplysninger`, `ingen-bilder`, `utenfor-omraade`.

`completeness` is the number that matters commercially. It is a measure of *how much
phone-time this enquiry has already saved*.

### 3.3 Photo capture

The form accepts photos via `capture="environment"` — on a phone this opens the camera
directly. One photo of the engine plate answers merke, modell, årsmodell and serial number
simultaneously. **No competitor asks for one.**

Video architecture is present in the `Attachment` type (`kind: "photo" | "video"`) but the
UI is photo-only, because an unreliable large upload at a marina is a worse experience than
no upload. The type is ready when the transport is.

### 3.4 Where the data goes today

`localStorage`, and nowhere else. No backend, no credentials, no third-party processor.

This is deliberate for a speculative demo — it means the demo can be shown to Trond without
provisioning anything, and it means **no personal data leaves the browser during a sales
meeting**. Section 6 covers what changes when it goes live.

---

## 4. Seasonal opportunities (SENERE)

The marine year is highly predictable, which is exactly what makes it automatable.

| Period | Trigger | Message | Blocked on |
| --- | --- | --- | --- |
| **Feb–Mar** | Pre-season, before the rush | "Vårservice — book nå, så slipper du køen i mai" | Q1.1 |
| **Apr–Jun** | Peak | *Nothing.* Do not market into a full order book | — |
| **Aug–Sep** | Pre-lay-up | "Skal båten opp i høst?" | Q1.1, Q3.5 |
| **Oct–Nov** | Lay-up | Konservering / winterisation reminder | **Q1.1 — unconfirmed** |
| **Jan–Feb** | Dead season | Off-season workshop capacity offer | Q1.1 |
| **Anniversary** | 12 months after last job | "Motoren din hadde service i fjor på denne tiden" | — |

### 4.1 The strongest one, and it is the cheapest

**The 12-month service reminder.** It needs no new service, no new capability, and no
confirmation from Trond beyond a service date he already knows. A boat engine needs annual
service; the owner forgets; a competitor's spring campaign catches them.

One SMS in February to last year's customers is the highest-value automation in this
document — and it is the one that requires the least from him.

### 4.2 Spring campaign — the load-shifting argument

The value is not "more customers in spring". Spring is already full. The value is **moving
February and March bookings out of the May crush**, which raises capacity utilisation across
the year without adding a single hour of work.

For a sole operator this is the difference between turning work away in May and having an
empty week in March.

### 4.3 Winterisation — deliberately blocked

The brief instructs: *do not assume Marine Max offers winterisation unless confirmed.* It is
not confirmed. It is therefore:

- absent from the website's service list
- absent from the enquiry form's request types
- present here **only** as a conditional opportunity

If Q1.1 confirms it, this becomes a strong autumn campaign, because the deadline is real
(first frost) and the consequence of missing it is expensive (a cracked block).

---

## 5. Lifecycle opportunities (SENERE)

### 5.1 Immediate acknowledgement

Auto-reply on submission: what was received, when to expect an answer, the phone number for
anything acute. Sets expectations and stops the customer enquiring elsewhere in the gap.

### 5.2 Notification to Trond

SMS with the triage summary — not the full form. Something like:

> `AKUTT — Mercury 60hk starter ikke. Båt på henger, Nøtterøy. 3 bilder. Ola, 900 00 000.`

The point is that he can decide whether to interrupt what he is doing **without opening a
laptop**. For a sole operator with oily hands, that is the whole design brief.

### 5.3 Review request

Triggered a few days after job completion. This is the highest-leverage item in the entire
document, because Marine Max has **zero reviews** and competitors have many.

Constraints, non-negotiable:
- Never gate on sentiment ("was it good? then leave a review") — against Google policy.
- Never incentivise.
- Send once. No chasing.

### 5.4 Service history

Once leads are stored, each boat accumulates a record: what was done, when, what parts. That
history is what makes the annual reminder specific ("impeller ble byttet i 2025") rather than
generic — and specific reminders are the ones that get answered.

### 5.5 Not recommended

| Idea | Why not |
| --- | --- |
| Live chat | A sole operator cannot staff it. An unanswered chat widget signals absence |
| Real-time online booking with a calendar | Marine diagnosis is not slot-shaped. You cannot know the duration before seeing the engine |
| Newsletter | Nothing to say monthly. Would decay into neglect |
| Automated quoting | Quoting a marine repair sight-unseen is how you lose money on every job |
| Chatbot | Would answer questions about a business it has no verified facts about |

That last row deserves emphasis. The whole project's discipline is *not saying things we
cannot verify*. A generative chatbot on this site would do exactly the opposite.

---

## 6. What must be true before any of this ships

Not technical blockers — obligations.

| Requirement | Note |
| --- | --- |
| **Consent** | Marketing SMS/e-post to private individuals requires consent under
markedsføringsloven §15. Service-related follow-up on an existing customer relationship is
treated differently from marketing — the reminder flows must be designed with that line in
mind, and consent captured at enquiry |
| **GDPR / behandlingsgrunnlag** | Photos of a customer's boat are personal data in context. Storage duration, deletion, and a data processor agreement with any CRM |
| **Deliverability** | SMS via a Norwegian gateway with a registered sender ID |
| **A real inbox** | Q4.3 — no e-mail address is currently public |
| **Trond's tolerance** | Automation that generates enquiries he must decline is a net loss. Every flow gated on a confirmed service |

---

## 7. Adapter interfaces

Defined in `src/lib/adapters.ts`. **No implementations, no credentials, no dependencies** —
the shape of the integration, so that Phase 2 is a matter of writing an adapter rather than
rewriting the form.

```ts
export interface LeadSink   { deliver(lead: ServiceLead): Promise<DeliveryResult>; }
export interface Notifier   { notify(msg: NotificationMessage): Promise<DeliveryResult>; }
export interface Scheduler  { schedule(task: ScheduledTask): Promise<DeliveryResult>; }
```

The form component depends on `LeadSink` alone. Today the bound implementation is
`localStorageSink`. Swapping in an HTTP sink, a CRM sink or a queue changes one binding and
touches no UI code.

**This is the actual architectural claim of the project**, and the one worth making to a
client: the expensive part of Phase 2 is not the integration, it is the data model — and the
data model is already built and already collecting the right fields.

---

## 8. Phasing

**Fase 1 — nå.** Website, local search foundations, structured enquiries, GBP claimed and
populated, first reviews collected. No recurring cost beyond hosting and domain.

**Fase 2 — når Trond vil.** Enquiries to a real inbox and CRM, SMS notification, customer
acknowledgement, review requests, annual reminders.

**Fase 3 — hvis det viser seg nyttig.** Service history per boat, parts and cost tracking,
capacity planning against the seasonal curve.

Phase 1 has standalone value. Phase 2 is not a dependency, and the proposal says so — the
website is not sold as the first instalment of something Trond has not agreed to.
