const config = {
  schema: "./utils/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: "ep-wild-wind-a5igb04u.us-east-2.aws.neon.tech",
    database: "Expense-Tracker",
    user: "Expense-Tracker_owner",
    password: "HxaRt1hp0GLg",
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

export default config;
