import Sequelize from 'sequelize';

import { getHourCounts, roundToEarlierHour } from './event';
import { db } from './index';

export interface IEventHourSummaryAttributes {
  hourTimestamp: number;
  numClicks: number;
  numImpressions: number;
  numUniqueUsers: number;
};

export interface IEventHourSummaryInstance extends Sequelize.Instance<IEventHourSummaryAttributes>, IEventHourSummaryAttributes {
};

export const getOrUpdateHourSummary = async (
  ts: number,
  onSuccess: (sum: IEventHourSummaryAttributes) => void,
  onError: (e: string) => void
) => {
  const hourBeforeTimestamp = roundToEarlierHour(ts);
  const hourSummary = await db.EventHourSummary.findOne({
    where: { hourTimestamp: hourBeforeTimestamp }
  });

  hourSummary ? onSuccess(hourSummary) : updateHourSummaryTable(ts, onSuccess, onError);
};

export const updateHourSummaryTable = (
  ts: number,
  onSuccess?: (sum: IEventHourSummaryAttributes) => void,
  onError?: (e: string) => void
) => getHourCounts(
    ts,
    counts => {
      db.EventHourSummary.upsert(counts);
      if (onSuccess) onSuccess(counts);
    },
    e => onError && onError(e)
  );
;

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<IEventHourSummaryInstance, IEventHourSummaryAttributes> => {
  const EventHourSummary = sequelize.define<IEventHourSummaryInstance, IEventHourSummaryAttributes>('EventHourSummary', {
    hourTimestamp: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    numClicks: { type: DataTypes.INTEGER, allowNull: false },
    numImpressions: { type: DataTypes.INTEGER, allowNull: false },
    numUniqueUsers: { type: DataTypes.INTEGER, allowNull: false },
  });

  EventHourSummary.removeAttribute('id');

  return EventHourSummary;
};
