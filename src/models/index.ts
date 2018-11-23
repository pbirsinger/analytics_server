import Sequelize from 'sequelize';

import config from "../config/config";
import { IEventAttributes, IEventInstance } from './event';
import { IEventHourSummaryAttributes, IEventHourSummaryInstance } from './event_hour_summary';

interface DbInterface {
  Event: Sequelize.Model<IEventInstance, IEventAttributes>;
  EventHourSummary: Sequelize.Model<IEventHourSummaryInstance, IEventHourSummaryAttributes>;
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
};

const { dbName, username, password, dbOpts } = config;
export const sequelize = new Sequelize(dbName, username, password, dbOpts);

export const db: DbInterface = {
  Event: sequelize.import('./event'),
  EventHourSummary: sequelize.import('./event_hour_summary'),
  sequelize,
  Sequelize
};