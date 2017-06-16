module.exports = {
    name: 'rest-api',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    db: {
        uri: 'mongo "mongodb://dev-shard-00-00-cigix.mongodb.net:27017,dev-shard-00-01-cigix.mongodb.net:27017,dev-shard-00-02-cigix.mongodb.net:27017/test?replicaSet=Dev-shard-0" --authenticationDatabase admin --ssl --username adm --password 123'
    }
}