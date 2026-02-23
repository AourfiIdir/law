import { getFirebaseAuth } from "../firebaseAdmin.mjs";
import User from "../models/User.mjs";

// Middleware that verifies a Firebase ID token and loads/creates a MongoDB user
export default async function firebaseAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "No Firebase token provided" });
    }

    const auth = getFirebaseAuth();
    const decoded = await auth.verifyIdToken(token);

    // Find or create corresponding MongoDB user
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        nom: decoded.name || "",
        prenom: "",
        role: "user",
      });
    }

    req.firebaseUser = decoded;
    req.user = user; // used by existing middleware like AuthRole

    next();
  } catch (err) {
    console.error("Firebase auth error:", err);
    return res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
}

