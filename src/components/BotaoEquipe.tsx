"use client";

import { useEffect, useRef, useState } from "react";
import { equipe, formatarParticipante } from "@/equipe";

export default function BotaoEquipe() {
  const [aberto, setAberto] = useState(false);
  const botaoFecharRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    botaoFecharRef.current?.focus();
    const aoPressionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", aoPressionar);
    return () => window.removeEventListener("keydown", aoPressionar);
  }, [aberto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Equipe
      </button>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setAberto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-equipe"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="titulo-equipe"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Equipe
            </h2>
            <ul className="mt-4 space-y-2 text-zinc-700 dark:text-zinc-300">
              {equipe.map((p) => (
                <li key={p.nome}>{formatarParticipante(p)}</li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                ref={botaoFecharRef}
                type="button"
                onClick={() => setAberto(false)}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
