mongoexport --host localhost --port 3001 --db meteor --collection visualizations --out visualizations.json --jsonArray --pretty
mongoexport --host localhost --port 3001 --db meteor --collection datasets --out datasets.json --jsonArray --pretty
node newdatasets.js > newdatasets.json
mongoimport --host localhost --port 3001 --db meteor --collection datasets --file newdatasets.json --jsonArray --upsert
