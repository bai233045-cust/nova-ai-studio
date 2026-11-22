---
description: Project context and implementation instructions for
  building Nova AI Studio, a hybrid AI video creation web and mobile
  platform.
name: nova-ai-studio
---

# Nova AI Studio --- Project Skill and Build Specification

## 1. Product overview

**Nova AI Studio** is a planned AI-powered video creation studio. Users
should be able to create videos from text prompts or still images,
generate narration and audio, edit clips, manage projects, preview
results, and export finished videos.

The product is intended to become a responsive web application plus
mobile applications. The initial architecture is hybrid: integrate
external AI inference APIs or hosted models first, while keeping
provider adapters replaceable so self-hosted/open-source models can be
introduced later.

This is a product build, not merely a static dashboard or a university
prototype. Prioritize a working, secure, testable end-to-end
application. Never represent a mock interaction as real AI generation.

**Working name:** Nova AI Studio\
**Initial budget target:** zero-cost development where feasible. Do not
assume that production-grade video inference, GPU hosting, storage,
domains, or third-party API usage can remain free. Explain costs and
free-tier limitations before requiring paid services.

## 2. User and development environment

The project owner has intermediate Python knowledge and is developing
on:

-   OS: Windows 11
-   RAM: 8 GB
-   GPU: NVIDIA GeForce MX350 (reported)
-   Python: 3.13 (reported)
-   Node.js: 26.13.1 (reported)
-   Shell: PowerShell
-   Project location observed in terminal:
    `C:\Users\Sufyan-Khan\Desktop\my new project\nova-ai-studio`

Hardware implications:

-   Use the laptop for coding, local web development, API testing,
    lightweight image/video processing, and small test assets.
-   Do not plan on running large text-to-video or image-to-video models
    locally on the MX350/8 GB RAM machine.
-   Prefer hosted inference APIs or remote GPU services for heavy
    generation.
-   Keep dependency installation and local services lightweight.
-   Check actual Python, Node, npm, GPU driver, and available disk
    versions before troubleshooting. Python 3.13 and Node 26 may expose
    package compatibility issues; pin supported versions when needed
    rather than blindly upgrading packages.
-   Windows PowerShell may block `.ps1` shims. Prefer `npm.cmd` /
    `npx.cmd` or a process-scoped execution-policy bypass. Never
    recommend permanently weakening machine-wide execution policy as the
    default fix.

## 3. Current implementation status --- be precise

The following is the known project history. Distinguish confirmed
user-reported results from code that was only proposed in chat.

### Confirmed or user-reported

1.  A Python backend environment was created under the project's
    `backend` directory.
2.  The user encountered PowerShell's script execution restriction while
    activating a virtual environment. A process-scoped workaround was
    provided.
3.  The user reported: **"Backend: Server running successfully."**
4.  A Next.js frontend was scaffolded using `create-next-app`, with the
    recommended defaults. The generated project uses the App Router,
    TypeScript, Tailwind CSS, and a `src` directory (based on the
    selected recommended template; verify actual files).
5.  The user successfully ran the Next.js development server. Terminal
    output included a successful `GET / 200`.
6.  `lucide-react` installation was completed using
    `npm.cmd install lucide-react` after PowerShell blocked `npm.ps1`.
7.  The user has not yet confirmed that the custom Nova dashboard code
    was pasted into `src/app/page.tsx`, saved, compiled, or visually
    verified.

### Backend code previously proposed, but verify in the repository

A minimal FastAPI app was proposed with: - `GET /` returning a welcome
JSON response - `GET /health` returning service health -
`GET /api/v1/features` returning a list of planned features

The proposed entrypoint was `backend/app/main.py`, with
`app = FastAPI(...)`. Verify the actual source and working directory
before assuming these routes exist.

### Frontend code previously proposed, but verify in the repository

A client-side dashboard was drafted for `frontend/src/app/page.tsx`. It
included: - dark Nova-themed layout and sidebar - Text-to-Video and
Image-to-Video mode selection - prompt textarea - image file selection
and local preview - duration and aspect-ratio controls - project
settings summary - placeholder preview panel - mobile sidebar toggle -
placeholder "Prepare Video" behavior

