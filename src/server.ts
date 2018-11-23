import _ from "lodash"

import express from 'express';
import { db, sequelize } from './models';

import { getHourCounts, IEventInstance, roundToEarlierHour } from "./models/event";
import { getOrUpdateHourSummary, IEventHourSummaryAttributes, updateHourSummaryTable } from "./models/event_hour_summary";

const app = express();
const port = 4040;

const throttledUpdatedHourSummary = _.throttle(updateHourSummaryTable, 1000);

app.get('/analytics', (req, res) => {
  const parsedTimeStamp = parseInt(req.query.timestamp);

  if (isNaN(parsedTimeStamp)) {
    return res.status(500).json({ err: "bad timestamp"});
  }

  const sendSummary = (summaryObj: IEventHourSummaryAttributes) => res.status(200).json({
    unique_users: summaryObj.numUniqueUsers,
    clicks: summaryObj.numClicks,
    impressions: summaryObj.numImpressions,
  });
  const sendError = (error: string) => res.status(500).json({ error });

  getOrUpdateHourSummary(parsedTimeStamp, sendSummary, sendError);
});

app.post('/analytics', (req, res) => {
  res.status(204).send('Event received.');

  const { timestamp, user, event } = req.query;
  const tsToPass = timestamp || new Date().getTime();

  db.Event.create({
    timestamp: tsToPass,
    userId: user,
    type: event
  }).then(() => throttledUpdatedHourSummary(tsToPass))
    .catch((e: string) => console.log(`failed to persiste with error ${e}`))
});

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Analytics server listening on port ${port}!`));
});
