import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Products() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { role } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/biens");
        setBiens(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Biens visibles</h1>
        <p className="muted">
          Terrains, voitures, machines et autres biens validés par
          l&apos;administrateur.
        </p>
      </div>
      {loading && <p>Chargement...</p>}
      {error && <p className="error-text">{error}</p>}
      <div className="grid">
        {biens.map((bien) => (
          <article key={bien._id} className="card">
            <div className="card-image">
              <img
                src={bien.imageUrl}
                alt={bien.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x240?text=Bien";
                }}
              />
              {bien.status === "sold" && (
                <span className="badge badge-red">Vendu</span>
              )}
            </div>
            <div className="card-body">
              <h2>{bien.name}</h2>
              {/* Visiteur: description courte seulement */}
              <p className="muted">
                {bien.description.length > 80
                  ? bien.description.slice(0, 80) + "..."
                  : bien.description}
              </p>
              {role === "visitor" && (
                <p className="info-text">
                  Connectez-vous pour plus d&apos;informations.
                </p>
              )}
              <p className="muted small">
                Catégorie : <strong>{bien.category}</strong>
              </p>
              {bien.owner && (
                <p className="muted small">
                  Proposé par : {bien.owner.nom || ""} {bien.owner.prenom || ""}
                </p>
              )}
              <p className="muted small">
                Pour plus d&apos;infos, appelez le numéro indiqué sur l&apos;annonce ou
                contactez le responsable.
              </p>
            </div>
          </article>
        ))}
      </div>
      {!loading && biens.length === 0 && (
        <p>Aucun produit pour le moment.</p>
      )}
    </div>
  );
}

