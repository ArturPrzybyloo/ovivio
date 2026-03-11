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

Fill in these values after running `k6 run perf-tests/dummyjson-auth-me.js`:

- **Response time percentiles (http_req_duration)**:
  - P50: `___` ms
  - P95: `___` ms
  - P99: `___` ms
- **Error rate (http_req_failed)**:
  - Value: `___` (e.g. 0.00 for 0 % errors)
- **Throughput**:
  - Requests per second (overall): `___` req/s
  - Notes (optional): e.g. whether throughput was stable during the steady-state period.

If you need more detail, you can export results to JSON and process them with custom tooling or dashboards, but for this assessment the summary from the console output is sufficient.

### 4. Interpretation

Use this section to summarise what the numbers tell you. Example points to address:

- Czy przy zadanym obciążeniu (100 użytkowników, 1 żądanie na sekundę) opóźnienia są akceptowalne dla tej klasy API.
- Czy widać wyraźne oznaki degradacji przy starcie testu, w fazie steady-state albo w ramp-down.
- Jak wygląda rozkład percentyli – czy P95/P99 znacząco odbiegają od mediany, co może sugerować sporadyczne wolne odpowiedzi.
- Czy pojawiły się błędy HTTP (np. 5xx, 429) i w jakiej części testu.

### 5. Potencjalne kierunki optymalizacji

Nawet jeżeli DummyJSON jest tylko przykładowym systemem, przy podobnym profilu ruchu w aplikacji produkcyjnej rozważałbym między innymi:

- **Backend i dane**:
  - Upewnienie się, że operacje wykonywane przez `/auth/me` są oparte na dobrze zindeksowanych danych.
  - Cache’owanie często odczytywanych informacji o zalogowanym użytkowniku.
- **Architektura i zasoby**:
  - Skalowanie poziome backendu (więcej instancji) lub pionowe (więcej CPU/RAM), jeśli wąskie gardło leży po stronie CPU lub pamięci.
  - Optymalizacja konfiguracji connection poola i keep-alive między API gateway a usługą backendową.
- **Sieć i konfiguracja API**:
  - Rozsądne timeouts po stronie serwera i klienta, żeby nie trzymać wiszących połączeń.
  - Ograniczanie rozmiaru odpowiedzi, jeśli payload użytkownika jest rozbudowany.
- **Testy i monitorowanie**:
  - Uruchamianie podobnych testów cyklicznie (np. nightly) i śledzenie trendów percentyli i error rate.
  - Korelacja metryk k6 z metrykami infrastruktury (CPU, pamięć, I/O) i logami aplikacji, jeśli są dostępne.

Taki raport daje wystarczający obraz zachowania API przy prostym scenariuszu obciążenia i wskazuje, w którą stronę patrzeć przy dalszych optymalizacjach.

