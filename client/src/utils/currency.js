exports.priceToCurrency = (price) => {
  return Number(price).toLocaleString("en-NZ", {
    style: "currency",
    currency: "NZD",
  });
};
