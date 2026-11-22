# Nova AI Studio

Nova AI Studio is a Next.js and FastAPI application for AI-assisted video creation.
The repository is currently in an implementation milestone: the frontend dashboard
is rendered, the backend health and capability routes work, and generation features
remain explicitly unavailable until provider adapters are implemented.

## Prerequisites

- Windows 11
- Python 3.13+ (the existing backend virtual environment currently uses Python 3.15)
- Node.js and npm
- FFmpeg (required for editing milestones, not required for the baseline API)

## Backend

From the repository root:

```powershell
Set-Location backend
& .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If the existing virtual environment cannot be used, create a fresh one:

```powershell
Set-Location backend
py -3.13 -m venv venv
& .\venv\Scripts\python.exe -m pip install --upgrade pip
& .\venv\Scripts\python.exe -m pip install -r requirements.txt
& .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Copy `backend/.env.example` to `backend/.env` and set only local/server values.
Do not commit provider keys or put them in frontend environment variables.

API documentation is available at `http://127.0.0.1:8000/docs`.

## Frontend

From the repository root:

```powershell
Set-Location frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

Copy `frontend/.env.example` to `frontend/.env.local` if a public backend URL is
required. The public environment variable may contain only the backend URL.

## Baseline checks

```powershell
curl.exe -sS http://127.0.0.1:8000/health
curl.exe -sS http://127.0.0.1:8000/api/v1/features

Set-Location backend
& .\venv\Scripts\python.exe -m pytest -q

Set-Location ..\frontend
npm.cmd run lint
npm.cmd run build
```

## Current implementation

- Implemented: responsive Next.js dashboard shell, backend health/root routes,
  CORS for configured local origins, and capability reporting.
- Not implemented: real or mock video generation, uploads, voice, editing,
  projects, persistence, authentication, and mobile application.
- Provider keys are not configured by this repository and no paid API or hosting
  calls are made.

## Deploying frontend and backend together on Vercel

The repository uses Vercel Services: Next.js is the public frontend and FastAPI is
a private backend in the same Vercel project. The browser calls same-origin
`/api/*` routes, and `frontend/app/api/[...path]/route.ts` forwards those requests
to the backend through Vercel's `BACKEND_URL` service binding.

```powershell
Set-Location "C:\Users\Sufyan-Khan\Desktop\my new project\nova-ai-studio"
npx.cmd vercel@latest login
npx.cmd vercel@latest link
npx.cmd vercel@latest deploy
```

For a production deployment, use:

```powershell
npx.cmd vercel@latest --prod
```

Connect the GitHub repository in the Vercel dashboard to enable automatic preview
and production deployments. In Project Settings, the repository root must remain
the Nova project root because [vercel.json](./vercel.json) declares both services.

The free Vercel Hobby tier may have execution, bandwidth, build, and file-storage
limits. The current platform-independent baseline uses no database or hosted
storage, and no paid API or hosting resource is created by the repository.
