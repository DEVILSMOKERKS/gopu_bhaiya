const path = require('path');

module.exports = function override(config, env) {
  // Ignore three-mesh-bvh to avoid compatibility issues
  config.resolve.alias = {
    ...config.resolve.alias,
    'three-mesh-bvh': false,
  };

  // Ignore source map loader for three-mesh-bvh
  config.module.rules.push({
    test: /node_modules\/three-mesh-bvh/,
    use: 'null-loader',
  });

  return config;
};

