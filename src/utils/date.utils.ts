import dayjs, { Dayjs } from "dayjs";

export type DateInput = string | number | Date | Dayjs | null | undefined;

export interface DateUtil {
  getCurrentDateFormatted: (pattern?: string) => string;
  format: (date: DateInput, pattern?: string) => string;
  timeFormat: (date: DateInput, pattern?: string) => string;
  today: Dayjs;
  incrementDay: (date: DateInput, days: number) => string;
  decrementDay: (date: DateInput, days: number) => string;
  isBefore: (date: DateInput, targetDate: DateInput) => boolean;
  isAfter: (date: DateInput, targetDate: DateInput) => boolean;
}

export const dateUtil: DateUtil = {
  today: dayjs().startOf("day"),

  format: (date, pattern = "YYYY-MM-DD"): string => {
    return dayjs(date).format(pattern);
  },

  getCurrentDateFormatted: (pattern = "YYYY-MM-DD"): string => {
    return dayjs().format(pattern);
  },

  timeFormat: (date, pattern = "HH:mm"): string => {
    return dayjs(date).format(pattern);
  },
  incrementDay: (date: DateInput, days: number = 1): string => {
    return dayjs(date).add(days, "day").format("YYYY-MM-DD");
  },
  decrementDay: (date: DateInput, days: number = 1): string => {
    return dayjs(date).subtract(days, "day").format("YYYY-MM-DD");
  },
  isBefore: (date: DateInput, targetDate: DateInput): boolean => {
    return dayjs(date).isBefore(dayjs(targetDate));
  },
  isAfter: (date: DateInput, targetDate: DateInput): boolean => {
    return dayjs(date).isAfter(dayjs(targetDate));
  },
};

export const timeRanges: string[] = [
  "09:00 - 10:00",
  "10:00 - 11:30",
  "11:30 - 13:00",
  "13:00 - 14:30",
  "14:30 - 16:00",
  "16:00 - 17:30",
  "17:30 - 19:00",
];
