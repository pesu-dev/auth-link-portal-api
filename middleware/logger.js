// Request logging middleware with timing
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log the incoming request
  console.log(`[${timestamp}] ${req.method} ${req.url} - Started`);

  // Override res.end to capture when the response is sent
  const originalEnd = res.end;
  res.end = function (...args) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const statusCode = res.statusCode;

    // Log the completed request with timing
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${
        req.url
      } - ${statusCode} - ${duration}ms`
    );

    // Call the original end method
    originalEnd.apply(this, args);
  };

  next();
};
