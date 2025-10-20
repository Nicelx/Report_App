// save as utc time
const timestampToMySQLDate = (timestamp) => {
  if (typeof timestamp == 'string') {
    timestamp = Number(timestamp);
  }
  const date = new Date(timestamp);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

  return formattedDate;
};

module.exports = timestampToMySQLDate;

// 1760907600000