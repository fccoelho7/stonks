const axios = require("axios");
const stocksData = require("./data.json");

exports.handler = async event => {
  const stocks = event.queryStringParameters.codes.split(",");

  const promises = stocks.map(
    code =>
      new Promise(async resolve => {
        try {
          const { idt } = stocksData.find(stock => stock.code === code);
          const { data: response } = await axios.get(`http://cotacoes.economia.uol.com.br/ws/asset/${idt}/intraday`);

          resolve({ code, ...response.data[0] });
        } catch (e) {
          resolve({ code, error: true });
        }
      })
  );

  const results = await Promise.all(promises);

  let body = {};

  results.forEach(stock => {
    const { high, low, price } = stock;
    body = { ...body, [stock.code]: { high, low, price } };
  });

  return { statusCode: 200, body: JSON.stringify(body) };
};
