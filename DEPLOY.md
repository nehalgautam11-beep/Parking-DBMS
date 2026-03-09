# Deploy Guide (Render + Vercel)

This project is split into:
- `server` (Express + MongoDB)
- `client` (Vite + React)

## 1) Deploy Backend on Render

1. Push this repo to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables (from `server/.env.example`):
   - `PORT=5000`
   - `MONGO_URI=...` (Atlas connection string)
   - `JWT_SECRET=...` (strong secret)
   - `CLIENT_URL=https://<your-vercel-domain>`
   - `CLIENT_URL_2=https://www.<your-vercel-domain>` (optional)
   - `NODE_ENV=production`
5. Deploy and copy your backend URL, e.g. `https://bvp-parking-api.onrender.com`

Health check:
- `GET https://bvp-parking-api.onrender.com/`

## 2) Deploy Frontend on Vercel

1. In Vercel, import the same GitHub repo.
2. Configure:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variable:
   - `VITE_API_BASE_URL=https://<your-render-backend>/api`
4. Deploy and copy your frontend URL.

## 3) Final Wiring

1. Update Render `CLIENT_URL` with your real Vercel URL.
2. Redeploy backend once after changing CORS env vars.
3. Test:
   - Register account
   - Login
   - Availability
   - Booking flow

## Local sanity checks before push

```bash
cd client && npm run build
cd ../server && npm start
```

