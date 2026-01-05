# exchanger-premium

Premium black-glass token portal for a legitimate exchange workflow:
- Token generation (UUID) + login
- Client panel + orders
- bKash trx submission (demo workflow)
- 24/7 support tickets (user ↔ admin)
- Admin dashboard: orders/users/tickets

## Setup
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Open:
- Home: http://localhost:3000
- Generate token: /auth/generate
- Login: /auth/login
- Client panel: /panel (after login)
- Admin: /admin (needs ADMIN_PASSWORD for API actions)
