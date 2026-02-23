import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [biens, setBiens] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [papersInput, setPapersInput] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/biens/admin/all", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setBiens(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les biens pour l'admin");
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const setRequiredPapers = async (id) => {
    const list = papersInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    try {
      await api.patch(`/biens/admin/${id}/required-papers`, {
        requiredPapers: list,
      });
      setPapersInput("");
      load();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la définition des pièces demandées");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/biens/admin/${id}/status`, { status });
      load();
    } catch (err) {
      console.error(err);
      setError("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Espace administrateur</h1>
        <p className="muted">
          Étudiez les demandes, demandez les pièces, validez ou refusez les
          biens.
        </p>
      </div>

      <section className="section">
        <label>
          Filtrer par statut
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending_review">En attente d&apos;étude</option>
            <option value="awaiting_documents">En attente de pièces</option>
            <option value="under_review">Pièces en cours d&apos;étude</option>
            <option value="available">Disponibles</option>
            <option value="sold">Vendues</option>
            <option value="rejected">Refusées</option>
            <option value="">Tous</option>
          </select>
        </label>
      </section>

      {error && <p className="error-text">{error}</p>}

      <div className="grid">
        {biens.map((bien) => (
          <article key={bien._id} className="card">
            <div className="card-image">
              <img src={bien.imageUrl} alt={bien.name} />
              <span className="badge">{bien.status}</span>
            </div>
            <div className="card-body">
              <h3>{bien.name}</h3>
              <p className="muted small">
                Catégorie : <strong>{bien.category}</strong>
              </p>
              <p className="muted small">{bien.description}</p>
              {bien.owner && (
                <p className="muted small">
                  Client : {bien.owner.nom || ""} {bien.owner.prenom || ""} (
                  {bien.owner.email})
                </p>
              )}

              <div className="admin-actions">
                <div>
                  <label className="small">
                    Pièces à fournir (séparées par des virgules)
                    <input
                      value={papersInput}
                      onChange={(e) => setPapersInput(e.target.value)}
                      placeholder="Carte d'identité, Justificatif de domicile..."
                    />
                  </label>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setRequiredPapers(bien._id)}
                  >
                    Demander ces pièces
                  </button>
                </div>
                <div className="admin-buttons">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => changeStatus(bien._id, "available")}
                  >
                    Valider (Disponible)
                  </button>
                  <button
                    type="button"
                    className="btn-red"
                    onClick={() => changeStatus(bien._id, "rejected")}
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {biens.length === 0 && <p>Aucun bien pour ce filtre.</p>}
    </div>
  );
}

