require("dotenv/config");

const { env } = process;

const config = {
  port: +env.port,
};

module.exports = config;
