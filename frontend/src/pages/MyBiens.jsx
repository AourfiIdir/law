import { useEffect, useState } from "react";
import api from "../api";

export default function MyBiens() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  const load = async () => {
    try {
      const res = await api.get("/biens/mine");
      setBiens(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos biens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/biens", form);
      setForm({ name: "", description: "", imageUrl: "", category: "" });
      load();
    } catch (err) {
      console.error(err);
      setError("Impossible de créer le bien");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mes biens</h1>
        <p className="muted">
          Suivez le statut de vos biens et envoyez vos documents.
        </p>
      </div>

      <section className="section">
        <h2>Proposer un nouveau bien</h2>
        <form className="grid-form" onSubmit={handleSubmit}>
          <label>
            Nom du produit
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Catégorie
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full">
            URL de l&apos;image
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary full" type="submit">
            Envoyer pour étude
          </button>
        </form>
      </section>

      <section className="section">
        <h2>Suivi de vos biens</h2>
        {loading && <p>Chargement...</p>}
        {!loading && biens.length === 0 && (
          <p>Vous n&apos;avez pas encore proposé de biens.</p>
        )}
        <div className="grid">
          {biens.map((bien) => (
            <article key={bien._id} className="card">
              <div className="card-image">
                <img src={bien.imageUrl} alt={bien.name} />
                <span className="badge">{bien.status}</span>
              </div>
              <div className="card-body">
                <h3>{bien.name}</h3>
                <p className="muted small">Catégorie : {bien.category}</p>
                {bien.requiredPapers?.length > 0 && (
                  <div className="papers">
                    <p className="small">
                      Pièces demandées par l&apos;administrateur :
                    </p>
                    <ul>
                      {bien.requiredPapers.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

