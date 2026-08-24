# Retention and automation — Classic Frisør

Two columns throughout: **NÅ** is what the salon can do with what it has today. **SENERE** is
a Tycho system that would need building. Never presented as if the second already exists.

## 0. The principle

Hair grows at a predictable rate. That is the whole opportunity, and it is why this is a
better retention business than most.

But: **do not automate something merely because it is possible.** A reminder that arrives at
the right time is worth more than a chatbot. Everything below is ranked by value per unit of
maintenance, and the cheapest item is deliberately first.

---

## 1. Ask for the review ⭐ start here

| | |
| --- | --- |
| **NÅ** | Ask at the chair, then send one message the same evening with the review link |
| **SENERE** | Booking system marks appointment complete → 3-hour delay → one SMS with the link |
| Cost now | Nothing |
| Why first | `[W]` One review today. Going from one to eight changes how the listing reads more than any design change could |

**This needs no software.** It needs a saved link and the habit of asking. Any proposal that
leads with automation here is selling the wrong thing.

---

## 2. The rebooking moment

| | |
| --- | --- |
| **NÅ** | Book the next appointment before the customer leaves the chair |
| **SENERE** | If they decline, a reminder at their natural interval |
| Why | The highest-converting moment in the entire funnel is while they are still in the room and happy |

`[TO_CONFIRM]` The natural interval — questionnaire §6.2. It differs by treatment: a short
cut is 4–6 weeks, colour regrowth 6–10, a longer style 10–12.

---

## 3. Regrowth reminders — only if colour is confirmed

| | |
| --- | --- |
| **NÅ** | — |
| **SENERE** | Colour appointment + interval → one message: *"Ettervekst pleier å vise seg rundt nå"* |
| Blocked on | §4.1 — **we do not know that Classic offers colour** |

Deliberately blocked. Building a colour-reminder flow for a salon that may not do colour is
exactly the kind of speculative automation this project refuses.

---

## 4. Lapsed-customer reactivation

| | |
| --- | --- |
| **NÅ** | Look through the book for anyone not seen in six months, send a personal message |
| **SENERE** | Automatic flag at 2× the normal interval |
| Caution | This must stay rare and personal. A salon that messages lapsed customers monthly becomes a salon people mute |

---

## 5. Seasonal

`[TO_CONFIRM]` Only worth building if the owner confirms a pattern. Common in Norwegian
salons: December (julebord and Christmas), May (17. mai and confirmations), late August
(back to school). One message per season, maximum.

---

## 6. Not recommended

| Idea | Why not |
| --- | --- |
| Live chat | A one-person salon cannot answer it mid-cut. An unanswered chat is worse than none |
| AI chatbot | Answers questions a good treatments page answers better, and gets prices wrong |
| Loyalty app | Nobody installs an app for a haircut |
| Newsletter | No list, no time to write it, and hairdressing is not a newsletter business |
| Automated review *replies* | Reviews are the one place a personal voice is the entire point |
| Booking built from scratch | If Fixit or Timma is already in use, replacing it is a cost with no customer benefit |

---

## 7. Consent and GDPR

Any reminder or review message needs a lawful basis. For existing customers a service
message about their own appointment is generally defensible; **marketing is not**.

- Ask at booking, record the answer
- Every message carries a way to stop receiving them
- Store phone numbers only as long as needed
- `markedsforingsloven §15` governs electronic marketing to consumers — get consent

The site's data model already carries a `consent` flag so this is not retrofitted later.

---

## 8. Interfaces, not integrations

No credentialed integration is built in this concept. The shapes exist so phase two binds an
implementation without touching UI:

```ts
interface BookingProvider {
  name: string;
  bookingUrl: string;
  supportsStylistSelection: boolean;
}

interface ReviewRequest {
  appointmentId: string;
  sendAfterHours: number;
  reviewUrl: string;
  consent: boolean;
}

interface RebookingReminder {
  appointmentId: string;
  treatment: string;
  intervalWeeks: number;
  consent: boolean;
}
```
