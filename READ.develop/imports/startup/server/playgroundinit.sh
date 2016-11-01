echo 'export default playground = ' > playgroundinit.js
mongoexport -h localhost:3001 -d readdb -c playground --jsonArray --pretty >> playgroundinit.js
