"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    // You will add this endpoint later:
    // GET /teams
    apiFetch("/teams")
      .then(setTeams)
      .catch(() => setTeams([]));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Teams</h1>
      {teams.length === 0 && <p>No teams loaded yet.</p>}
      <ul>
        {teams.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> – {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
