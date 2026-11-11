# Bloom Next.js Invitation

Standalone Next.js version of the Bloom wedding invitation.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The root page redirects to `/invitations/bloom`.

Set `NEXT_PUBLIC_RSVP_ENDPOINT` to a JSON POST endpoint to send RSVP submissions to a service. Without it, RSVP submissions are saved in the current browser only.