It did **not** implement real video generation, backend connectivity,
persistence, authentication, voice generation, or editing. The button
explicitly displayed a message that AI generation would be connected
later. Do not claim those features are implemented.

## 4. Product scope and requirements

### 4.1 Core creation modes

**Text-to-video** - Accept a user prompt and optional negative prompt if
the selected provider supports it. - Support provider-dependent
duration, aspect ratio, resolution, seed, and quality settings. -
Validate prompt length and settings against provider capabilities. -
Submit an asynchronous generation job and show
queued/running/succeeded/failed states. - Display the resulting video
and allow download/export.

**Image-to-video** - Accept an image upload with file type and size
validation. - Preview the image before submission. - Send the image and
prompt to a compatible provider. - Support provider-specific motion
controls where available. - Store input and output assets with ownership
checks.

**Video-to-video (later milestone)** - Treat as a future capability
unless a suitable provider is integrated. - Do not display an enabled
feature that cannot work. Clearly label unavailable capabilities as
planned.

### 4.2 Voice and audio studio

-   Text-to-speech narration through a provider adapter.
-   Voice selection only from voices actually supported by the selected
    provider.
-   Audio upload where appropriate.
-   Optional background music upload/library, with rights-aware
    handling.
-   Audio preview, volume controls, and attachment to a
    project/timeline.
-   Keep provider API keys server-side. Never expose secrets in
    browser/mobile code.

### 4.3 Editing studio

Build editing incrementally: 1. Basic trim and clip selection. 2.
Concatenate multiple clips. 3. Add/replace audio and narration. 4. Add
subtitles/captions from user text or speech transcription. 5. Crop/scale
to supported aspect ratios. 6. Export MP4 with selected resolution/frame
rate where feasible.

Use FFmpeg through a backend service for initial deterministic editing.
Validate FFmpeg availability and invoke it safely with argument arrays
(not shell-concatenated user input). Enforce upload limits, timeouts,
temporary-file cleanup, and output validation. A browser timeline can be
introduced as the UI matures; do not pretend a complex non-linear editor
exists if only FFmpeg jobs are supported.

### 4.4 Projects and user experience

-   Project library with title, creation time, generation status,
    thumbnail, and output asset.
-   Project detail page with prompt, inputs, settings, outputs, and
    editing actions.
-   Preview player and download.
-   Empty, loading, error, and retry states.
-   Responsive web layout and accessible controls.
-   Mobile app should reuse backend APIs and shared product concepts,
    not duplicate business logic.
-   Mobile implementation may use React Native + Expo after the web MVP
    and API contract stabilize.

### 4.5 Accounts and security

-   Authentication and user-owned projects/assets.
-   Authorization checks on every project, job, and asset access.
-   Server-side secrets and environment configuration.
-   Rate limits and per-user quotas before public launch.
-   File validation by MIME type and actual file inspection; size
    limits; safe filenames; generated storage keys.
-   Avoid public exposure of private uploads by default.
-   Do not store API keys in source control.
-   Add `.env.example`; ensure `.env`, uploads, generated assets, and
    local databases are ignored by Git.
-   Add clear terms, privacy information, provider disclosure, and
    content safeguards before public release.

## 5. Recommended architecture

Keep the architecture modular and provider-neutral.

### Frontend

-   Next.js App Router + React + TypeScript + Tailwind CSS.
-   `lucide-react` for icons.
-   Typed API client and centralized error handling.
-   Pages/components separated by feature.
-   Use environment variable `NEXT_PUBLIC_API_BASE_URL` only for the
    public backend base URL. Never put provider secrets in
    `NEXT_PUBLIC_*`.

### Backend

-   Python + FastAPI.
-   Pydantic request/response schemas.
-   SQLAlchemy or SQLModel for persistence; begin with SQLite for local
    development, plan PostgreSQL for hosted deployment.
-   Alembic migrations when schema stabilizes.
-   Background job abstraction for long-running generation/editing
    tasks. Start with a simple local worker only for development; use a
    durable queue/worker for production.
-   Storage abstraction: local filesystem in development, object storage
    in deployment.
-   Structured logs and request/job IDs.

### Provider abstraction

Define interfaces such as:

