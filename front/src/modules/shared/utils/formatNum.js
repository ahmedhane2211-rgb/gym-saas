 const formatNum = (num) => {
  if (num === null || num === undefined) return "";
  const formatted = Number(num).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  return formatted;
};

export default formatNum;
