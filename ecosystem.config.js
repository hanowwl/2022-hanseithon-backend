module.exports = {
  apps: [
    {
      name: 'HANSEITHON_BACKEND_1',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      increment_var: 'PORT',
      env: {
        PORT: 4001,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'HANSEITHON_BACKEND_2',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      increment_var: 'PORT',
      env: {
        PORT: 4002,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'HANSEITHON_BACKEND_3',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      increment_var: 'PORT',
      env: {
        PORT: 4003,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'HANSEITHON_BACKEND_4',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      increment_var: 'PORT',
      env: {
        PORT: 4004,
        NODE_ENV: 'production',
      },
    },
  ],
};
