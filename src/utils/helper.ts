import axios from "axios";
import {
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  format,
} from "date-fns";

export const combineDateAndTimeToISO = (date: Date, time: Date): string => {
  const withHours = setHours(date, time.getHours());
  const withMinutes = setMinutes(withHours, time.getMinutes());
  const withSeconds = setSeconds(withMinutes, time.getSeconds());
  const withMilliseconds = setMilliseconds(withSeconds, time.getMilliseconds());
  const combined = withMilliseconds.toISOString();
  const localTime = format(combined, "yyyy-MM-dd'T'HH:mm:ss");
  return localTime;
};

const originURL = window.location.origin;

export const axiosInstance = axios.create({
  baseURL: originURL,
});
