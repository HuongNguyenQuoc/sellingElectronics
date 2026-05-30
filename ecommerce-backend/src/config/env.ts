const ENV = {
  MONGO_URI: process.env.MONGO_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
};

Object.entries(ENV).forEach(([key, value]) => {
  if (!value) throw new Error(`Missing env variable: ${key}`);
})

module.exports = { ENV };