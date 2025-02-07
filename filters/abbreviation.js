module.exports = function (str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
};
