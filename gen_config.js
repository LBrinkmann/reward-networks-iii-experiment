const fs = require('fs');

const in_dev_branch = (process.env['CI_COMMIT_REF_NAME'] === "dev");

function env(name) {
  var value = process.env[name + (in_dev_branch ? "_DEV" : "")];

  value = value && value.trim();

  if (! value) {
    console.log("Environment variable " + name + " is not specified.");
    process.exit(1);
  }

  return value;
}

const config_js = [
  "const config = {\n",
  "  backend_url: ", JSON.stringify(env('BACKEND_URL')), "\n",
  "};\n",
  "\n",
  "export default config;\n"
].join("");

fs.writeFileSync("src/config.js", config_js, "utf8");
