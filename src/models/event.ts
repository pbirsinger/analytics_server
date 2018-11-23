import Sequelize from 'sequelize';

import { sequelize } from './index';

const EventTypes = [ "click", "impression" ]

export interface IEventAttributes {
  timestamp: number;
  type: string;
  userId: number;
};

export interface IEventInstance extends Sequelize.Instance<IEventAttributes>, IEventAttributes {
};

export interface IEventHourSummary {
  unique_users: number;
  clicks: number;
  impressions: number;
};

interface ITypeCountRes {
  type: string;
  count: number;
}

const msInAnHour = 60 * 60 * 1000; // milliseconds in an hour

export const getHourCounts = (
  timestamp: number,
  onSuccess: (sum: IEventHourSummary) => void,
  onError: (error: string) => void
) => {
  const hourBeforeTimestamp = new Date(Math.floor(timestamp / msInAnHour) * msInAnHour).getTime();

  const whereCond = `WHERE timestamp > ${hourBeforeTimestamp} AND timestamp < ${hourBeforeTimestamp + msInAnHour}`
  const userCountQuery = `SELECT count(distinct("userId")) FROM "Events" ${whereCond}`
  const typeCountQuery = `SELECT type, count(*) FROM "Events" ${whereCond} GROUP BY type`

  console.log(`userCountQuery == ${userCountQuery}`)
  console.log(`typeCountQuery == ${typeCountQuery}`)

  sequelize
    .query(userCountQuery, { type: sequelize.QueryTypes.SELECT })
    .then(userCountRes =>
      sequelize.query(typeCountQuery, { type: sequelize.QueryTypes.SELECT })
        .then((typeCountsRes: ITypeCountRes[]) => {
          const clicksRow = typeCountsRes.find(r => r.type == "click");
          const impressionsRow = typeCountsRes.find(r => r.type == "impression");
          console.log("in typessssssssss")

          onSuccess({
            unique_users: userCountRes[0].count,
            clicks: clicksRow ? clicksRow.count : 0,
            impressions: impressionsRow ? impressionsRow.count : 0
          });
        })
    ).catch(onError)
}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<IEventInstance, IEventAttributes> => {
  const Event = sequelize.define<IEventInstance, IEventAttributes>('Event', {
    timestamp: { type: DataTypes.BIGINT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM,
      values: EventTypes,
      allowNull: false,
      validate: { isIn: { args: [EventTypes], msg: "bad event type" } }
    }
  });

  Event.removeAttribute('id');

  return Event;
};

