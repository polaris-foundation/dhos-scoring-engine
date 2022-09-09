import { Engine } from 'json-rules-engine';
import type { Almanac } from 'json-rules-engine';
import rules from './rules';

const engine = new Engine(rules);

const scoringElements = [
  'respiratoryRateScore',
  'oxygenSaturationScore',
  'systolicBloodPressureScore',
  'diastolicBloodPressureScore',
  'heartRateScore',
  'consciousnessScore',
  'temperatureScore'
];

engine.addFact('overallScore', async function (params: unknown, almanac: Almanac): Promise<number> {
  const valuePromises: Promise<number>[] = scoringElements.map(
      (element: string): Promise<number> => almanac.factValue(element));
  return (await Promise.all(valuePromises)).reduce((a: number, b: number) => a+b, 0);
});

export { engine as MeowsEngine };
