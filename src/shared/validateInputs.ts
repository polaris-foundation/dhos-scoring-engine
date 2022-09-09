import ValidationException from './exceptions';
import dayjs from 'dayjs';
import {BaseFields, Unvalidated} from "../interfaces";

const validateInputs = async <T extends BaseFields>(inputs: Unvalidated<T>): Promise<T> => {
  const timestampIso8601 = inputs.dateRecorded;
  if (
    typeof timestampIso8601 === 'undefined' ||
    !dayjs(timestampIso8601).isValid()
  ) {
    throw new ValidationException(
      'Missing or invalid timestamp',
      'Must include a valid ISO8601 timestamp "time" in the body'
    );
  }

  if (
    [
      inputs.zeroSeverityIntervalHours,
      inputs.lowSeverityIntervalHours,
      inputs.lowMediumSeverityIntervalHours,
      inputs.mediumSeverityIntervalHours,
      inputs.highSeverityIntervalHours
    ].some(field => field === 'undefined')
  ) {
    throw new ValidationException(
      'Missing config values in body',
      'Must include expected config values in body'
    );
  }

  return inputs as T;
};

export default validateInputs;
