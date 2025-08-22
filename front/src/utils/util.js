export const getDatetime = (taskDate) => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const datetimeValue = `${taskDate} ${hours}:${minutes}:${seconds}`;

  return datetimeValue;
};
export const getWeekTimeRange = (nowDateObj) => {
  const monday = new Date(nowDateObj);
  monday.setDate(nowDateObj.getDate() - (nowDateObj.getDay() || 7) + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  console.log("monday, sunday", monday, sunday);
  return {
    from: monday.getTime(),
    to: sunday.getTime(),
  };
};
export const isInRange = (el, from, to) => {
  if (el > from && el < to) {
    return true;
  } else {
    return false;
  }
};
export const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Месяцы начинаются с 0
  const year = date.getFullYear();

  const dayStr = day.toString().padStart(2, "0");
  const monthStr = month.toString().padStart(2, "0");

  return `${dayStr}-${monthStr}-${year}`;
};
