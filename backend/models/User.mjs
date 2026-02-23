import mongoose from "mongoose"
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // allow users without firebaseUid (if you ever need them)
    },
    nom: {
      type: String,
      required: false,
    },
    prenom: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    wilaya: {
      type: String,
      enum: ["Bejaia", "Alger"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

export default mongoose.model("User", UserSchema);

