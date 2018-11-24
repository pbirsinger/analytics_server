export default ({
  dbName: 'analytics_dev',
  dbOpts: {
    dialect: 'postgres',
    pool: {
      idle: 10000,
      max: 95,
      min: 0,
    },
  },
  password: 'postgres',
  username: 'postgres',
});
