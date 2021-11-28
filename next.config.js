const withLinaria = require('next-linaria')

module.exports = withLinaria({
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
});
