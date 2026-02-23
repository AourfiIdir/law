import { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged, signOut } from "./firebase";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("visitor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole("visitor");
        localStorage.removeItem("firebase_token");
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();
      localStorage.setItem("firebase_token", token);

      // On pourrait avoir un endpoint /me pour récupérer le rôle depuis Mongo
      try {
        const res = await api.get("/me"); // TODO: créer côté backend si besoin
        setRole(res.data.role || "user");
      } catch {
        setRole("user");
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("firebase_token");
    setUser(null);
    setRole("visitor");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

