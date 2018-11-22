import Sequelize from 'sequelize';

import { IEventAttributes, IEventInstance } from './event';

interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  Event: Sequelize.Model<IEventInstance, IEventAttributes>;
  [index:string]: any;
};

export const sequelize = new Sequelize('analytics_dev', 'postgres', 'postgres', {
  dialect: 'postgres',
});

export const db: DbInterface = {
  Event: sequelize.import('./event'),
  sequelize,
  Sequelize
};