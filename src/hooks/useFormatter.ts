import moment from "moment";

export const useFormatter = () => {
  const formatDateTime = (date: string) =>
    moment(date).format("DD MMM YYYY, HH:mm");
  const formatDate = (date: string) => moment(date).format("DD MMM YYYY");
  const formatTime = (date: string) => moment(date).format("HH:mm");
  const formatDateISO = (date: string) => moment(date).toISOString();

  const day = (day: string) => moment(day).format("dddd");
  const date = (date: string) => moment(date).format("DD");
  const month = (month: string) => moment(month).format("MMMM");
  const year = (year: string) => moment(year).format("YYYY");

  const formatMoney = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return {
    formatMoney,
    formatDate,
    formatDateTime,
    formatTime,
    formatDateISO,
    day,
    date,
    month,
    year,
  };
};
