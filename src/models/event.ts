import Sequelize from 'sequelize';

import { IEventHourSummaryAttributes } from './event_hour_summary';
import { sequelize } from './index';

const EventTypes = ['click', 'impression'];

export interface IEventAttributes {
  timestamp: number;
  type: string;
  userId: number;
}

export interface IEventInstance extends Sequelize.Instance<IEventAttributes>, IEventAttributes {
}

interface ITypeCountRes {
  type: string;
  count: number;
}

const msInAnHour = 60 * 60 * 1000; // milliseconds in an hour

export const roundToEarlierHour = (ts: number) => new Date(Math.floor(ts / msInAnHour) * msInAnHour).getTime();

export const getHourCounts = (
  timestamp: number,
  onSuccess: (sum: IEventHourSummaryAttributes) => void,
  onError: (error: string) => void,
) => {
  const hourBeforeTimestamp = roundToEarlierHour(timestamp);

  // should replace hour summary with a materialzed view
  // see https://medium.com/jobteaser-dev-team/materialized-views-with-postgresql-for-beginners-9809483db35f
  const whereCond = `WHERE timestamp > ${hourBeforeTimestamp} AND timestamp < ${hourBeforeTimestamp + msInAnHour}`;
  const userCountQuery = `SELECT count(distinct("userId")) FROM "Events" ${whereCond}`;
  const typeCountQuery = `SELECT type, count(*) FROM "Events" ${whereCond} GROUP BY type`;

  // use Promise.all
  sequelize
    .query(userCountQuery, { type: sequelize.QueryTypes.SELECT })
    .then(userCountRes => {
      sequelize.query(typeCountQuery, { type: sequelize.QueryTypes.SELECT })
        .then((typeCountsRes: ITypeCountRes[]) => {
          const clicksRow = typeCountsRes.find(r => r.type === 'click');
          const impressionsRow = typeCountsRes.find(r => r.type === 'impression');

          onSuccess({
            hourTimestamp: hourBeforeTimestamp,
            numClicks: clicksRow ? clicksRow.count : 0,
            numImpressions: impressionsRow ? impressionsRow.count : 0,
            numUniqueUsers: userCountRes[0].count,
          });
        });
    }).catch(onError);
};

export default (sequelizeArg: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes):
  Sequelize.Model<IEventInstance, IEventAttributes> => {
  const Event = sequelizeArg.define<IEventInstance, IEventAttributes>('Event', {
    timestamp: { type: DataTypes.BIGINT, allowNull: false },
    type: {
      allowNull: false,
      type: DataTypes.ENUM,
      validate: { isIn: { args: [EventTypes], msg: 'bad event type' } },
      values: EventTypes,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Event.removeAttribute('id');

  return Event;
};
