const fs = require('fs');

const in_dev_branch = (process.env['CI_COMMIT_REF_NAME'] === "dev");

function env(name) {
  const value = process.env[name + (in_dev_branch ? "_DEV" : "")];

  if (value === undefined)
    return null;
  else
    return value;
}

const config_js = [
  "const config = {\n",
  "  backend_url: ", JSON.stringify(env('BACKEND_URL')), "\n",
  "};\n",
  "\n",
  "export default config;\n"
].join("");

fs.writeFileSync("./src/apis/config.js", config_js, "utf8");
