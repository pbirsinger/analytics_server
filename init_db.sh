initdb /usr/local/var/postgres
pg_ctl -D /usr/local/var/postgres start

createdb analytics_dev

echo "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres'" | psql analytics_dev

# CREATE INDEX event_ts ON "Events" USING BRIN (timestamp) WITH (pages_per_range = 128);
# DROP INDEX event_ts;
