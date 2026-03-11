## Reflection and seniority check

### 1. Integrating Playwright tests into CI/CD

For this assessment the Playwright suite is wired into a single GitHub Actions workflow that runs on every push and pull request to the main branches. In a real project I would usually split test runs by purpose: short smoke tests on every commit, the full cross‑browser suite on main or on a schedule, and nightly runs with additional diagnostics (traces, videos) enabled. Playwright’s CLI and configuration model make it straightforward to tag tests or use separate projects/configs per pipeline stage, and then plug them into the existing CI system (GitHub Actions, Azure DevOps, GitLab CI, Jenkins) as independent jobs that publish HTML reports and artifacts.

### 2. Notifying the team about failures or regressions

I prefer to integrate CI with the team’s primary channel (Slack or Teams) rather than expecting people to poll the CI UI. For GitHub Actions that usually means a dedicated notification job that sends a concise message via an incoming webhook only when important pipelines fail (for example, pushes to main, release branches, or nightly runs). The message should link directly to the failing workflow and, where possible, to the Playwright or k6 report, so the person on duty can go from alert to context in a single click; less critical branches can rely on pull request status checks instead of chat notifications.

### 3. Observability metrics for an end‑to‑end quality dashboard

For automation I would track basic stability and effectiveness: pass rate over time, flakiness (tests that both pass and fail across recent runs), execution time of suites, and rough coverage indicators (for example, critical flows covered vs. not covered). From the performance side I would surface latency percentiles (P50/P95/P99), error rates, saturation indicators (CPU, memory, connection pools), and capacity markers such as sustainable throughput at a given SLO. On top of that I like to include one or two business‑level metrics that are sensitive to quality issues (for example, checkout success rate or sign‑up completion) so it is easy to tell whether a technical regression is likely to be visible to users.

### 4. Deciding what to automate and what belongs to performance vs. functional testing

I treat automation as an investment decision: scenarios that are high‑risk, high‑impact, or frequently executed by users are strong candidates, provided the underlying UI or API is stable enough that maintenance cost stays reasonable. One‑off or very volatile flows, highly visual aspects, and areas where exploratory testing adds more value are usually left to manual or session‑based testing instead of UI automation. Functional tests answer the question “does it work and behave correctly?” under nominal conditions, while performance tests answer “how does it behave under load and over time?”; the same business flow might appear in both, but with different focus, tooling, and acceptance criteria (for example, a login test that verifies error messages functionally, and a separate performance scenario that measures how login behaves under hundreds of concurrent users).

