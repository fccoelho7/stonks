const axios = require("axios");

const normalizeResponse = ({ o, h, l, c, pc, t }) => ({
  open: o,
  high: h,
  low: l,
  price: c,
  previous_price: pc,
  time: t
});

exports.handler = async event => {
  const symbols = event.queryStringParameters.codes.split(",");

  const promises = symbols.map(
    symbol =>
      new Promise(async resolve => {
        try {
          const { data } = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=bpodruvrh5ra872e4b80`
          );

          resolve({ symbol, ...normalizeResponse(data) });
        } catch (e) {
          resolve({ symbol, error: true });
        }
      })
  );

  const results = await Promise.all(promises);

  let body = {};

  results.forEach(stock => {
    const { price } = stock;
    body = { ...body, [stock.symbol]: { price } };
  });

  return { statusCode: 200, body: JSON.stringify(body) };
};
