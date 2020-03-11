const axios = require("axios");
const parser = require("xml2json");

axios
  .get(
    "http://bvmf.bmfbovespa.com.br/cotacoes2000/FormConsultaCotacoes.asp?strListaCodigos=BBPO11|PETR4"
  )
  .then(response => console.log(parser.toJson(response.data)));
