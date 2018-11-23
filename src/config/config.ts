export default ({
  dbName: 'analytics_dev',
  username: 'postgres',
  password: 'postgres',
  dbOpts: {
    dialect: 'postgres',
    pool: {
      max: 95,
      min: 0,
      idle: 10000
    },
  }
});