-   `VideoProvider.generate_from_text(request) -> provider_job`
-   `VideoProvider.generate_from_image(request) -> provider_job`
-   `VideoProvider.get_job_status(provider_job_id) -> status/result`
-   `VoiceProvider.synthesize(request) -> audio_asset`
-   `StorageProvider.put/get/delete(...)`

Implement one provider at a time. Provider capabilities differ. The app
must query or encode capabilities and validate settings rather than
assume every provider supports the same duration, dimensions, or modes.

A generation job should have a stable internal ID independent of the
external provider ID. Suggested states: `queued`, `submitted`,
`running`, `succeeded`, `failed`, `cancelled`. Persist provider name,
external job ID, sanitized request metadata, timestamps, error
code/message, and output asset references. Do not store secrets or
unnecessary sensitive prompt data in logs.

### Suggested repository layout

``` text
nova-ai-studio/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── core/
│   │   ├── db/
│   │   ├── schemas/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── providers/
│   │   │   ├── generation/
│   │   │   ├── voice/
│   │   │   ├── editing/
│   │   │   └── storage/
│   │   └── workers/
│   ├── tests/
│   ├── requirements.txt or pyproject.toml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   └── types/
│   └── .env.example
├── mobile/                 # Add after web/API MVP
├── docs/
├── storage/                # local development only; gitignored
├── .gitignore
└── README.md
```

Do not force a large directory structure prematurely. Add folders as
real features are implemented.

## 6. API design target

Use versioned routes, for example `/api/v1`.

Initial endpoints: - `GET /health` - `GET /api/v1/features` --- only
report genuinely available features and capability status. -
`POST /api/v1/uploads` --- validate and store an input asset. -
`POST /api/v1/generations/text-to-video` --- create a generation job. -
`POST /api/v1/generations/image-to-video` --- create a generation job. -
`GET /api/v1/jobs/{job_id}` --- get status/result. -
`POST /api/v1/voice/generations` --- create a TTS task. -
`POST /api/v1/projects` and `GET /api/v1/projects`. -
`GET /api/v1/projects/{project_id}`. - Editing endpoints for trim,
concat, audio mix, captions, and export as they are implemented.

Use typed request/response schemas, meaningful HTTP status codes,
validation errors, and consistent error shapes. Do not block an HTTP
request while a long video generation is running; return a job ID and
poll or use server-sent events/websockets later.

## 7. Development roadmap and acceptance criteria

### Milestone 0 --- Repository audit and baseline

-   Inspect actual repository before changing it.
-   Confirm backend and frontend paths, versions, scripts, and current
    files.
-   Run backend health check and frontend build.
-   Add `.gitignore`, `.env.example`, README setup instructions.
-   Record current state and avoid overwriting user work.

**Done when:** both apps run locally, commands are documented, and no
known build error remains.

### Milestone 1 --- Responsive frontend MVP

-   Finish and verify the Nova dashboard.
-   Implement mode selection, prompt, image upload/preview, settings,
    status and preview states.
-   Add responsive navigation and accessible labels.
-   Use mock data only where clearly labelled as demo/mock.

**Done when:** the interface works at desktop and mobile widths and does
not imply that placeholder generation is real.

### Milestone 2 --- Backend foundation

-   Organize FastAPI routes, schemas, config, database, and storage.
-   Add CORS for the local frontend origin.
-   Add upload validation and asset metadata.
-   Add tests and API documentation.

**Done when:** frontend can upload an image and retrieve a
health/features response from the backend.

### Milestone 3 --- Job system and first real video provider

-   Research provider availability, pricing, free credits, terms, and
    API documentation at implementation time.
-   Select one provider based on accessible credentials and cost.
-   Implement adapter, job persistence, polling/status handling,
    error/retry logic, and output download/storage.
-   Keep provider keys in backend environment variables.
-   If no usable free provider exists, implement a clearly labelled mock
    provider for tests and leave real generation disabled until a key is
    configured.

**Done when:** an authorized test user can submit a valid request,
observe job status, and preview/download a real generated output when
credentials and quota are available.

### Milestone 4 --- Image-to-video

-   Upload and validate source image.
-   Submit to compatible provider.
-   Persist job and output assets.
-   Handle provider-specific settings and errors.

### Milestone 5 --- Voice studio

-   Integrate a TTS provider or local lightweight option after
    evaluating compatibility and licensing.
