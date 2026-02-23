import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./connectDb.mjs";
import biensRouter from "./routes/biens.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/biens", biensRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});




