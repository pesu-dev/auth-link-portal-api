// Authentication middleware to check for "Bearer banana" token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  if (token !== "banana") {
    return res.status(403).json({
      success: false,
      message: "Invalid access token",
    });
  }

  next();
};
