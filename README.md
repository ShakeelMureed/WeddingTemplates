# Bloom Next.js Invitation

Bloom is implemented as a Next.js App Router page with React components and hooks. Its stylesheet is imported by the Bloom route layout; visual media remains in `public/invitations/bloom/assets`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The root page redirects to `/invitations/bloom`.

Set `NEXT_PUBLIC_RSVP_ENDPOINT` to a JSON POST endpoint to send RSVP submissions to a service. Without it, RSVP submissions are saved in the current browser only.
