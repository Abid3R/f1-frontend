# F1 Stats and Predictions Frontend

This is the frontend of the F1 Stats and Predictions website. It is built with Next.js, TypeScript and Tailwind CSS.

## Live Features

- Professional homepage
- Driver standings page
- Current drivers page
- Race schedule page
- Pit stop prediction demo page
- Responsive dark Formula 1 inspired design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- FastAPI backend connection

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Project landing page |
| Standings | `/standings` | Shows current F1 driver standings |
| Drivers | `/drivers` | Shows current F1 driver cards |
| Races | `/races` | Shows F1 race schedule |
| Predictions | `/predictions` | Shows pit stop prediction demo |

## Environment Variable

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000