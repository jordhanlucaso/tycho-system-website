---
name: salon-booking-conversion
description: Turning a salon website visit into a booked appointment and a returning customer — treatment discovery, price clarity, stylist selection, mobile booking, consultation flows for colour work, review requests and rebooking. Use when designing the conversion path for a hair salon, barber or beauty business.
---

# Salon booking conversion

## 0. The premise

A salon visitor has already decided they need a haircut. You are not selling the haircut.
You are answering **five questions**, in this order, before they lose patience:

1. Is this the right salon for me?
2. What can I book?
3. What will it cost?
4. Who will do it?
5. How do I book?

A page that answers 1–4 and hides 5 has wasted the work. A page that leads with 5 and never
answers 3 gets a phone call asking about price — which is a cost, not a conversion.

## 1. Two customers, two paths

| | **New** | **Returning** |
| --- | --- | --- |
| Arrives from | Google, place-intent | Direct, or a reminder |
| Needs | Trust, price, proof | The booking link, fast |
| Reads | Treatments, stylist, gallery | Nothing |
| Path | Home → treatment → book | Book |

Design for both. The returning customer must never have to scroll past a trust section they
already believe. **A persistent, restrained booking action is what serves them** — one bar,
one action, not a popup.

## 2. Price clarity is the differentiator

Most small salons publish no prices. Customers hate this and ring to ask, which costs the
salon time mid-cut.

- Publish a price with every treatment, even as `fra 550 kr`
- Say why it varies — length, thickness, time — rather than hiding the variation
- Publish the **duration** too. "90 minutter" tells someone whether they can come in a lunch
  break, which is often the real question
- If the owner will not publish exact prices, publish bands. Bands beat silence

## 3. Treatment presentation

Group by what the customer calls it, not by what the salon calls it. *Klipp / Farge /
Styling* is how people think; *Kjemisk behandling* is how a trade course thinks.

Each treatment card: name, price, duration, one plain sentence, and a booking link. **Never
a treatment the salon has not confirmed it performs** — an enquiry for something you do not
do is a wasted appointment and a disappointed customer.

## 4. Stylist selection

In a one-chair salon this is the whole trust story: *the same person cuts your hair every
time*. Say it plainly; a chain structurally cannot.

In a multi-chair salon, let people pick — but never make picking mandatory. "Ingen
preferanse" must be an option, or you lose the customer who does not know the names yet.

Never publish a name, photo or biography without that person's consent.

## 5. Booking: link, do not rebuild

Determine what exists **before** designing anything:

| What exists | What to build |
| --- | --- |
| Fixit / Timma / similar | An adapter and a prominent link. Nothing else |
| Phone only | `tel:` as the primary action, designed as a real CTA |
| Facebook/Instagram DMs | Link it, and note the case for a real provider |
| Nothing | Phone now; structure ready for a provider later |

```ts
interface BookingProvider {
  name: string;
  bookingUrl: string;
  supportsStylistSelection: boolean;
}
```

Make the handoff to an external provider feel deliberate — say where the button goes before
it goes there. An unexplained jump to a different-looking domain loses people.

## 6. Mobile

The highest-value visitor is on a phone, possibly on the street outside.

- One persistent action bar: `BESTILL TIME` and `RING`. Not three, not a popup
- 44px minimum touch targets, 48px for the primary action
- `tel:` must work — test it, do not assume
- The bar must reserve its own height so it never covers content

## 7. Colour consultation — only when it applies

Large colour changes, balayage and corrections genuinely need a conversation first. **Only
build this flow if the salon confirms it does that work.**

If it does: current hair, desired result, previous colour treatments (the single most
important question — box dye changes everything), approximate length, a reference photo,
preferred stylist, contact. A photo upload here is worth more than four text fields.

## 8. After the appointment

The two highest-value moments in the entire funnel happen when the website is closed:

**Rebooking** — offered at the chair, while they are still happy. Nothing digital beats it.
**The review request** — one message, a few hours later, one direct link.

Neither needs software to start. Both benefit from it later. Sell the habit first and the
automation second, in that order, or you have sold a system that replaces something the
salon was never doing.

## 9. Anti-patterns

| Don't | Why |
| --- | --- |
| Popup booking modal on load | Interrupts the trust the page has not yet earned |
| "Ring for pris" | The most common conversion killer in this industry |
| Contact form instead of booking | Adds a round-trip to a decision already made |
| Treatment list with no prices or durations | Answers the easy question, not the real ones |
| Stock photos of models | Customers want to see *this* salon's work |
| Instagram embed grid | Slow, changes without warning, and often shows nothing recent |
| Three competing CTAs | Book, ring, message, follow — pick one primary |
| Hiding hours behind a contact page | "Can I come today?" is a first-viewport question |
