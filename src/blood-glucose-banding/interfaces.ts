export interface HighLow {
  high: number;
  low: number;
}

export type PartPrandialTag = 'BEFORE-BREAKFAST'
  | 'AFTER-BREAKFAST'
  | 'BEFORE-LUNCH'
  | 'AFTER-LUNCH'
  | 'BEFORE-DINNER'
  | 'AFTER-DINNER';

export type BloodGlucoseThreshold = {
  [propName in PartPrandialTag]?: HighLow;
} & {
  ['OTHER']: HighLow;
};

export type SimpleOperator =
  | 'equal'
  | 'notEqual'
  | 'lessThan'
  | 'lessThanInclusive'
  | 'greaterThan'
  | 'greaterThanInclusive';

export type ArrayOperator = 'in' | 'notIn' | 'contains' | 'doesNotContain';

export interface BandingScoreRequest {
  blood_glucose_value?: number;
  prandial_tag_id?: string;
  blood_glucose_thresholds_mmoll?: Partial<BloodGlucoseThreshold>;
}

export interface BandingScoreFields {
  bloodGlucoseValue: number;
  prandialTagId: string;
  bloodGlucoseThresholds: BloodGlucoseThreshold;
}

export interface BandingIdResult { banding_id?: string }
