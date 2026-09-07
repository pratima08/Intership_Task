// DAY 4
// Role Based Authorization Middleware

const authorize = (requiredRole) => {

  return (req, res, next) => {

    // Check user is authenticated
    if (!req.user) {

      return res.status(401).json({
        message: "Not authorized"
      });

    }

    // Check user role
    if (req.user.role !== requiredRole) {

      return res.status(403).json({
        message: `${requiredRole} access required`
      });

    }

    // Role matched
    next();
  };
};


module.exports = authorize;