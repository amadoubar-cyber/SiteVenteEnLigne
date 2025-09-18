module.exports = {
  apps: [{
    name: 'bowoye-api',
    script: './server/index.js',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: 'mongodb://localhost:27017/koula_ecommerce',
      JWT_SECRET: 'your_super_secure_jwt_secret_here_change_in_production',
      JWT_EXPIRE: '30d'
    }
  }]
};
