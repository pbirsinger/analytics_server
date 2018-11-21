initdb /usr/local/var/postgres
pg_ctl -D /usr/local/var/postgres start

createdb analytics_dev

echo "CREATE USER postgres WITH SUPERUSER PASSWORD 'postgres'" | psql analytics_dev

