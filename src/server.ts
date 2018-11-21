import express from 'express';
import db from './models';

import { IEventInstance } from "./models/event";

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

const port = 4040;
const app = express();

const msInAnHour = 60 * 60 * 1000; // milliseconds in an hour

app.get('/analytics', (req, res) => {
  const { timestamp } = req.query;
  const tsDate = new Date(parseInt(timestamp)).getTime();

  if (isNaN(tsDate)) {
    return res.status(500).json([])
  }

  const hourBeforeTimestamp = new Date(Math.floor(tsDate / msInAnHour ) * msInAnHour).getTime();
  console.log("timetsamp ==", timestamp)
  console.log("ts date ==", tsDate)
  console.log("hours before ts==", hourBeforeTimestamp)

  db.Event.findAll({
      where: {
        timestamp: {
          $gte: hourBeforeTimestamp,
          $lte: hourBeforeTimestamp + msInAnHour
        }
      }
    })
    .then((events: IEventInstance[]) => res.status(200).json({ events }))
    .catch(err => res.status(500).json({ err: ['oops', err] }));
});

app.post('/analytics', (req, res) => {
  const { timestamp, user, event } = req.query;
  const e = db.Event.create({
    timestamp,
    userId: user,
    type: event }).catch(e => console.log(`failed to persiste with error ${e}`))

  res.status(204).send('Event logged.')
});

db.sequelize.sync({ force: true }).then(() => {
  app.listen(port, () => console.log(`Analytics server listening on port ${port}!`));
});
