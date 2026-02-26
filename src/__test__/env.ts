// Ensure test env vars exist BEFORE app is imported
process.env.NODE_ENV = "test";

// JWT secrets (use whatever your app expects)
process.env.JWT_ACCESS_SECRET ??= "test-access-secret";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret";

// If your app needs these:
process.env.COOKIE_SECRET ??= "test-cookie-secret";