import { calculateNews2 } from '../src/news2';
import type {News2Inputs, News2Response} from "../src/interfaces";

import blood_pressure from './cases/news2/blood_pressure.json';
import failures from './cases/news2/failures.json';
import nurse_concern from './cases/news2/nurse_concern.json';
import overall from './cases/news2/overall.json';
import refusedall from './cases/news2/refusedall.json';
import temperature from './cases/news2/temperature.json';
import consciousness from './cases/news2/consciousness.json';
import heart_rate from './cases/news2/heart_rate.json';
import o2_therapy from './cases/news2/o2_therapy.json';
import oxygen_saturation from './cases/news2/oxygen_saturation.json';
import respiratory_rate from './cases/news2/respiratory_rate.json';

interface News2TestData {
  id: string;
  data: Partial<News2Inputs>;
  expected: News2Response | string;
  error?: number;
  filename?: string;
}

function tname(tests: News2TestData[], filename: string): News2TestData[] {
  console.log(filename);
  return tests.map((t): News2TestData => ({...t, filename}));
}

const allTestCases: News2TestData[] = [
    ...tname(blood_pressure, 'blood_pressure'),
    ...tname(consciousness, 'consciousness'),
    ...tname(failures, 'failures'),
    ...tname(heart_rate, 'heart_rate'),
    ...tname(nurse_concern, 'nurse_concern'),
    ...tname(o2_therapy, 'o2_therapy'),
    ...tname(overall, 'overall'),
    ...tname(oxygen_saturation, 'oxygen_saturation'),
    ...tname(refusedall, 'refusedall'),
    ...tname(respiratory_rate, 'respiratory_rate'),
    ...tname(temperature, 'temperature')
];

allTestCases.forEach(testCase => {
  describe(`Test NEWS2 using case ${testCase.id} from ${testCase.filename}`, () => {
    test('It should match the expected output', async () => {
      let actual: News2Response | string;
      try {
        actual = await calculateNews2(testCase.data);
      } catch (e) {
        actual = e.logMessage;
      }
      expect(actual).toEqual(testCase.expected);
    });
  });
});
