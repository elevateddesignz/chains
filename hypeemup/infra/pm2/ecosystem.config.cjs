module.exports = {
  apps: [
    {
      name: 'hypeemup-api',
      script: 'dist/server.js',
      cwd: '/var/www/hypeemup/apps/api',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_restarts: 5,
      restart_delay: 4000,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      out_file: '/var/log/pm2/hypeemup-api.log',
      error_file: '/var/log/pm2/hypeemup-api-error.log',
      combine_logs: true,
    },
  ],
};
