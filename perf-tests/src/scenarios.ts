import type { Options } from 'k6/options';

// __ENV is provided by k6 at runtime; declare for TypeScript.
declare const __ENV: Record<string, string | undefined>;

type ScenarioName = 'load' | 'spike' | 'stress' | 'endurance';

function loadStages() {
  return [
    { duration: '1m', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 }
  ];
}

function spikeStages() {
  return [
    { duration: '30s', target: 10 },
    { duration: '10s', target: 150 },
    { duration: '30s', target: 150 },
    { duration: '1m', target: 0 }
  ];
}

function stressStages() {
  return [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 150 },
    { duration: '2m', target: 200 },
    { duration: '1m', target: 0 }
  ];
}

function enduranceStages() {
  return [
    { duration: '2m', target: 50 },
    { duration: '10m', target: 50 },
    { duration: '2m', target: 0 }
  ];
}

export function getScenarioOptions(): Options {
  const scenario = (__ENV.SCENARIO as ScenarioName | undefined) ?? 'load';

  const stages =
    scenario === 'spike'
      ? spikeStages()
      : scenario === 'stress'
      ? stressStages()
      : scenario === 'endurance'
      ? enduranceStages()
      : loadStages();

  return {
    stages,
    thresholds: {
      http_req_failed: ['rate<0.05'],
      http_req_duration: ['p(95)<800', 'p(99)<1500']
    }
  };
}

