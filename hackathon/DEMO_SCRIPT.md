# CollectAI — Demo Script (GitHub Finish-Up-A-Thon)

**Target length:** 2–3 minutes  
**Format:** Screen recording with voiceover

---

## INTRO (0:00–0:20)

> "Hey everyone — I'm Pavan, and this is CollectAI.
>
> If you've ever sent an invoice and then just... waited... and waited... you know the pain.
> Chasing payments is awkward, time-consuming, and easy to forget.
>
> CollectAI was a half-finished hackathon project sitting on my GitHub — just a basic invoice table with no auth, no AI, no deployment.
> For this Finish-Up-A-Thon, I finished it. Let me show you what it became."

---

## SIGN UP / LOGIN (0:20–0:35)

> "First, I'll create an account."

- Open the app at the ngrok URL
- Click **Sign Up**, enter name / email / password, submit
- Gets redirected to the dashboard

> "Persistent sessions with JWT — you stay logged in across refreshes."

---

## DASHBOARD (0:35–1:00)

> "This is the dashboard. It shows me exactly where my money stands."

- Point to the **bar chart** (monthly revenue)
- Point to the **donut chart** (collection rate — paid vs unpaid)
- Point to the **stat cards**: Total Invoiced, Collected, Overdue, Pending

> "All of this updates live as invoices are created and paid. Month-over-month deltas show the trend at a glance."

---

## CREATE AN INVOICE (1:00–1:20)

> "Let me create a new invoice."

- Click **New Invoice**
- Fill in: Client Name, Client Email, Amount, Due Date
- Optionally add a Payment Link
- Submit

> "Invoice is created. Status starts as Pending. When the due date passes, the system automatically marks it Overdue — no manual action needed."

---

## AI REMINDER (1:20–1:50)

> "Here's the feature I'm most proud of — one-click AI reminders."

- Open the invoice just created
- Click **Send AI Reminder**
- Wait ~2 seconds for the Groq API to respond

> "CollectAI calls LLaMA 3.3 70B via the Groq API. In about two seconds it writes a professional, personalized reminder — client name, amount, due date — all filled in automatically."

- Show the generated message on screen

> "And it sends it. Right now. To the client's email."

- Show the success toast / response

> "No copy-pasting, no drafting. One click."

---

## RECIPIENT VIEW — MY BILLS (1:50–2:10)

> "Now let's see it from the client's side."

- Open a new browser tab (or incognito)
- Sign up / log in with the **client's email** (the one the invoice was sent to)
- Navigate to **My Bills**

> "Clients can log in and see every invoice sent to them — amount owed, due date, who sent it. If there's a payment link, the Pay Now button is right there."

---

## MOBILE (2:10–2:20)

> "It's fully responsive too."

- Resize browser to mobile width, or use DevTools device emulation
- Show the hamburger menu opening

> "The nav collapses into a clean menu on small screens."

---

## OUTRO (2:20–2:45)

> "So that's CollectAI — from an abandoned hackathon project to a working product.
>
> I added AI-powered reminders, persistent auth, live charts, a recipient portal, a daily cron job that auto-marks overdue invoices, email delivery, and Docker deployment with a public ngrok URL.
>
> The stack is React, Node.js, MongoDB, Groq AI, and Docker Compose.
>
> Everything runs in containers — you can clone the repo, add your env vars, and have it running in under five minutes.
>
> Link to the code and live demo are in the post below. Thanks for watching."

---

## RECORDING TIPS

- Use **OBS** or **Loom** for screen + mic recording
- Record at 1080p, keep browser zoom at 100%
- Before recording: clear browser history so login flow looks fresh
- Keep mouse movements slow and deliberate — pause on each feature for 2–3 seconds
- If the ngrok warning page appears, click **Visit Site** once before recording
- Trim dead air at the start/end in any free editor (DaVinci Resolve, Clipchamp)
