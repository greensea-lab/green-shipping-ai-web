interface EnvironmentConfig {
  env: string;
  apiUrl: string;
  appName: string;
  version: string;
  debug: boolean;
}

const config: EnvironmentConfig = {
  env: process.env.REACT_APP_ENV || 'local',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  appName: process.env.REACT_APP_APP_NAME || 'Green Shipping AI',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  debug: process.env.REACT_APP_DEBUG === 'true',
};

export default config;
