const axios = require("axios");
const parser = require("xml2json");

exports.handler = async function(event, context, callback) {
  const response = await axios.get(
    "http://bvmf.bmfbovespa.com.br/cotacoes2000/FormConsultaCotacoes.asp?strListaCodigos=BBPO11|PETR4"
  );

  callback(null, {
    statusCode: 200,
    body: parser.toJson(response.data)
  });
};
