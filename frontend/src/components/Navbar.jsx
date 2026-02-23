import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Biens.
        </Link>
      </div>
      <nav className="navbar-center">
        <Link to="/">Accueil</Link>
        <Link to="/produits">Produits</Link>
        <Link to="/a-propos">À propos</Link>
        <Link to="/contact">Contact</Link>
        {user && role === "user" && <Link to="/mes-biens">Mes biens</Link>}
        {user && role === "admin" && <Link to="/admin">Admin</Link>}
      </nav>
      <div className="navbar-right">
        <button
          className="btn-ghost burger"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open ? "true" : "false"}
        >
          Menu
        </button>
        {!user && (
          <>
            <Link to="/login" className="btn-ghost">
              Connexion
            </Link>
            <Link to="/signup" className="btn-primary">
              Inscription
            </Link>
          </>
        )}
        {user && (
          <div className="user-chip">
            <span className="user-email">{user.email}</span>
            <span className="user-role">{role}</span>
            <button className="btn-ghost" onClick={logout}>
              Déconnexion
            </button>
          </div>
        )}
      </div>

      {open && (
        <>
          <button className="backdrop" onClick={close} aria-label="Fermer" />
          <div className="mobile-drawer" role="dialog" aria-label="Menu">
            <div className="mobile-drawer-header">
              <span className="logo">Biens.</span>
              <button className="btn-ghost" type="button" onClick={close}>
                Fermer
              </button>
            </div>
            <div className="mobile-links">
              <Link to="/" onClick={close}>
                Accueil
              </Link>
              <Link to="/produits" onClick={close}>
                Produits
              </Link>
              <Link to="/a-propos" onClick={close}>
                À propos
              </Link>
              <Link to="/comment-ca-marche" onClick={close}>
                Comment ça marche
              </Link>
              <Link to="/contact" onClick={close}>
                Contact
              </Link>
              {user && role === "user" && (
                <Link to="/mes-biens" onClick={close}>
                  Mes biens
                </Link>
              )}
              {user && role === "admin" && (
                <Link to="/admin" onClick={close}>
                  Admin
                </Link>
              )}
              {!user && (
                <>
                  <Link to="/login" onClick={close}>
                    Connexion
                  </Link>
                  <Link to="/signup" onClick={close}>
                    Inscription
                  </Link>
                </>
              )}
              {user && (
                <button className="btn-red full" type="button" onClick={logout}>
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

