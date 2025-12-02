import dayjs from "dayjs";

export const dateUtil = {
  format: (date, pattern) => {
    return dayjs(date).format(pattern ?? "YYYY-MM-DD");
  },
  today: (pattern) => {
    return dayjs().format(pattern ?? "YYYY-MM-DD");
  },
};
