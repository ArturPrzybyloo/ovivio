## Performance tests for DummyJSON

This directory contains a k6 scenario that exercises the DummyJSON authentication flow and the `/auth/me` endpoint under load.

### Scenario overview

- Obtain an `accessToken` by calling `POST https://dummyjson.com/auth/login`.
- Reuse that token across virtual users.
- Run 100 concurrent users hitting `GET https://dummyjson.com/auth/me`.
- Each user sends one authenticated request per second.
- Use a short ramp-up, a few minutes at steady load, and a short ramp-down to reach stable metrics without making the run unnecessarily long.

The implementation is in `dummyjson-auth-me.js`. The script uses a `setup` function to authenticate once and share the token across VUs, which is usually closer to a real-world pattern for API backends protected by stateless tokens.

### Prerequisites

- k6 installed locally (for example from the official Grafana k6 packages or via `brew install k6` on macOS).
- Internet access to reach `https://dummyjson.com`.

### How to run the test

From the repository root:

```bash
npm run test:perf
```

or directly with k6:

```bash
k6 run perf-tests/dummyjson-auth-me.js
```

You can override the default DummyJSON demo credentials with environment variables:

```bash
export DUMMYJSON_USERNAME="your-username"
export DUMMYJSON_PASSWORD="your-password"
k6 run perf-tests/dummyjson-auth-me.js
```

### Adjusting load profile

The current options use staged execution:

- 1 minute ramp-up to 100 VUs.
- 3 minutes at 100 VUs.
- 1 minute ramp-down.

You can tweak this in the `options.stages` section inside `dummyjson-auth-me.js` if you need a longer steady state, a different number of users, or a different shape of the load curve. For the purposes of the assessment, this duration is a compromise between reasonably stable metrics and acceptable feedback time in CI.

### Metrics to capture

When you run the test, note down at least:

- Response time percentiles for `http_req_duration` (P50, P95, P99).
- Error rate (`http_req_failed`).
- Throughput in requests per second.

The `perf-tests/report.md` file contains a simple structure you can use to record and interpret these numbers.

