const redisClient = require("./redisClient");

const clearUserPipelineCache = async (userId) => {
  const key = `all_pipelines:${userId}`;
  await redisClient.del(key);
    console.log(`Cleared cache for pipelines:${userId}`);
};

const clearRecruiterCache = async (adminId) => {
  const key = `recruiters:${adminId}`;
  await redisClient.del(key);
  console.log(`Cleared cache for recruiters:${adminId}`);
};

const clearCandidateCache = async (adminId) => {
  const key = `candidates:${adminId}`;
  await redisClient.del(key);
  console.log(`Cleared cache for candidates:${adminId}`);
};


module.exports = {
  clearUserPipelineCache,
  clearRecruiterCache,
  clearCandidateCache
};
