const redisClient = require("./redisClient");


const clearUserPipelineCache = async (userId) => {
  const key = `all_pipelines:${userId}`;
  await redisClient.del(key);
};

module.exports = {
  clearUserPipelineCache,
};