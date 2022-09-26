import config from "./config.js";

interface LegacyConfig {
  backend_url: string;
}

interface Config {
  backendUrl: string;
}

const convert = ({ backend_url }: LegacyConfig): Config => ({
  backendUrl: backend_url,
});


export default convert(config);
