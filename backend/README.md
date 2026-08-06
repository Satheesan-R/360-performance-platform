# Authentication backend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` and a long `JWT_SECRET`.
3. Keep `MAIL_MODE=console` for local development.
4. Run `npm run seed:hr` once to create the first HR account.
5. Start with `npm run dev`.

The API runs at `http://localhost:5000` by default.

## Routes

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/login` | Public | Login with email/password |
| GET | `/api/auth/me` | Bearer JWT | Return current user |
| POST | `/api/employees` | HR/Admin | Create employee and invitation |
| GET | `/api/auth/activation/:token` | Public | Validate activation link |
| POST | `/api/auth/activation/:token/send-otp` | Public | Email an OTP |
| POST | `/api/auth/activation/:token/verify-otp` | Public | Verify OTP and issue setup token |
| POST | `/api/auth/activation/:token/set-password` | Setup token | Activate account |

## Gmail

After local testing, set `MAIL_MODE=smtp` and configure the Gmail values in `.env`.
Use a Google App Password, not the account's normal password.

## Test

Use a dedicated database because the integration test clears its collections:

```powershell
$env:NODE_ENV='test'
$env:MONGODB_URI='mongodb://127.0.0.1:27017/performance_platform_auth_test'
$env:JWT_SECRET='a-test-secret-with-at-least-32-characters'
$env:MAIL_MODE='console'
npm test
```
