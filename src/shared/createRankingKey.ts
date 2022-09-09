import dayjs from 'dayjs';
import {CommonResponse} from "../interfaces";

const createRankingKey = (
  { partial_set, empty_set, overall_score }: CommonResponse,
  hasNurseConcern: boolean,
  severityRanking: number,
  dateRecorded: dayjs.Dayjs
) => {
  const padded_score: string = ('00' + overall_score).slice(-2);
  const combined_partial_set: number = (partial_set && !empty_set)? 1 : 0;
  const empty_set_number: number = empty_set ? 1 : 0;
  // Older observations should appear above
  const dateRecordedInverted =
    1000000000000000 - new Date(dateRecorded.toISOString()).getTime();

  return `${+hasNurseConcern}${severityRanking}${padded_score}${combined_partial_set
    }${empty_set_number},${dateRecordedInverted}`;
};

export default createRankingKey;
