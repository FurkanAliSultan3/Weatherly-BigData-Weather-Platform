# Weatherly implementation status and follow-up

This guide compares the supplied functional specification with the code in this
repository. The application is a working prototype, not yet a live IMD warning
or national big-data service.

## Fixed in this pass

- Mounted report and analytics routers at `/api/v1/reports` and
  `/api/v1/analytics`, matching the frontend requests.
- Changed the database dependency to a synchronous SQLAlchemy session, matching
  the ORM operations used by the API. `postgresql+asyncpg` URLs are adapted to
  the declared `psycopg2` driver.
- Fixed report/verification ORM relationships, PostGIS point storage and
  coordinate reads.
- Aligned public report submission with the JSON schema and made citizen
  submissions anonymous-capable.
- Aligned officer review requests with a JSON body and added reviewer/status
  updates.
- Disabled authentication for local development. Officer routes and current
  officer APIs are open; do not deploy this configuration publicly.
- Added same-origin Vite development proxies for API and WebSocket traffic.
- Added public-safe aggregate KPIs, a database health route and stored-data
  analytics; removed random values from the officer analytics screen.
- Connected the review-record view to the API, replaced dead officer navigation targets,
  added map status filtering and marked mock map pins as preview-only when the
  API is unavailable.
- Added location-by-map and browser GPS selection to the citizen report form.
- Replaced placeholder public About and Alerts screens with accurate status
  information.
- Added `backend/migrations/001_add_rain_report_category.sql`; run it once
  against an existing database before accepting rain reports.

## Required before exercising the live API

1. Apply `backend/migrations/001_add_rain_report_category.sql` to the configured
   PostgreSQL database. The app's `RAIN` enum value must exist in the database
   before submitting a rain report.
2. Ensure the PostgreSQL database has PostGIS enabled and the `users`,
   `reports` and `verifications` tables match the models in
   `backend/app/models/`. There is not yet a complete schema-bootstrap or
   migration runner in this repository.
3. Restart the backend process on port 8000 so it loads the router prefixes,
   health route and session changes. In this workspace, the existing process
   returned 404 for `/api/v1/health`, so browser API requests could not be
   verified against the updated code.
4. Restart the Vite development server to load the `/api/v1` and `/ws` proxy
   settings in `frontend/vite.config.js`.
5. Authentication has intentionally been removed for now. Open the officer
   console directly from the navbar. Re-enable authentication and role checks
   before deploying the app to any shared or public environment.

For a deployed frontend, set `VITE_API_BASE_URL` to the reachable API's
`/api/v1` base URL. Restrict `BACKEND_CORS_ORIGINS` to the deployed frontend
origins instead of `*` before production.

## Still needs implementation and real service credentials

These features in the specification need additional domain models, migrations,
external services, or production data. Do not represent them as live until
those pieces are connected and tested.

### Official alerts and emergency broadcast

- Add an alert model and migration (for example
  `backend/app/models/alert.py` and `backend/migrations/`).
- Add public `GET /api/v1/alerts/active` and protected officer create/update
  endpoints under `backend/app/api/endpoints/`.
- Add an officer alert-management page and route in `frontend/src/App.tsx`.
- Publish an `ALERT_UPDATE` event from `backend/app/api/endpoints/websockets.py`;
  subscribe in the public layout and show only official, scoped alerts.
- Replace the explicit unavailable state in `frontend/src/pages/public/AlertsPage.tsx`
  only after the real feed returns authoritative alert records.

### Media upload, EXIF and AI trust pipeline

- Add private object storage configuration and upload/error handling to
  `backend/app/api/endpoints/reports.py`; do not accept arbitrary remote URLs as
  trusted evidence.
- Add multipart parsing, file type/size limits and EXIF extraction to
  `frontend/src/components/features/reporting/ReportForm.tsx` and the matching
  backend schema/endpoint.
- Replace the simulated score in `backend/app/services/verification.py` with
  actual, versioned model/service integrations. The current IMD proximity result
  is deliberately simulated and must not be used to claim verified truth.
- Add duplicate clustering and real PostGIS station/radar data before claiming
  the specified 5 km/30 minute deduplication behavior.

### Real weather data, geographic detail and map layers

- Connect approved IMD/AWS/radar sources and expose their provenance and
  freshness through backend ingestion services.
- Reverse-geocode stored coordinates if city/state names are required; current
  report output includes coordinates and leaves city/state empty.
- Implement officer-only heatmap and radar overlays in
  `frontend/src/maps/PublicTrustMap.tsx`; current map renders report pins only.
- Replace generated preview pins in `frontend/src/services/mockData.ts` with an
  empty/offline map or stable, visibly labeled fixtures for demos.

### Remaining analytics and source operations

- Add date-range filtering and 24-hour/30-day/quarter aggregation to
  `backend/app/api/endpoints/analytics.py` and expose the selected range in
  `frontend/src/pages/officer/AnalyticsDashboard.tsx`.
- Add real regional aggregation after reports have reverse-geocoded
  administrative areas.
- Add a data-source status model/endpoint and a connected officer page before
  presenting source-health indicators as live.
- Replace the current audit view's derived `Verification` rows with an append-only
  audit table if immutable review history is required; current review actions
  update the existing verification record.

## Verification performed

- `npm --prefix frontend run build` succeeds. Vite reports the existing large
  JavaScript bundle warning.
- `npm --prefix frontend run lint` succeeds. It still reports Fast Refresh
  warnings in the context modules and effect-driven report loading in the
  officer pages.
- The two standalone backend flow scripts pass when run with the backend
  directory on `PYTHONPATH`.
- Backend application imports, SQLAlchemy mapper configuration and generated
  OpenAPI paths pass validation.
- The browser report form renders and clicking the map populates coordinates.
- Live API/DB requests were not end-to-end verified: the currently running
  backend still responds 404 to the new health path. Restart it as described
  above, then verify report submission, review actions, analytics, audit and
  WebSocket updates against the configured database.
