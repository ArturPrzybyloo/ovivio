## Performance tests for DummyJSON

This repository contains a k6 scenario that exercises the DummyJSON authentication flow and the `/auth/me` endpoint under load. The test code is written in TypeScript and bundled to JavaScript before execution.

### Scenario overview

- Obtain an `accessToken` by calling `POST https://dummyjson.com/auth/login`.
- Reuse that token across virtual users.
- Run 100 concurrent users hitting `GET https://dummyjson.com/auth/me`.
- Each user sends one authenticated request per second.
- Use a short ramp-up, a few minutes at steady load, and a short ramp-down to reach stable metrics without making the run unnecessarily long.

The main implementation lives in `perf-tests/tests/dummyjson-auth-me.test.ts`. The TypeScript sources are bundled to `perf-tests/dist/dummyjson-auth-me.js` before running k6. The script uses a `setup` function to authenticate once and share the token across VUs, which is usually closer to a real-world pattern for API backends protected by stateless tokens.

### Prerequisites

- k6 installed locally (for example from the official Grafana k6 packages or via `brew install k6` on macOS).
- Internet access to reach `https://dummyjson.com`.
- Environment variables `DUMMYJSON_USERNAME` and `DUMMYJSON_PASSWORD` set – typically via a local `.env` file as described in the main `README.md`, and via CI secrets in GitHub Actions.

### How to run the test

In short (also described in the main `README.md`):

```bash
npm run test:perf
```

This command:

- bundles the TypeScript sources (`perf:build`),
- runs k6 against the generated `perf-tests/dist/dummyjson-auth-me.js`,
- writes `perf-tests/summary.json`, which is also used by the GitHub Actions workflow to render a concise summary.

If you want to override the username/password just for a single run, you can run k6 directly:

```bash
export DUMMYJSON_USERNAME="your-username"
export DUMMYJSON_PASSWORD="your-password"

npm run perf:build
k6 run perf-tests/dist/dummyjson-auth-me.js
```

### Optional: Grafana + InfluxDB dashboard

If you want to visualise the k6 metrics locally you can spin up InfluxDB and Grafana using the provided `docker-compose.yml` in this directory.

1. From the `perf-tests` folder start the monitoring stack:

   ```bash
   docker compose up -d
   ```

   This starts:

   - InfluxDB on `http://localhost:8086` with a `k6` database.
   - Grafana on `http://localhost:3000` (default login `admin` / `admin`).

2. Run the test and send results to InfluxDB:

   ```bash
   npm run perf:build
   k6 run perf-tests/dist/dummyjson-auth-me.js --out influxdb=http://localhost:8086/k6
   ```

3. Open Grafana in the browser (`http://localhost:3000`), add an **InfluxDB** data source:

   - URL: `http://influxdb:8086`
   - Database: `k6`

<img width="1423" height="747" alt="image" src="https://github.com/user-attachments/assets/51b4f5f8-d991-4b47-b95c-1d40f8c21d3a" />
<img width="1162" height="402" alt="image" src="https://github.com/user-attachments/assets/0ee15431-ce89-4e54-92d2-fa27bf34902f" />




4. Import a standard k6 dashboard (for example by using a dashboard ID from Grafana.com) and point it to the `k6` data source. You should see metrics from your DummyJSON scenario appear on the panels.

### Adjusting load profile

Load profile is selected based on the `SCENARIO` environment variable and configured in `src/scenarios.ts`. Available scenarios:

- `load` (default): balanced ramp-up/steady/ramp-down for 100 VUs.
- `spike`: short baseline then aggressive spike to higher load.
- `stress`: gradual increase towards higher sustained load to look for failure points.
- `endurance`: lower load over a longer period to observe stability over time.

Examples:

```bash
# default load profile
npm run test:perf

# spike test
SCENARIO=spike npm run test:perf

# endurance test
SCENARIO=endurance npm run test:perf
```

### Metrics to capture

When you run the test, note down at least:

- Response time percentiles for `http_req_duration` (P50, P95, P99).
- Error rate (`http_req_failed`).
- Throughput in requests per second.

The `perf-tests/report.md` file contains a simple structure you can use to record and interpret these numbers.

