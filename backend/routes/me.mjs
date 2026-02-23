import express from "express";
import firebaseAuth from "../middleware/FirebaseAuth.mjs";

const router = express.Router();

// Return current Mongo user info + role, based on Firebase token
router.get("/", firebaseAuth, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    nom: req.user.nom,
    prenom: req.user.prenom,
  });
});

export default router;

