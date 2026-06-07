# CollectAI — GitHub Finish-Up-A-Thon Submission

## What I Built

**CollectAI** is an AI-powered invoice collection platform that helps freelancers and small businesses track unpaid invoices, auto-send payment reminders using LLaMA AI, and let recipients see what they owe — all in one place.

## Demo Link

https://krypton-thieving-showbiz.ngrok-free.dev

## Link to Code

https://github.com/pavan-3000/CollectAi

---

## The Before & After Journey

### Before (What it was)
CollectAI started as a basic CRUD app from a hackathon:
- Create / list / delete invoices
- Simple form with client name, amount, due date
- No authentication persistence
- No real deployment
- No AI features — just a table of invoices sitting there

It was abandoned because it felt incomplete — just a spreadsheet with a React wrapper.

### After (What it is now)
A fully working product with real utility:

| Feature | Before | After |
|---------|--------|-------|
| Auth | Basic JWT | Persistent sessions with bcrypt |
| Dashboard | Static placeholder | Live charts — bar + donut, month-over-month deltas |
| AI Reminders | ❌ | LLaMA 3 via Groq — professional reminder in 1 click |
| Email | ❌ | Nodemailer SMTP — sends reminder directly to client |
| Auto Scheduler | ❌ | Daily cron at 9am — marks overdue + emails clients |
| Recipient View | ❌ | Clients log in and see "My Bills" — what they owe |
| Mobile | Broken nav | Hamburger menu, fully responsive |
| Deployment | localhost only | Docker Compose + ngrok public URL |
| Invoice Status | Manual only | Auto-marks pending → overdue when due date passes |

---

## How I Built It

### Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v4
- **Backend**: Node.js, Express v5, MongoDB/Mongoose 9
- **AI**: Groq API (LLaMA 3.3 70B) for reminder generation
- **Email**: Nodemailer with Gmail SMTP
- **Scheduler**: node-cron — daily 9am job
- **Deployment**: Docker Compose + ngrok tunnel

### How GitHub Copilot Helped
- Generated boilerplate for the Nodemailer transporter with graceful fallback when SMTP isn't configured
- Suggested the `lastEmailSentAt` field pattern to prevent email spam (24h cooldown)
- Auto-completed the SVG stroke-dasharray math for the donut chart
- Helped write the nginx.conf proxy configuration for the Docker setup
- Sped up the "My Bills" recipient invoice feature — suggested querying by `clientEmail` and using `.populate('user', 'name email')`

### Key Technical Decisions
1. **Single Docker network** — nginx proxies `/api/` to the Express container, so the frontend never needs a hardcoded API URL
2. **Route ordering** — `/api/invoices/received` must be registered before `/:id` in Express or it gets swallowed by the param route
3. **Groq over OpenAI** — faster response, generous free tier, same OpenAI-compatible API
4. **Fire-and-forget emails in cron** — emails are best-effort; a failed email doesn't crash the reminder job

---

## Screenshots

### Dashboard — Live Charts
Dynamic bar chart (monthly revenue) and donut chart (collection rate) with month-over-month deltas.

### Invoices — AI Reminder
One-click generates a professional payment reminder via LLaMA 3, sends it to the client's email instantly.

### Payments — My Bills
Clients log in and see invoices sent to them — amount owed, due date, Pay Now button.

### Mobile — Hamburger Menu
On small screens the nav collapses into a clean dropdown menu.

---

## What's Next
- Razorpay / Stripe payment link generation
- WhatsApp reminders via Twilio
- CSV export of invoice history
- Multi-currency support

---

*Built by [@pavan-3000](https://github.com/pavan-3000)*
