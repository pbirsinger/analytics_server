import Sequelize from 'sequelize';

import config from "../config/config";
import { IEventAttributes, IEventInstance } from './event';

interface DbInterface {
  Event: Sequelize.Model<IEventInstance, IEventAttributes>;
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
};

const { dbName, username, password, dbOpts } = config;
export const sequelize = new Sequelize(dbName, username, password, dbOpts);

export const db: DbInterface = {
  Event: sequelize.import('./event'),
  sequelize,
  Sequelize
};