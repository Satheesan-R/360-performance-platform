# Authentication frontend

Next.js App Router frontend for the employee authentication flow.

## Setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and expects the backend at
`http://localhost:5000/api`.

## Pages

- `/auth/login` — HR, admin, manager, and employee login
- `/auth/activate?token=...` — employee OTP and password activation flow
- `/dashboard/[role]` — protected role dashboard
- `/hr/employees/new` — protected HR/admin employee creation

During local development the backend uses `MAIL_MODE=console`. Copy the
activation URL and OTP from the backend terminal to test onboarding.
