const timestampToMySQLDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");

//   console.log(formattedDate);
  return formattedDate;
};

module.exports = timestampToMySQLDate;