module.exports = {
    name: 'rest-api',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: 10255,
    db: {
        uri: 'mongo "mongodb://tournament-test:oDciE7a3W0kpsqRRnLMc6sJINSC4w6QmP0SiXAfO20hFCWtFxrFpZywL6U9jFrOGDKIkTAiLq6aOYOWm80Yy9Q==@tournament-test.documents.azure.com:10255" --authenticationDatabase admin --ssl --username tournament-test --password oDciE7a3W0kpsqRRnLMc6sJINSC4w6QmP0SiXAfO20hFCWtFxrFpZywL6U9jFrOGDKIkTAiLq6aOYOWm80Yy9Q'
    }
}