import express from "express";
import Bien from "../models/Bien.mjs";
import firebaseAuth from "../middleware/FirebaseAuth.mjs";
import AuthRole from "../middleware/AuthRole.mjs";

const router = express.Router();

// PUBLIC: list all available or sold products for the website
router.get("/", async (req, res) => {
  try {
    const biens = await Bien.find({
      status: { $in: ["available", "sold"] },
    })
      .populate("owner", "nom prenom email")
      .sort({ createdAt: -1 });

    res.json(biens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load products" });
  }
});

// USER: create new product (first step)
router.post("/", firebaseAuth, async (req, res) => {
  try {
    const { name, description, imageUrl, category } = req.body;

    if (!name || !description || !imageUrl || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bien = await Bien.create({
      owner: req.user._id,
      name,
      description,
      imageUrl,
      category,
      status: "pending_review",
    });

    res.status(201).json(bien);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
});

// USER: get own products and their status
router.get("/mine", firebaseAuth, async (req, res) => {
  try {
    const biens = await Bien.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(biens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load your products" });
  }
});

// USER: upload documents (after admin defines requiredPapers)
router.post("/:id/documents", firebaseAuth, async (req, res) => {
  try {
    const { documents } = req.body; // array of URLs
    if (!Array.isArray(documents) || documents.length === 0) {
      return res
        .status(400)
        .json({ message: "documents must be a non-empty array of URLs" });
    }

    const bien = await Bien.findOne({ _id: req.params.id, owner: req.user._id });
    if (!bien) {
      return res.status(404).json({ message: "Product not found" });
    }

    bien.userPapers = documents;
    bien.status = "under_review";
    await bien.save();

    res.json(bien);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload documents" });
  }
});

// ADMIN: list all products (with filters)
router.get(
  "/admin/all",
  firebaseAuth,
  AuthRole(["admin"]),
  async (req, res) => {
    try {
      const { status } = req.query;
      const filter = {};
      if (status) {
        filter.status = status;
      }

      const biens = await Bien.find(filter)
        .populate("owner", "nom prenom email")
        .sort({ createdAt: -1 });

      res.json(biens);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load products for admin" });
    }
  }
);

// ADMIN: set required papers and move to awaiting_documents
router.patch(
  "/admin/:id/required-papers",
  firebaseAuth,
  AuthRole(["admin"]),
  async (req, res) => {
    try {
      const { requiredPapers } = req.body; // array of strings
      if (!Array.isArray(requiredPapers) || requiredPapers.length === 0) {
        return res.status(400).json({
          message: "requiredPapers must be a non-empty array of strings",
        });
      }

      const bien = await Bien.findById(req.params.id);
      if (!bien) {
        return res.status(404).json({ message: "Product not found" });
      }

      bien.requiredPapers = requiredPapers;
      bien.status = "awaiting_documents";
      await bien.save();

      res.json(bien);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to set required papers" });
    }
  }
);

// ADMIN: update status (available, sold, rejected, etc.)
router.patch(
  "/admin/:id/status",
  firebaseAuth,
  AuthRole(["admin"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      const allowed = [
        "pending_review",
        "awaiting_documents",
        "under_review",
        "available",
        "sold",
        "rejected",
      ];

      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const bien = await Bien.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!bien) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(bien);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update status" });
    }
  }
);

// ADMIN: set meetup info (you will also send email from here using any email provider)
router.post(
  "/admin/:id/meetup",
  firebaseAuth,
  AuthRole(["admin"]),
  async (req, res) => {
    try {
      const { date, location, notes } = req.body;

      const bien = await Bien.findById(req.params.id).populate(
        "owner",
        "email nom prenom"
      );
      if (!bien) {
        return res.status(404).json({ message: "Product not found" });
      }

      bien.meetup = { date, location, notes };
      await bien.save();

      // Here you can integrate nodemailer / SendGrid / etc. to send email.
      // For now we just return the data to the frontend.

      res.json(bien);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to set meetup" });
    }
  }
);

export default router;

