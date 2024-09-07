const axios = require('axios');
const xml2js = require('xml2js');

async function fetchXml2JS(url) {
  const response = await axios.get(url);
  const parser = new xml2js.Parser();
  const jsonData = await parser.parseStringPromise(response.data);

  return jsonData;
}

module.exports = { fetchXml2JS };
