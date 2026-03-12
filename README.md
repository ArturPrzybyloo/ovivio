## QA automation and performance assessment

This repository contains a small but complete setup for the “Senior Quality Engineer – Automation & Performance” assessment. It focuses on pragmatic Playwright UI automation and a simple k6 performance scenario, with enough structure to be maintainable without turning into a framework for its own sake.

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

### Running UI tests

All UI tests live under `ui-tests/` and are written with a simple page object model and a custom test fixture layer for reusable login logic.

Basic runs:

```bash
npm run test:ui
```

Headed mode for local debugging:

```bash
npm run test:ui:headed
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

The performance scenario is located in `perf-tests/dummyjson-auth-me.js` and described in more detail in `perf-tests/README-perf.md`.

To run it from the repository root:

```bash
npm run test:perf
```

or, if you prefer to call k6 directly:

```bash
k6 run perf-tests/dummyjson-auth-me.js
```

After a run, fill in the metrics and brief interpretation in `perf-tests/report.md`. That document is meant to show how you reason about the results, not to produce a perfect benchmark.

### CI workflow

The `.github/workflows/ui-tests.yml` workflow runs Playwright tests on pushes and pull requests to the main branches. Chromium is the default target; other Playwright projects can be enabled via `workflow_dispatch` inputs. The workflow also generates a CTRF JSON report and publishes a short summary into the job summary.

The `.github/workflows/perf-tests.yml` workflow runs the k6 scenario and can be triggered independently.

In a real project you might separate smoke tests from the full suite, run performance tests on a schedule rather than on every push, and wire notifications into Slack or Teams using repository secrets.

### Notes on design decisions

- Page objects are limited to what is needed for the requested scenarios (login, inventory, cart, checkout step one) to keep the surface area small and easy to follow, but contain business-level actions such as `addProductToCartByName` and header/menu components.
- A thin fixture layer (`ui-tests/src/fixtures/test-base.ts`) provides reusable login as `standard_user` and also demonstrates storageState-based fixtures (`authenticatedContext`, `authenticatedPage`), mirroring how auth would be handled with API/SSO in a larger system.
- ESLint and Prettier are configured with conservative rules so the test code stays consistent without fighting the tooling.
- The k6 script keeps authentication logic in `setup()` to focus the load on `/auth/me` and make the scenario easier to reason about.

