# Analytics_server

## Setup local postgres
```
brew install postgres
initdb /usr/local/var/postgres
pg_ctl -D /usr/local/var/postgres start
createdb analytics_dev
echo "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres'" | psql analytics_dev
```

## Pull in repo and install dependencies
```
git clone https://github.com/pbirsinger/analytics_server.git
cd analytics_server
npm install
```

## Run local server
```
npm start
```

## Store events
```
curl -vv -X POST "http://localhost:4040/analytics/?user=5&event=click"
curl -vv -X POST "http://localhost:4040/analytics/?timestamp=234234234&user=7&event=impression"
```

## Get data summary
```
 curl "http://localhost:4040/analytics?timestamp=1543003200000"
```

## Test load
```
ab -p post.json -n 1000 -c 10 "http://127.0.0.1:4040/analytics/?user=1&event=impression"
ab -n 1000 -c 10 "http://127.0.0.1:4040/analytics/?timestamp=1543003200000"
```
