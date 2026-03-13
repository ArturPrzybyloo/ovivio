## QA automation and performance assessment

This repository contains a small but complete setup for the “Senior Quality Engineer – Automation & Performance” assessment. It focuses on pragmatic Playwright UI automation and a simple k6 performance scenario, with enough structure to be maintainable without turning into a framework for its own sake.

### Quick start

#### UI tests

From the repository root:

```bash
npm install
npx playwright install

cp .env.example .env

set -a
source .env
set +a

npm run test:ui
```

#### Performance tests

From the repository root (after the same `.env` setup as above):

```bash
npm install

npm run test:perf
```

This runs the DummyJSON `/auth/me` scenario with a default load profile and writes a `perf-tests/summary.json` file that is also used by the CI workflow to render a short summary.

### Structure

- `ui-tests/` – Playwright + TypeScript tests for `https://www.saucedemo.com`.
- `perf-tests/` – k6 performance test and related documentation for DummyJSON.
- `docs/` – reflection answers for the seniority questions.
- `.github/workflows/ui-tests.yml` – GitHub Actions workflow that runs both UI and performance tests.

<img width="1276" height="708" alt="image" src="https://github.com/user-attachments/assets/a1e61f84-34cb-4344-8e78-c940e601e3e6" />


### Prerequisites

- Node.js (LTS) and npm.
- Playwright browsers (installed via `npx playwright install`).
- k6 installed locally if you want to run performance tests from your machine.
- Optional `.env` file based on `.env.example` if you want to override default demo credentials.

### Installation

From the repository root:

```bash
npm install
npx playwright install
```

If you want to use the provided demo credentials locally, create a `.env` file from the template and load it into your shell:

```bash
cp .env.example .env

# load variables into the current shell session (bash/zsh)
set -a
source .env
set +a
```

The tests intentionally do **not** provide fallback values in code – they expect credentials to be present in the environment. In CI the same variables are provided via GitHub `secrets`; locally they come from the `.env` you just loaded.

### Running UI tests

All UI tests live under `ui-tests/` and are written with a simple page object model and a custom test fixture layer for reusable login logic.

Basic runs (headless, all projects):

```bash
npm run test:ui
```

Headed mode for local debugging:

```bash
npm run test:ui:headed
```

You can also use Playwright’s different execution modes directly:

- **Single test file, headed**:

  ```bash
  cd ui-tests
  npx playwright test tests/cart.spec.ts --headed
  ```

- **UI mode (interactive runner with locator picker/recorder)**:

  ```bash
  cd ui-tests
  npx playwright test --ui
  ```

- **With traces always on (for local debugging)**:

  ```bash
  cd ui-tests
  PWTRACE=on npx playwright test tests/checkout.spec.ts --headed
  ```

After a run you can open the last HTML report with:

```bash
npm run test:ui:report
```

<img width="1015" height="398" alt="image" src="https://github.com/user-attachments/assets/5c378614-3477-41b4-bdc7-2628fba29ff4" />


The scenarios implemented against saucedemo cover:

- Successful login as `standard_user`.
- Failed login as `locked_out_user`.
- Adding a product to the cart.
- Starting the checkout flow from a filled cart.

Tests use explicit expectations (`toBeVisible`, `toHaveURL`, etc.) instead of arbitrary timeouts, and selectors are encapsulated in page object classes to keep the specs readable.

### Running performance tests

The performance scenario is located in `perf-tests/tests/dummyjson-auth-me.test.ts` (TypeScript) and is bundled to `perf-tests/dist/dummyjson-auth-me.js` before execution.

To run it from the repository root:

```bash
npm run test:perf
```

or, if you prefer to call k6 directly after bundling:

```bash
npm run perf:build
k6 run perf-tests/dist/dummyjson-auth-me.js
```

After a run, fill in the metrics and brief interpretation in `perf-tests/report.md`. That document is meant to show how you reason about the results, not to produce a perfect benchmark.

### GitHub Actions

Both workflows run automatically on **push** and **pull_request** to `main` / `master`. You can also run them manually from the **Actions** tab and control what gets executed.

#### UI tests (`.github/workflows/ui-tests.yml`)

- **Automatic runs**: Only the **Chromium** project runs (single job).
- **Manual run** (Actions → UI tests → Run workflow): Use the checkboxes to choose which browser projects to run:
  - **Run Chromium project** (default: on)
  - **Run Firefox project**
  - **Run WebKit project**
  - **Run Chromium mobile project** (e.g. Pixel 5)
  - **Run WebKit mobile project** (e.g. iPhone 13)

  <img width="1411" height="630" alt="image" src="https://github.com/user-attachments/assets/b4fcc19d-f3ec-4857-ad97-627ebfd728a6" />


  Only the jobs for the selected projects are executed. This keeps CI fast on push/PR while allowing full cross-browser runs on demand.

- The workflow uploads the Playwright HTML report and CTRF report as artifacts and publishes a test summary to the job summary.

#### Performance tests (`.github/workflows/perf-tests.yml`)

- **Automatic runs**: The **load** scenario is used (ramp to 100 VUs, steady, ramp-down).
- **Manual run** (Actions → Performance tests → Run workflow): Choose the **Scenario**:
  - **load** (default) – ramp-up, steady load at 100 VUs, ramp-down
  - **spike** – short baseline then spike to higher load
  - **stress** – gradual increase to find breaking point
  - **endurance** – sustained lower load over a longer period

  <img width="1396" height="531" alt="image" src="https://github.com/user-attachments/assets/3655d3a8-f23b-4230-9413-5559ee2d8320" />


  The selected scenario is passed as the `SCENARIO` environment variable to k6; the script reads it in `perf-tests/src/scenarios.ts`.

- The workflow exports k6 metrics to `perf-tests/summary.json`, uploads it as an artifact, and writes a short table (P50, P95, P99, error rate, throughput) to the job summary.

In a real project you might run smoke tests on every commit, the full UI matrix on a schedule or on release, and wire notifications (e.g. Slack/Teams) to failed runs using repository secrets.

### Notes on design decisions

- Page objects are limited to what is needed for the requested scenarios (login, inventory, cart, checkout step one) to keep the surface area small and easy to follow, but contain business-level actions such as `addProductToCartByName` and header/menu components.
- A thin fixture layer (`ui-tests/src/fixtures/test-base.ts`) provides reusable login as `standard_user` and also demonstrates storageState-based fixtures (`authenticatedContext`, `authenticatedPage`), mirroring how auth would be handled with API/SSO in a larger system.
- ESLint and Prettier are configured with conservative rules so the test code stays consistent without fighting the tooling.
- The k6 script keeps authentication logic in `setup()` to focus the load on `/auth/me` and make the scenario easier to reason about.

