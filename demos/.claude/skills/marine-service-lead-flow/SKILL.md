---
name: marine-service-lead-flow
description: Design the enquiry flow for a marine or mechanical service business — what to ask, in what order, how to triage automatically, and how to shape the data for later CRM/notification integration. Use when building a service-request form for a workshop, mechanic or trade business.
---

# Marine service lead flow

For workshops that diagnose and repair. The enquiry form is the product — it decides whether
the first phone call starts from zero or from a described job.

## 0. The premise

A generic contact form (`navn, e-post, melding`) does not save the workshop any time. It
moves the discovery conversation from *before* the enquiry to *after* it. The mechanic still
has to ring and ask everything.

**A good enquiry form is a structured interview conducted while the customer is motivated.**

Measure it by one thing: **can the workshop decide what to do next without calling?**

## 1. Two customers, one form

| | **Akutt** (something broke) | **Planlagt** (routine service) |
| --- | --- | --- |
| State | At the boat, on a phone, frustrated | At home, comparing two workshops |
| Wants | A human, now | Scope, price, when |
| Tolerates | ~3 questions | ~12 questions |
| Primary action | **Call** | **Form** |

Design consequence: **the phone number must be reachable without scrolling, always.** Never
force the acute customer through a form. Never make the planned customer phone to book
routine work.

Branch early — first question is *what kind of enquiry is this* — and only then diverge.

## 2. What to ask

Order matters. Start with the boat (concrete, low-effort, builds momentum). Ask for contact
details **last** — the customer has invested by then, and asking first reads as lead capture.

### The engine plate shortcut

**Ask for a photo before you ask for specifications.** One photo of the engine plate answers
merke, modell, årsmodell and serienummer at once — accurately, which typed answers often are
not. Then make every one of those fields optional.

This is the single highest-leverage decision in the whole form and almost nobody does it.

```
1. Type enquiry     service · reparasjon · feilsøking · annet      [enum, required]
2. Boat             merke, modell, årsmodell, lengde               [text, optional]
3. Engine           foto av motorskilt                             [file, encouraged]
                    merke, modell, årsmodell                       [text, optional]
                    innenbords/utenbords/drev                      [enum]
                    bensin/diesel                                  [enum]
4. Problem          beskrivelse                                    [textarea, required]
                    når startet det                                [enum]
                    starter motoren?                               [enum — ja/nei/delvis]
5. Location         i sjøen · på land · på henger · vet ikke       [enum, required]
                    hvor                                           [text]
6. Media            bilder                                         [file, multiple]
7. Contact          navn, telefon, e-post                          [required: navn + telefon]
                    foretrukket kontaktmåte, ønsket tidspunkt      [enum]
```

### Field rules

- **Enumerate everything enumerable.** `location: "i sjøen" | "på land" | "på henger"` is
  filterable, routable, reportable. Free text is none of those.
- **"Starter motoren?"** is the highest-information single question in marine diagnosis. It
  splits electrical/fuel/mechanical faults immediately. Always ask it.
- **Boat location determines feasibility and cost** before anything else. A boat in the water
  may need lifting; on a trailer it can come to the workshop. Never omit this.
- **Only offer services actually performed.** An option for a service the workshop does not
  offer generates enquiries it must decline — a cost to both sides.
- Required fields: as few as possible. `navn`, `telefon`, `beskrivelse`, `type`. Everything
  else optional. An abandoned form captures nothing.

## 3. Triage — derive, do not ask

Never ask "how urgent is this?" Everyone says "very".

Derive it:

```ts
function triage(lead: ServiceLead): Triage {
  // akutt:    repair/fault-finding AND engine won't start
  // snarlig:  repair/fault-finding, engine runs
  // planlagt: routine service
  //
  // completeness 0–100: how much of the job is knowable before the call.
  //   engine identified (photo or make+model) is worth the most
  //   location known, problem described, contact reachable
  //
  // route:  ring-kunde-i-dag | svar-innen-24t | legg-i-kø
  // flags:  mangler-motoropplysninger | ingen-bilder | utenfor-omraade
}
```

`completeness` is the operationally useful number: it tells the workshop which enquiries can
be answered by message and which still need a call.

## 4. Notification

The workshop owner has oily hands and a phone in a pocket. Send **the triage summary, not
the form**:

```
AKUTT — Mercury 60hk starter ikke. Båt på henger, Nøtterøy.
3 bilder. Ola Nordmann, 900 00 000.
```

Enough to decide whether to interrupt the current job. Full detail behind a link.

## 5. Data model

Nest by real-world entity — a boat can outlive an owner, an engine can be replaced.

```ts
interface ServiceLead {
  id: string;
  submittedAt: string;          // ISO 8601. Always store ISO, display DD-MM-YYYY
  customer: Customer;
  boat: Boat;
  engine?: Engine;              // optional: not every job involves one
  request: ServiceRequest;
  location: BoatLocation;
  attachments: Attachment[];
  source: LeadSource;           // utm_*, referrer, landing page
  triage: Triage;               // derived
}
```

- **ISO 8601 in storage, always.** Localised dates sort wrong and parse ambiguously.
- **`source` from the first touch.** Which page and which campaign produced the enquiry is
  the only way to know what marketing works.
- **`triage` is derived and stored.** Recomputing later against changed rules would
  retroactively rewrite history.

## 6. Adapters, not integrations

Build the demo against interfaces so Phase 2 does not require rewriting the form:

```ts
interface LeadSink  { deliver(lead: ServiceLead): Promise<DeliveryResult>; }
interface Notifier  { notify(msg: NotificationMessage): Promise<DeliveryResult>; }
interface Scheduler { schedule(task: ScheduledTask): Promise<DeliveryResult>; }
```

The form depends on `LeadSink` only. Demo binds `localStorageSink`; production binds HTTP,
CRM or queue. **Never add a dependency that needs credentials to a speculative demo.**

## 7. Photo upload on a marina connection

- `accept="image/*"` + `capture="environment"` → opens the camera on mobile.
- Client-side downscale before upload. Phone photos are 5–12 MB; a marina has one bar.
- Show per-file progress and allow removal.
- **Never block submission on an upload.** Photos are an enhancement; a failed upload must
  not lose the enquiry.
- Cap count and size, and say the limits before the picker opens.

## 8. Success state

The moment of highest anxiety: *did that go through, and when will someone call?*

Show: a reference number, a summary of what was sent, **when to expect an answer**, and the
phone number for anything acute. Move focus to the confirmation heading for screen readers.

Never a bare "Takk!".

## 9. Accessibility and resilience

- Real `<label>` for every field. Placeholders are not labels.
- `<fieldset>`/`<legend>` for radio groups.
- Errors: summary at the top (linked to fields) + inline. Move focus to the summary on failed
  submit. `aria-invalid` + `aria-describedby`.
- Touch targets ≥ 44×44 px.
- Never validate on keystroke — validate on blur and on submit.
- The form should submit without JavaScript where the stack allows it. Marina connectivity is
  bad, and a JS-only form fails exactly where the acute customer is.

## 10. Anti-patterns

| Don't | Why |
| --- | --- |
| One "Melding" textarea | Guarantees a discovery phone call. The default, and the reason forms fail |
| Required e-mail | Many customers only want to be phoned |
| Terms checkbox before the form | Friction at peak intent |
| Asking urgency directly | Everyone says urgent |
| Offering unconfirmed services | Generates enquiries you must decline |
| Multi-step wizard for an acute customer | They are standing next to a dead engine |
| CAPTCHA | Suppresses genuine enquiries. Use a honeypot and a timing check |
| Auto-quoting a repair | You cannot price a marine fault you have not seen |
