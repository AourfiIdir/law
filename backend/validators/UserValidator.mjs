import * as z from "zod";

const UserSchema = z
  .object({
    nom: z.string().optional(),
    prenom: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    confirm: z.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default UserSchema;

