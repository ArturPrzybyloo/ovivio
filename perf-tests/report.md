## DummyJSON performance test – report

### 1. Test setup

- **Target API**: `https://dummyjson.com`.
- **Authentication**:
  - `POST /auth/login` with demo credentials (defaults from DummyJSON).
  - `accessToken` returned in the response body.
- **Tested endpoint**:
  - `GET /auth/me` with `Authorization: Bearer <accessToken>`.
- **Load profile**:
  - 1 minute ramp-up from 0 to 100 virtual users.
  - 3 minutes at 100 virtual users.
  - 1 minute ramp-down from 100 to 0 virtual users.
- **Request rate**:
  - Each virtual user executes one `GET /auth/me` call per second (`sleep(1)` in the default function).
- **Token handling**:
  - Token is obtained once in `setup()` and shared across VUs.
  - This avoids putting authentication under the same load as `/auth/me` and keeps the focus on the profiled endpoint.
- **k6 configuration**:
  - Thresholds on `http_req_failed` and `http_req_duration` to make the run clearly pass/fail.

### 2. Assumptions and limitations

- DummyJSON is a public demo API with shared infrastructure and traffic from other users, so:
  - Latency and error rates can vary between runs and over time.
  - The test does not control what other scenarios are hitting the API.
- Network conditions depend on the machine and location from which the test is executed.
- The test concentrates on a single authenticated `GET` endpoint; it does not exercise more complex business flows.
- No server-side observability is available, so all conclusions are based on client-side metrics from k6.

### 3. Collected metrics

Two representative runs of the `load` scenario (100 VUs, ~5 minutes total) produced the following aggregated metrics.

#### Run 1

- **Response time percentiles (`http_req_duration`)**:
  - P50 (median): ~154 ms
  - P95: 186.87 ms
  - P99: 351.41 ms
- **Error rate (`http_req_failed`)**:
  - 10.53 % (2 181 failed requests out of 20 702)
- **Throughput**:
  - Requests per second: ~68.8 req/s (`http_reqs`)
  - Iterations per second: ~68.8 it/s (`iterations`)

#### Run 2

- **Response time percentiles (`http_req_duration`)**:
  - P50 (median): 25.32 ms
  - P95: 44.38 ms
  - P99: 563.77 ms
- **Error rate (`http_req_failed`)**:
  - 5.82 % (1 355 failed requests out of 23 246)
- **Throughput**:
  - Requests per second: ~77.3 req/s
  - Iterations per second: ~77.3 it/s

In both runs the latency thresholds were satisfied:

- `http_req_duration: p(95) < 800 ms` – **passed**
- `http_req_duration: p(99) < 1500 ms` – **passed**

The reliability threshold was not met:

- `http_req_failed: rate < 0.05` – **failed** (10.53 % in run 1, 5.82 % in run 2)

### 4. Interpretation

- **Latency**: For a public demo API, the observed latencies are very good. In the second run, P50 ≈ 25 ms and P95 ≈ 44 ms, which would be more than acceptable for a simple authenticated read endpoint in most production systems. Even in the first run, with slightly higher load on the shared infrastructure, P95 ≈ 187 ms and P99 ≈ 351 ms remain comfortably under the 800/1500 ms thresholds.
- **Stability and distribution**: The gap between P50 and P95 is moderate in both runs, which suggests a relatively tight distribution with occasional slower responses (especially visible in the P99 of the second run, ~564 ms). This is consistent with a shared multi-tenant demo service where some requests occasionally contend for resources but there is no clear evidence of sustained saturation.
- **Error rate**: The main concern is reliability: 10.53 % errors in the first run and 5.82 % in the second both violate the `rate < 5 %` threshold. The failing check `auth/me status is 200` indicates that a non-trivial fraction of `/auth/me` calls did not return HTTP 200 (likely intermittent 5xx or other non-OK responses). In a production context this level of error rate would be unacceptable for a core authenticated endpoint.
- **Throughput vs. behaviour**: The achieved throughput (~69–77 req/s) is in line with expectations for 100 VUs doing roughly one request per second each (taking into account think time and jitter). There is no sign of throughput collapsing, which means the system continues to serve traffic but does so with intermittent errors rather than graceful backpressure.

Overall, DummyJSON handles the requested load with good latency characteristics but shows reliability issues under sustained concurrent access to `/auth/me`, as captured by the elevated `http_req_failed` rate.

### 5. Potential optimisation directions

Even though DummyJSON is just a demo service, in a real production system with a similar traffic pattern I would consider:

- **Backend and data model**:
  - Ensuring that the work done by `/auth/me` is backed by appropriate indexes and avoids unnecessary joins or remote calls.
  - Introducing a lightweight cache for common user profile data looked up on every request (for example, session/user info in an in-memory cache with short TTL).
- **Capacity and architecture**:
  - Verifying that the service has enough headroom in CPU and memory at 100 VUs, and scaling horizontally (more instances) or vertically (larger instances) where necessary.
  - Reviewing connection pool and keep-alive settings between the API gateway and backend services to avoid connection churn under load.
- **API and networking**:
  - Applying sensible server-side timeouts and graceful degradation strategies (e.g. circuit breakers) so that transient downstream issues do not cascade into user-visible errors.
  - Keeping the `/auth/me` response payload minimal, especially if it is called very frequently from frontends.
- **Testing and observability**:
  - Running this kind of scenario regularly (for example nightly) and tracking trends in P50/P95/P99 and `http_req_failed` over time.
  - Correlating k6 metrics with server-side observability (request logs, error logs, CPU, memory, I/O, database metrics) to pinpoint the exact source of intermittent failures.

These steps would help turn the good latency profile observed here into a consistently reliable experience by reducing the error rate under sustained load.

