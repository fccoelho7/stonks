const axios = require("axios");

exports.handler = async event => {
  const stocks = event.queryStringParameters.ids.split(",");

  const promises = stocks.map(
    id =>
      new Promise(async resolve => {
        try {
          const { data: response } = await axios.get(
            `http://cotacoes.economia.uol.com.br/ws/asset/${id}/intraday`
          );

          resolve({ id, ...response.data[0] });
        } catch (e) {
          resolve({ id, error: true });
        }
      })
  );

  const results = await Promise.all(promises);

  return { statusCode: 200, body: JSON.stringify(results) };
};
