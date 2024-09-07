const CRON_SERVER_API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "http://194.36.87.144/cron-server";

const feedUrl = "https://www.sportstyle.com.tr/google_ads";

const AUTH_HEADER_VALUE = "https://www.sportstyle.com.tr/";

export { CRON_SERVER_API_BASE_URL, AUTH_HEADER_VALUE, feedUrl };