-   Generate audio assets and preview them.
-   Attach voice tracks to projects.

### Milestone 6 --- Editing and export

-   Verify FFmpeg installation.
-   Implement safe background editing jobs for trim, concatenate, audio
    mix, captions, resize and MP4 export.
-   Test on short, small sample media first.

### Milestone 7 --- Authentication and persistence

-   Add authentication, user isolation, project history, asset
    permissions, quotas, and migrations.
-   A hosted auth/database service may be evaluated, but verify its
    current free-tier terms and data policies.

### Milestone 8 --- Mobile application

-   Create Expo/React Native app.
-   Reuse backend API and schemas conceptually.
-   Implement login, creation, upload, job tracking, preview and project
    library.
-   Test on a physical device.

### Milestone 9 --- Deployment and hardening

-   Select hosting based on current free-tier limits and the need for
    background workers/storage.
-   Deploy frontend, API, worker, database and object storage
    appropriately.
-   Configure HTTPS, CORS, secrets, logs, rate limits, backups, cleanup
    and monitoring.
-   Document that video inference and storage may incur costs.

### Milestone 10 --- Own-model path

-   Evaluate open-source models such as Wan, LTX-Video, or HunyuanVideo
    at that future date.
-   Check licenses, hardware requirements, VRAM, inference stack,
    commercial-use terms, and deployment cost.
-   Implement a self-hosted provider adapter without changing frontend
    contracts.
-   Do not attempt to train a foundation video model on the owner's
    MX350 laptop.

## 8. Engineering rules for the coding agent

1.  **Audit before editing.** Inspect files, package scripts, git
    status, Python environment and existing implementation. Never assume
    a chat-proposed code snippet was saved.
2.  **Work in small, testable increments.** Implement one milestone or
    coherent vertical slice at a time.
3.  **Do not fabricate completion.** Report exactly what runs, what is
    mocked, what needs credentials, and what remains.
4.  **Run checks after changes.** Use relevant backend tests, frontend
    lint/typecheck/build, and manual endpoint checks. Fix regressions
    before continuing.
5.  **Protect user data.** Do not overwrite or delete user files without
    approval. Preserve existing code and use focused diffs.
6.  **Keep secrets private.** Never request credentials in chat or
    commit them. Provide `.env.example` with placeholder names only.
7.  **Be cost-aware.** Do not trigger paid API calls or cloud resources
    without explicit approval. Estimate likely costs and explain
    free-tier limits.
8.  **Use current documentation.** Verify package and provider API
    versions when implementing. Do not invent endpoints, model names,
    free credits, or feature support.
9.  **Avoid unnecessary complexity.** Start with a single backend and
    frontend. Add queue infrastructure, Redis, PostgreSQL, cloud
    storage, or microservices only when justified.
10. **Windows-friendly commands.** Give PowerShell-compatible commands.
    If `npm`/`npx` PowerShell shims are blocked, use
    `npm.cmd`/`npx.cmd`; for virtualenv activation, use a process-scoped
    bypass or `Activate.bat` in cmd.
11. **Accessibility and responsive design.** Use semantic controls,
    keyboard support, labels, useful focus states, and mobile layouts.
12. **Provider neutrality.** Keep provider-specific request/response
    formats inside adapters; normalize internal jobs and assets.
13. **Test failure paths.** Cover invalid uploads, unsupported settings,
    provider timeouts, failed jobs, missing credentials, and storage
    errors.
14. **No misleading UI.** Disable or label unimplemented features. A
    button must perform its stated action.
15. **Document each milestone.** Update README/docs with setup,
    environment variables, commands, test results, limitations and next
    steps.

## 9. Definition of a successful first public release

A release candidate should allow a user to: - Register and sign in. -
Create a project. - Generate a video from text and from an image through
a configured provider. - Track generation status. - Generate or upload
narration/audio. - Perform basic editing and export an MP4. - View
project history and download owned assets. - Use the core workflow on
desktop and mobile. - Receive understandable errors when providers are
unavailable or quotas are exhausted. - Have private assets and
credentials protected.

A public launch must not be declared complete merely because the
dashboard renders or a mock job succeeds.

------------------------------------------------------------------------

# Prompt for Claude Agent --- Build Nova AI Studio end to end

