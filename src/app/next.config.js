const dotEnvResult = require("dotenv").config();
const withSass = require("@zeit/next-sass");
const withTypescript = require("@zeit/next-typescript");

const prod = process.env.NODE_ENV === "production";
const parsedVariables = dotEnvResult.parsed || {};
const dotEnvVariables = {};
// We always want to use the values from process.env, since dotenv
// has already resolved these correctly in case of overrides
for (const key of Object.keys(parsedVariables)) {
  dotEnvVariables[key] = process.env[key];
}
const config = {
  distDir: "../../build/functions/next",
  env: {
    ...dotEnvVariables,
    REACT_APP_CONFIRMATION_EMAIL_REDIRECT: prod
      ? "https://api.example.com"
      : "http://localhost:3000",
  },
};

module.exports = withSass(withTypescript(config));
