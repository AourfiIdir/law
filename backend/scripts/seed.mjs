import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.mjs";
import Bien from "../models/Bien.mjs";

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  console.error("DB_URL is not set");
  process.exit(1);
}

async function upsertUser({ email, role, nom, prenom }) {
  const existing = await User.findOne({ email });
  if (existing) return existing;
  return await User.create({
    email,
    role,
    nom,
    prenom,
  });
}

async function seed() {
  await mongoose.connect(DB_URL);
  console.log("Connected for seeding");

  const admin = await upsertUser({
    email: "admin@biens.local",
    role: "admin",
    nom: "Admin",
    prenom: "Principal",
  });

  const user = await upsertUser({
    email: "user@biens.local",
    role: "user",
    nom: "Client",
    prenom: "Exemple",
  });

  const existingCount = await Bien.countDocuments();
  if (existingCount > 0) {
    console.log(`Biens already exist (${existingCount}), skipping biens seed.`);
    await mongoose.disconnect();
    return;
  }

  const biens = await Bien.insertMany([
    {
      owner: user._id,
      name: "iPhone 13 - 128Go",
      description:
        "Très bon état. Batterie OK. Vendu avec boîte et câble. Produit validé par l'administrateur.",
      imageUrl:
        "https://images.unsplash.com/photo-1632661674596-618e99f0f23c?auto=format&fit=crop&w=1200&q=80",
      category: "Téléphones",
      requiredPapers: ["Carte d'identité", "Facture d'achat (si disponible)"],
      userPapers: [
        "https://example.com/documents/cni.pdf",
        "https://example.com/documents/facture.pdf",
      ],
      status: "available",
    },
    {
      owner: user._id,
      name: "PlayStation 5",
      description:
        "Console PS5 en excellent état. Quelques jeux inclus. Statut: vendu.",
      imageUrl:
        "https://images.unsplash.com/photo-1606813909355-c9b1b2f90ad2?auto=format&fit=crop&w=1200&q=80",
      category: "Jeux vidéo",
      requiredPapers: ["Carte d'identité"],
      userPapers: ["https://example.com/documents/cni.pdf"],
      status: "sold",
    },
    {
      owner: user._id,
      name: "Ordinateur portable Dell",
      description:
        "Demande déposée par l'utilisateur, en attente d'étude par l'administrateur.",
      imageUrl:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      category: "Informatique",
      status: "pending_review",
    },
  ]);

  console.log(`Seeded users: admin=${admin.email}, user=${user.email}`);
  console.log(`Seeded biens: ${biens.length}`);

  console.log(
    "NOTE: For real Firebase auth, replace these seed users with real accounts (set firebaseUid)."
  );

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

