import Sequelize from 'sequelize';

const EventTypes = [ "click", "impression" ]

export interface IEventAttributes {
  timestamp: number;
  type: string;
  userId: number;
};

export interface IEventInstance extends Sequelize.Instance<IEventAttributes>, IEventAttributes {
};

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<IEventInstance, IEventAttributes> => {
  const Event = sequelize.define<IEventInstance, IEventAttributes>('Event', {
    timestamp: { type: DataTypes.INTEGER, allowNull: false },
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

