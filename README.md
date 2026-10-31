# RiseFit

**Rizwan Sanadi** · Roll No. **PGDMAI-25-07** · MAI-594 Introduction to Vibe Coding · AY 2026–27

> **Say what you ate in your own words. RiseFit does the maths and keeps you on track, without guilt.** A zero-signup calorie budget for young Indian adults who eat messy, unmeasured meals.

- **Live app:** [https://risefit-healthapp.vercel.app](https://risefit-healthapp.vercel.app) (opens in any browser, no signup, nothing to install)

> ⚠️ **Not Medical Advice.** RiseFit gives general estimates only. It cannot diagnose or treat anything. If you feel unwell, see a doctor.

## Who it is for

Jose, 30, a student in Goa, one of three people I interviewed. He gained weight and tracked his food in a notes app, and he stopped a calorie app because the numbers did not feel accurate. He logs a meal in about 5 minutes at most, finds a photo the easiest way to do it, and wants a walk and a dinner plan after a heavy meal, not a warning.

## What it does

1. **Welcome, then one-tap start.** The app always opens on a welcome screen with a drawn thali, floating kcal tags and a sample meal (and a Continue button if you already have a saved goal). New visitors go on to the goal picker (Lose slowly -250, Lose steadily -400, Stay the same 0). No account. Optionally tune age, height, weight and sex. After that, a floating bottom dock with icons switches between **Today** (budget, guidance, log a meal), **Summary**, **Workout** and **7 days**.
2. **Daily budget.** Mifflin-St Jeor BMR × 1.35 activity, minus the deficit. The deficit is capped at 500 kcal/day and the target never goes below 1500 kcal (men) or 1200 kcal (women).
3. **Log meals in plain words or a photo.** Type "2 butter rotis, dal fry, dahi" (Hinglish works too), take a photo with the in-page camera, or upload one. AI estimates the calories.
4. **Check and correct.** Each item shows its kcal, protein, any hidden fat, a calorie range ("about 450-600") and a one-line reason. Change quantities in half steps, pick breakfast, lunch, snack or dinner, then add it. Meals are marked as AI estimate or fallback estimate, and "edited" if you changed them.
5. **Catch-up plan.** After a heavy meal or going over budget, RiseFit suggests a light next meal and a short walk. It never says "skip a meal".
6. **A reason to come back, without guilt.** The Today screen has a glowing segmented progress arc, colour tiles (protein, meals, workout, water), a greeting, one "Next step" card (including a calm note if lunch or dinner has not been logged) and a tip of the day. Badges are kept for good and count totals, never streaks. There are no push notifications and no guilt wording.
7. **Daily summary and 7-day view.** Today's highlights, weekly wins (days within budget, meals, workouts), a bar for each of the last 7 days, and an optional one-sentence AI insight.
8. **Today's workout.** A gentle, text-only suggestion each day (walks, no-equipment strength, a rest day) at Beginner or Regular level, with a week strip, a tick for each exercise and a timer.
9. **Guilt-free colours.** Emerald when on track, amber when over budget. Red is used only for safety alerts.

## Safety

- A permanent "Not Medical Advice" notice is shown on every screen.
- Red-flag text (chest pain, fainting, dizziness, breathlessness, starving for days, forced vomiting and similar) is caught **before** any AI call. The app shows a red alert pointing to a doctor or emergency services (112 in India) and logs nothing.
- RiseFit never diagnoses, prescribes, or suggests very low calorie intake.
- The workout suggestions are general fitness tips with a reminder to start easy and stop if there is pain, dizziness or chest discomfort.
- Estimates are approximate. The user always confirms or edits the number before it is saved.

## How it is built

- **Next.js 14** (App Router, plain JavaScript) + **Tailwind CSS**
- **Data stays in your browser** (`localStorage`). There is no database and no account.
- **AI:** Google Gemini API, called only from server routes (`app/api/parse-meal` and `app/api/insight`, through `lib/gemini.js`), so the key never reaches the browser.
- **Demo mode:** with no API key (or `DEMO_MODE=1`), or if the AI call fails, a small built-in list of common Indian foods gives the estimate (and a plain sentence replaces the AI insight) so the app always works.

```
app/page.js                  first screen, budget card, wiring
app/api/parse-meal/route.js  server route: safety check -> Gemini (text + photo) -> demo fallback
app/api/insight/route.js     server route: one-sentence 7-day insight, rule-based fallback
components/                  Landing, Thali, SampleMeal, AppHeader, Dock, BudgetCard, SegArc, Tiles, Greeting, NextStep,
                             MealLog, MiniPlate, ItemChips, CameraCapture, CatchUpCard, Toast, DailySummary, Highlights,
                             WeekView, Badges, WorkoutCard
lib/budget.js                calorie target maths
lib/safety.js                red-flag detection
lib/catchup.js               catch-up plan rules
lib/summary.js               daily summary rules
lib/demo.js                  demo food estimator
lib/gemini.js                shared Gemini call (key stays on the server)
lib/items.js, lib/mealtype.js, lib/days.js, lib/week.js, lib/insight.js, lib/workout.js, lib/image.js,
lib/progress.js, lib/nextstep.js, lib/tips.js, lib/badges.js
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
| `GEMINI_MODEL` | Optional. One model name or a comma-separated list. If empty, the app tries `gemini-flash-latest`, `gemini-3-flash-preview` and `gemini-2.5-flash` in that order, because Google retires model names over time. |
| `DEMO_MODE` | `1` forces the built-in demo estimator |

Set these in Vercel under Project → Settings → Environment Variables. `.env`, `.env.local` and `node_modules` are git-ignored.

## Deliberately not built

Wearables, workout videos, challenges and streaks, social feeds, caretaker/hospital features, step and sleep tracking, push notifications, exportable reports. Subscriptions are a "Later" idea: nothing is for sale in this version. See the report for the build now / later / never decisions.

## Credits

- Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com) and hosted on [Vercel](https://vercel.com).
- Estimates by the [Google Gemini API](https://ai.google.dev).
- Calorie formula: Mifflin-St Jeor equation.
- Built with the help of Claude Code (AI-assisted); AI use is disclosed in the report.
- No third-party images, audio or video are used. Icons are plain emoji, and the logo, the thali, the plate icons, the arc and the gauge are drawn with CSS and SVG. The look is a dark "glass" theme with emerald, sky, teal and violet glows.
