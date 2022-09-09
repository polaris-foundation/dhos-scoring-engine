
export type Unvalidated<T> = {
    [P in keyof T]: T[P] | "undefined";
};

export interface CommonResponse {
    partial_set: boolean;
    empty_set?: boolean;
    overall_score?: number;

    respiratory_rate_score: number;
    oxygen_saturation_score: number;
    heart_rate_score: number;
    consciousness_score: number;
    temperature_score: number;
    overall_severity?: string;
    overall_score_display?: string;
    time_next_obs_set_due?: string;
    obx_reference_range?: string;
    obx_abnormal_flags?: string;
    ranking: string;
    monitoring_instruction?: string;
}

export interface News2Response extends CommonResponse {
    blood_pressure_score: number;
    o2_therapy_score: number;
}

export interface BaseFields {
    dateRecorded: string;
    zeroSeverityIntervalHours: number;
    lowSeverityIntervalHours: number;
    lowMediumSeverityIntervalHours: number;
    mediumSeverityIntervalHours: number;
    highSeverityIntervalHours: number;
}

interface CommonFields {
    respiratoryRate: number;
    heartRate: number;
    oxygenSaturation: number;
    systolicBloodPressure: number;
    consciousnessAcvpu: string;
    temperature: number;
    nurseConcern: string;
}

interface News2SpecificFields extends CommonFields {
    spo2Scale: number;
    o2Therapy: number;
    o2TherapyMask: string;

}

// Adds the string 'undefined' as an option to most fields that will be passed to the rules engine.
export interface News2Fields extends Unvalidated<News2SpecificFields>, BaseFields {}

export interface News2InputConfig {
    zero_severity_interval_hours?: number;
    low_severity_interval_hours?: number;
    low_medium_severity_interval_hours?: number;
    medium_severity_interval_hours?: number;
    high_severity_interval_hours?: number;
}

interface CommonInputs {
    time: string;
    respiratory_rate: number;
    heart_rate: number;
    oxygen_saturation: number;
    systolic_blood_pressure: number;
    consciousness_acvpu: string;
    temperature: number;
    nurse_concern: string;
    config: News2InputConfig;

}
export interface News2Inputs extends CommonInputs {
    spo2_scale: number;
    o2_therapy: number;
    o2_therapy_mask: string;
}

export interface MeowsResponse extends CommonResponse {
    systolic_blood_pressure_score: number;
    diastolic_blood_pressure_score: number;
}

export interface MeowsInputs extends CommonInputs {
    diastolic_blood_pressure: number;
}

export interface MeowsFields extends Unvalidated<CommonFields>, BaseFields {
    diastolicBloodPressure: number | 'undefined';
}
