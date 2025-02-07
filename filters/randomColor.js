module.exports = (str) => {
  const colors = [
    "bg-amber-400",
    "bg-emerald-400",
    "bg-sky-400",
    "bg-pink-400",
    "bg-lime-400",
    "bg-gray-400",
  ];

  //return random color
  return colors[Math.floor(Math.random() * colors.length)];
};
