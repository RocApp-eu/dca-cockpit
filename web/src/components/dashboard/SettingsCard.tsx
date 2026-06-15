"use client";

import { useEffect, useState } from "react";
import { useUserData } from "@/lib/user-context";
import {
  updateUserSettings,
  DEFAULT_SETTINGS,
  type DcaSettings,
} from "@/lib/user-data";

export function SettingsCard() {
  const { uid, profile } = useUserData();
  const settings = profile?.settings ?? DEFAULT_SETTINGS;

  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<DcaSettings>(settings);

  // Resynchronise le brouillon quand on n'édite pas et que les données changent.
  useEffect(() => {
    if (!editing) setDraft(settings);
  }, [editing, settings]);

  const freqLabel =
    settings.frequency === "monthly" ? "Mensuelle" : "Hebdomadaire";
  const unit = settings.frequency === "monthly" ? "mois" : "sem";

  async function handleSave() {
    if (!uid) return;
    setBusy(true);
    try {
      await updateUserSettings(uid, {
        usualAmount: Number(draft.usualAmount) || 0,
        frequency: draft.frequency,
        allocation: draft.allocation,
        broker: draft.broker,
        multiplierCap: Number(draft.multiplierCap) || 2,
      });
      setEditing(false);
    } catch (err) {
      console.error("updateUserSettings a échoué", err);
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="card">
        <div className="card-head">
          <span className="card-title">Paramètres DCA</span>
          <button
            type="button"
            className="link-soft"
            onClick={() => setEditing(false)}
          >
            Annuler
          </button>
        </div>

        <div className="setting-row">
          <span className="k">Montant habituel (€)</span>
          <input
            className="setting-input"
            type="number"
            min={0}
            value={draft.usualAmount}
            onChange={(e) =>
              setDraft({ ...draft, usualAmount: Number(e.target.value) })
            }
          />
        </div>
        <div className="setting-row">
          <span className="k">Fréquence</span>
          <select
            className="setting-input"
            value={draft.frequency}
            onChange={(e) =>
              setDraft({
                ...draft,
                frequency: e.target.value === "monthly" ? "monthly" : "weekly",
              })
            }
          >
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuelle</option>
          </select>
        </div>
        <div className="setting-row">
          <span className="k">Allocation cible</span>
          <input
            className="setting-input"
            type="text"
            value={draft.allocation}
            onChange={(e) => setDraft({ ...draft, allocation: e.target.value })}
          />
        </div>
        <div className="setting-row">
          <span className="k">Courtier principal</span>
          <input
            className="setting-input"
            type="text"
            value={draft.broker}
            onChange={(e) => setDraft({ ...draft, broker: e.target.value })}
          />
        </div>
        <div className="setting-row">
          <span className="k">Plafond du multiplicateur</span>
          <input
            className="setting-input"
            type="number"
            min={1}
            max={3}
            step={0.1}
            value={draft.multiplierCap}
            onChange={(e) =>
              setDraft({ ...draft, multiplierCap: Number(e.target.value) })
            }
          />
        </div>

        <button
          type="button"
          className="btn"
          style={{ marginTop: 14, width: "100%" }}
          onClick={handleSave}
          disabled={busy || !uid}
        >
          {busy ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    );
  }

  const rows = [
    { k: "Montant habituel", v: `${settings.usualAmount} € / ${unit}` },
    { k: "Fréquence", v: freqLabel },
    { k: "Allocation cible", v: settings.allocation },
    { k: "Courtier principal", v: settings.broker },
    {
      k: "Plafond du multiplicateur",
      v: `${settings.multiplierCap.toFixed(1).replace(".", ",")} ×`,
    },
  ];

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Paramètres DCA</span>
        <button
          type="button"
          className="link-soft"
          onClick={() => setEditing(true)}
          disabled={!uid}
        >
          Modifier →
        </button>
      </div>
      {rows.map((row) => (
        <div className="setting-row" key={row.k}>
          <span className="k">{row.k}</span>
          <span className="v">{row.v}</span>
        </div>
      ))}
    </div>
  );
}
