import allTestCases from './cases/bg_readings/cases.json';
import boundaryTestCases from './cases/bg_readings/bg_boundaries.json';
import { bloodGlucoseReadingBanding } from '../src/blood-glucose-banding';
import '../src/blood-glucose-banding/interfaces';
import {BloodGlucoseThreshold} from "../src/blood-glucose-banding/interfaces";

interface BloodGlucoseTestData {
  id: string;
  data: {
    blood_glucose_value: number;
    prandial_tag_id: string;
    blood_glucose_thresholds_mmoll: BloodGlucoseThreshold;
  };
  expected: { banding_id: string };
}

allTestCases.forEach(testCase => {
  describe(`Test blood glucose readings using case ${testCase.id}`, () => {
    test('It should match the expected output', async () => {
      let actual;
      try {
        actual = await bloodGlucoseReadingBanding(testCase.data);
      } catch (e) {
        actual = e.logMessage;
      }
      expect(actual).toEqual(testCase.expected);
    });
  });
});

(boundaryTestCases as BloodGlucoseTestData[]).forEach(
  (testCase: BloodGlucoseTestData) => {
    describe(`Test blood glucose boundaries using case ${testCase.id}`, () => {
      test('It should match the expected output', async () => {
        let actual;
        try {
          actual = await bloodGlucoseReadingBanding(testCase.data);
        } catch (e) {
          actual = e.logMessage;
        }
        expect(actual).toEqual(testCase.expected);
      });
    });
  }
);