You are the senior full-stack engineer and technical lead responsible
for implementing Nova AI Studio in the repository currently open in the
workspace.

Read this entire `skills.md` file first and treat it as the product
specification, project context, and engineering rules.

## Mission

Build Nova AI Studio into a working, maintainable AI video creation
platform with: - responsive Next.js web application - Python FastAPI
backend - text-to-video and image-to-video through replaceable provider
adapters - voice generation - basic video editing and MP4 export -
projects, assets, job tracking and user authentication - React
Native/Expo mobile client after the web/API foundation is stable -
deployment documentation and a realistic path to self-hosted models
later

The owner has intermediate Python experience and uses Windows 11, 8 GB
RAM, and an NVIDIA MX350. Keep local development lightweight and use
cloud inference only when explicitly configured and approved.

## Mandatory first action: repository audit

Before writing or changing code: 1. Print and inspect the repository
tree (excluding `node_modules`, `.next`, `.venv`, caches and generated
media). 2. Inspect `git status` if Git is initialized. 3. Read
`package.json`, Next.js configuration, `src/app/page.tsx`,
`src/app/globals.css`, backend entrypoint, requirements/pyproject files,
and environment examples. 4. Determine which backend routes actually
exist and whether the frontend dashboard code was saved. 5. Run existing
frontend and backend checks where feasible. 6. Summarize confirmed
implementation, incomplete work, errors, and proposed next vertical
slice.

Do not replace files wholesale until you understand their current
contents. Preserve user changes.

## Implementation approach

Work milestone by milestone. Start with the smallest complete vertical
slice: 1. Ensure the current web dashboard builds and is responsive. 2.
Implement FastAPI health, feature capabilities, upload, and project/job
schemas. 3. Connect the frontend to the backend with a typed API client
and proper loading/error states. 4. Implement a mock provider for
automated tests, explicitly labelled as mock. 5. Implement a real
provider adapter only after verifying current official documentation,
availability, pricing, supported inputs/settings, and the user's
configured credentials. 6. Add persistent job status and output asset
storage. 7. Add image-to-video, voice, editing, auth, mobile, and
deployment in the roadmap order.

## Product and technical requirements

-   Use Next.js App Router, React, TypeScript, Tailwind CSS and
    lucide-react if already installed.
-   Use FastAPI, Pydantic, and a maintainable persistence layer.
-   Keep provider integrations behind interfaces. Normalize provider
    jobs into internal IDs and statuses.
-   Treat generation as asynchronous. Return job IDs; do not keep HTTP
    requests open while inference runs.
-   Validate file type, file size, dimensions where relevant, ownership,
    and supported provider parameters.
-   Keep API keys exclusively on the server. Use environment variables
    and `.env.example`.
-   Add CORS for configured frontend origins, not unrestricted
    production CORS.
-   Use FFmpeg safely for editing jobs. Check executable availability
    and never build shell commands from untrusted user input.
-   Add database migrations when persistence is introduced.
-   Include automated tests for happy paths and failures.
-   Add clear setup instructions and PowerShell commands.
-   Clearly distinguish implemented, mocked, unavailable, and planned
    features in the UI and documentation.
-   Do not add paid services, incur API usage, create cloud resources,
    or deploy publicly without the owner's explicit approval.
-   Do not promise that a provider, model, or hosting tier is free
    unless verified against current official documentation.
-   Do not try to run large video-generation models on the owner's MX350
    laptop.

## Required working style

At the beginning, state the audit findings and the exact milestone you
will implement next. Then implement it. Do not stop after producing a
plan if the workspace allows you to edit and test files.

For each milestone: 1. Explain the intended change briefly. 2. Make
focused code changes. 3. Run tests, lint, type checking, and build
checks that apply. 4. Fix errors caused by your changes. 5. Summarize
changed files, commands run, test results, what is genuinely working,
what is mocked, and any credentials or external setup still required. 6.
Give the owner the next exact command or action.

If a decision needs user input---especially a paid provider, paid
hosting, public deployment, or handling private data---pause and ask one
concise question. For non-blocking choices, choose a sensible low-cost
default and document it.

## First task

Perform the repository audit now. Do not assume previous chat
instructions were executed. After the audit, implement and verify the
next smallest complete milestone without breaking existing work.
