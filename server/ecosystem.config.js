/**
 * PM2 Ecosystem Configuration
 * Use this file to manage your production processes with PM2
 * 
 * Installation: npm install -g pm2
 * Usage: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [{
    name: 'MARO Studio-api',
    script: './server.js',
    instances: 1, // For single instance, use 'max' for cluster mode
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8000,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
  }],
};
