const redisClient = require("./redisClient");

const clearUserPipelineCache = async (userId) => {
  const key = `all_pipelines:${userId}`;
  await redisClient.del(key);
};

const clearRecruiterCache = async (adminId) => {
  const key = `recruiters:${adminId}`;
  await redisClient.del(key);
  console.log(`Cleared cache for recruiters:${adminId}`);
};

module.exports = {
  clearUserPipelineCache,
  clearRecruiterCache,
};
