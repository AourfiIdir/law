
export default function AuthRole(roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({
        message: "No user role found (are you authenticated?)",
      });
    }
    if (!roles.includes(role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
    next();
  };
}
