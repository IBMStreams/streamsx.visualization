echo 'export default playground = ' > playgroundinit.js
mongoexport -h localhost:3001 -d meteor -c playground --jsonArray --pretty >> playgroundinit.js
