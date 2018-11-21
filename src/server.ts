import express from 'express';

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

app.get('/analytics', (req, res) => {
	res.send(`res for ts == ${req.query.timestamp}`)
});

app.post('/analytics', (req, res) => {
	const { ts, user_id, event } = req.query
	console.log(`ts=${ts} user_id=${user_id} event=${event}`)

	res.status(204).send('Hello World!')
});

app.listen(port, () => console.log(`Analytics server listening on port ${port}!`));