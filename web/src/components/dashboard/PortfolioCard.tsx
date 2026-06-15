"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useUserData } from "@/lib/user-context";
import {
  addHolding,
  updateHolding,
  deleteHolding,
  TYPE_LABEL,
  type Holding,
  type HoldingType,
  type NewHolding,
} from "@/lib/user-data";
import { fmtInt } from "@/lib/dca-math";

type ModalState =
  | { mode: "add" }
  | { mode: "edit"; holding: Holding }
  | null;

const EMPTY: NewHolding = {
  type: "etf",
  name: "",
  code: "",
  isin: "",
  quantity: 0,
  value: 0,
};

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  );
}

function HoldingModal({
  state,
  onClose,
  onSubmit,
}: {
  state: Exclude<ModalState, null>;
  onClose: () => void;
  onSubmit: (h: NewHolding) => Promise<void>;
}) {
  const initial = state.mode === "edit" ? state.holding : EMPTY;
  const [form, setForm] = useState<NewHolding>({
    type: initial.type,
    name: initial.name,
    code: initial.code,
    isin: initial.isin,
    quantity: initial.quantity,
    value: initial.value,
  });
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setBusy(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        code: form.code.trim(),
        isin: form.isin.trim() || "—",
        quantity: Number(form.quantity) || 0,
        value: Number(form.value) || 0,
      });
      onClose();
    } catch (err) {
      console.error("enregistrement support a échoué", err);
      setBusy(false);
    }
  }

  return (
    <div
      className="pf-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="pf-modal" onSubmit={handleSubmit}>
        <h3 className="pf-modal-title">
          {state.mode === "add" ? "Ajouter un support" : "Modifier le support"}
        </h3>

        <label className="pf-field">
          <span>Type</span>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as HoldingType })
            }
          >
            <option value="etf">ETF</option>
            <option value="action">Action</option>
            <option value="crypto">Crypto</option>
          </select>
        </label>
        <label className="pf-field">
          <span>Nom</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="iShares Core MSCI World"
            required
          />
        </label>
        <label className="pf-field">
          <span>Code / description</span>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="SWDA · iShares · Capitalisant"
          />
        </label>
        <label className="pf-field">
          <span>ISIN / identifiant</span>
          <input
            type="text"
            value={form.isin}
            onChange={(e) => setForm({ ...form, isin: e.target.value })}
            placeholder="IE00B4L5Y983"
          />
        </label>
        <div className="pf-field-row">
          <label className="pf-field">
            <span>Quantité</span>
            <input
              type="number"
              step="any"
              min={0}
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />
          </label>
          <label className="pf-field">
            <span>Valeur (€)</span>
            <input
              type="number"
              step="any"
              min={0}
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
            />
          </label>
        </div>

        <div className="pf-modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn-add" disabled={busy}>
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function PortfolioCard() {
  const { uid, holdings } = useUserData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | HoldingType>("all");
  const [modal, setModal] = useState<ModalState>(null);

  const totalValue = useMemo(
    () => holdings.reduce((s, h) => s + h.value, 0),
    [holdings],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return holdings.filter((h) => {
      if (filter !== "all" && h.type !== filter) return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.code.toLowerCase().includes(q) ||
        h.isin.toLowerCase().includes(q)
      );
    });
  }, [holdings, search, filter]);

  async function handleSubmit(data: NewHolding) {
    if (!uid) return;
    if (modal?.mode === "edit") {
      await updateHolding(uid, modal.holding.id, data);
    } else {
      await addHolding(uid, data);
    }
  }

  async function handleDelete(h: Holding) {
    if (!uid) return;
    if (!window.confirm(`Supprimer « ${h.name} » de votre portefeuille ?`)) {
      return;
    }
    try {
      await deleteHolding(uid, h.id);
    } catch (err) {
      console.error("suppression a échoué", err);
    }
  }

  return (
    <div className="portfolio-card">
      <div className="portfolio-head">
        <div>
          <h3>
            Vos lignes, <em>une par une</em>.
          </h3>
          <p>
            Déclarez vos ETF, actions et cryptomonnaies. Recherche par nom,
            ticker ou code ISIN. Les valeurs sont celles que vous saisissez.
          </p>
        </div>
        <div className="portfolio-actions">
          <button
            type="button"
            className="btn-ghost"
            disabled
            title="Import CSV, disponible bientôt"
          >
            Importer CSV
          </button>
          <button
            type="button"
            className="btn-add"
            onClick={() => setModal({ mode: "add" })}
            disabled={!uid}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ajouter un support
          </button>
        </div>
      </div>

      <div className="portfolio-search">
        <div className="input">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un support, nom, ticker ou ISIN"
            className="pf-search-input"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | HoldingType)}
          aria-label="Filtrer par type"
        >
          <option value="all">Tous les types</option>
          <option value="etf">ETF</option>
          <option value="action">Actions</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      {holdings.length === 0 ? (
        <div className="pf-empty">
          <p>Votre portefeuille est vide.</p>
          <button
            type="button"
            className="btn-add"
            onClick={() => setModal({ mode: "add" })}
            disabled={!uid}
          >
            Ajouter votre premier support
          </button>
        </div>
      ) : (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Type</th>
              <th>Support</th>
              <th>Identifiant</th>
              <th className="num">Quantité</th>
              <th className="num">Valeur</th>
              <th className="num" style={{ width: 160 }}>
                Allocation
              </th>
              <th style={{ width: 70 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => {
              const pct = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
              return (
                <tr key={h.id}>
                  <td>
                    <span className={`pf-type ${h.type}`}>
                      {TYPE_LABEL[h.type]}
                    </span>
                  </td>
                  <td>
                    <div className="pf-asset">
                      <span className="name">{h.name}</span>
                      <span className="code">{h.code}</span>
                    </div>
                  </td>
                  <td className="pf-isin">{h.isin}</td>
                  <td className="num">
                    {h.quantity.toLocaleString("fr-FR", {
                      maximumFractionDigits: 4,
                    })}
                  </td>
                  <td className="num">{fmtInt(h.value)} €</td>
                  <td className="num">
                    <span className="pf-bar">
                      <span style={{ width: `${pct}%` }} />
                    </span>
                    <span className="pf-pct">
                      {pct.toLocaleString("fr-FR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}{" "}
                      %
                    </span>
                  </td>
                  <td>
                    <div className="pf-row-actions">
                      <button
                        type="button"
                        className="pf-action-btn"
                        title="Modifier"
                        onClick={() => setModal({ mode: "edit", holding: h })}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className="pf-action-btn"
                        title="Supprimer"
                        onClick={() => handleDelete(h)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="portfolio-foot">
        <span>
          {holdings.length} LIGNE{holdings.length > 1 ? "S" : ""} DÉCLARÉE
          {holdings.length > 1 ? "S" : ""}
        </span>
        <div className="totals">
          <span>
            <span className="k">Valeur totale</span>
            <span className="v">{fmtInt(totalValue)} €</span>
          </span>
        </div>
      </div>

      {modal && (
        <HoldingModal
          state={modal}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
