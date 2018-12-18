const config = {};

config.redisStore = {
    url: process.env.REDIS_STORE_URI || 'redis://localhost',
    secret: process.env.REDIS_STORE_SECRET || 'my-strong-secret'
};

module.exports = config;