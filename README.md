# RiseFit

**[Your Full Name]** · Roll No. **[Your Roll Number]** · MAI-594 Introduction to Vibe Coding · AY 2026–27

> **Say what you ate in your own words. RiseFit does the maths and keeps you on track, without guilt.** A zero-signup calorie budget for young Indian professionals who eat messy, unmeasured meals.

- **Live app:** [https://risefit-healthapp.vercel.app](https://risefit-healthapp.vercel.app) (opens in any browser, no signup, nothing to install)

> ⚠️ **Not Medical Advice.** RiseFit gives general estimates only. It cannot diagnose or treat anything. If you feel unwell, see a doctor.

## Who it is for

Aarav, 23, an entry-level software intern in a shared flat in Bengaluru. He eats PG mess food, Swiggy and office cafeteria meals, and wants to lose a few kilos without cooking or weighing food.

## What it does

1. **One-tap start.** Pick a goal (Lose slowly -250, Lose steadily -400, Stay the same 0). No account. Optionally tune age, height, weight and sex.
2. **Daily budget.** Mifflin-St Jeor BMR × 1.35 activity, minus the deficit. The deficit is capped at 500 kcal/day and the target never goes below 1500 kcal (men) or 1200 kcal (women).
3. **Log meals in plain words.** Type "2 butter rotis, dal fry, dahi" (Hinglish works too). AI estimates the calories, you check and edit the total, then add it.
4. **Catch-up plan.** After a heavy meal or going over budget, RiseFit suggests a light next meal and a short walk. It never says "skip a meal".
5. **Daily summary.** Eaten vs target, number of meals, biggest meal and one kind sentence.
6. **Guilt-free colours.** Emerald when on track, amber when over budget. Red is used only for safety alerts.

## Safety

- A permanent "Not Medical Advice" notice is shown on every screen.
- Red-flag text (chest pain, fainting, dizziness, breathlessness, starving for days, forced vomiting and similar) is caught **before** any AI call. The app shows a red alert pointing to a doctor or emergency services (112 in India) and logs nothing.
- RiseFit never diagnoses, prescribes, or suggests very low calorie intake.
- Estimates are approximate. The user always confirms or edits the number before it is saved.

## How it is built

- **Next.js 14** (App Router, plain JavaScript) + **Tailwind CSS**
- **Data stays in your browser** (`localStorage`). There is no database and no account.
- **AI:** Google Gemini API, called only from a server route (`app/api/parse-meal/route.js`), so the key never reaches the browser.
- **Demo mode:** with no API key (or `DEMO_MODE=1`), or if the AI call fails, a small built-in list of common Indian foods gives the estimate so the app always works.

```
app/page.js                  first screen, budget card, wiring
app/api/parse-meal/route.js  server route: safety check -> Gemini -> demo fallback
components/                  MealLog, CatchUpCard, DailySummary
lib/budget.js                calorie target maths
lib/safety.js                red-flag detection
lib/catchup.js               catch-up plan rules
lib/summary.js               daily summary rules
lib/demo.js                  demo food estimator
```

## Run it locally

```bash
npm install
```
```bash
cp .env.example .env.local
```
Optionally add a free Gemini key from https://aistudio.google.com/apikey to `.env.local`. Without it the app runs in demo mode.
```bash
npm run dev
```
Open http://localhost:3000.

### Environment variables

| Name | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini API key (server only). Never commit it. |
| `GEMINI_MODEL` | Model name, default `gemini-2.5-flash` |
| `DEMO_MODE` | `1` forces the built-in demo estimator |

Set these in Vercel under Project → Settings → Environment Variables. `.env`, `.env.local` and `node_modules` are git-ignored.

## Deliberately not built

Wearables, workout videos, subscriptions, social feeds, caretaker/hospital features, activity and sleep tracking, reports. See the report for the build now / later / never decisions.

## Credits

- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com) and hosted on [Vercel](https://vercel.com).
- Estimates by the [Google Gemini API](https://ai.google.dev).
- Calorie formula: Mifflin-St Jeor equation.
- Built with the help of Claude Code (AI-assisted); AI use is disclosed in the report.
- No third-party images, audio or video are used.
