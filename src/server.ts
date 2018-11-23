import express from 'express';
import { db, sequelize } from './models';

import { getHourCounts, IEventInstance } from "./models/event";

const app = express();
const port = 4040;

app.get('/analytics', (req, res) => {
  const parsedTimeStamp = parseInt(req.query.timestamp)

  if (isNaN(parsedTimeStamp)) {
    console.log(`parsedTimeStamp ==${parsedTimeStamp}`)
    return res.status(500).json({ err: "bad timestamp"})
  }

  getHourCounts(
    parsedTimeStamp,
    out => res.status(200).json(out),
    err => res.status(500).json({ err })
  )
});

app.post('/analytics', (req, res) => {
  const { timestamp, user, event } = req.query;
  const e = db.Event.create({
    timestamp: timestamp || new Date().getTime(),
    userId: user,
    type: event
  }).catch(e => console.log(`failed to persiste with error ${e}`))

  res.status(204).send('Event logged.');
});

db.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Analytics server listening on port ${port}!`));
});
