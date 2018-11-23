import express from 'express';
import { db, sequelize } from './models';

import { getHourCounts, IEventInstance } from "./models/event";

/**

POST /analytics?timestamp={millis_since_epoch}&user={user_id}&event={click|impression}
GET /analytics?timestamp={millis_since_epoch}

When the POST request is made, a 204 is returned to the client with an empty response.
We simply side-effect and track the event in our data store.

When the GET request is made, we return information in the following format to the client,
for the hour (assuming GMT time zone) of the requested timestamp:

unique_users,{number_of_unique_usernames}
clicks,{number_of_clicks}
impressions,{number_of_impressions}

**/

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
