const dotenv = require("dotenv");
const { parsed } = dotenv.config();

module.exports = function makeConfig() {
  return Object.keys(parsed).reduce((config, key) => {
    config[key] = process.env[key];
    return config;
  }, {});
};
