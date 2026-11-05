"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabase, supabaseConfigurado } from "@/lib/supabase";
import { getVoterId } from "@/lib/voter";

const LIMITE = 200;
const COLUNAS = "id, text, votes_count, created_at";

type Pergunta = {
  id: string;
  text: string;
  votes_count: number;
  created_at: string;
};

function ordenar(lista: Pergunta[]): Pergunta[] {
  return [...lista].sort((a, b) => {
    if (b.votes_count !== a.votes_count) return b.votes_count - a.votes_count;
    if (a.created_at < b.created_at) return -1;
    if (a.created_at > b.created_at) return 1;
    return 0;
  });
}

export default function PerguntasAoVivo() {
  const configurado = supabaseConfigurado();
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [votados, setVotados] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(configurado);
  const [aoVivo, setAoVivo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    const supabase = getSupabase();
    const [lista, meus] = await Promise.all([
      supabase
        .from("questions")
        .select(COLUNAS)
        .order("votes_count", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(500),
      supabase.rpc("meus_votos", { p_voter_id: getVoterId() }),
    ]);
    if (lista.error) throw lista.error;
    setPerguntas((lista.data ?? []) as Pergunta[]);
    if (!meus.error && meus.data) setVotados(new Set(meus.data as string[]));
  }, []);

  useEffect(() => {
    if (!configurado) return;
    const supabase = getSupabase();
    let ativo = true;

    const canal = supabase
      .channel("perguntas-ao-vivo")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "questions" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const id = (payload.old as { id?: string }).id;
            if (id) setPerguntas((atual) => atual.filter((q) => q.id !== id));
            return;
          }
          const nova = payload.new as Pergunta;
          setPerguntas((atual) =>
            atual.some((q) => q.id === nova.id)
              ? atual.map((q) => (q.id === nova.id ? nova : q))
              : [...atual, nova],
          );
        },
      )
      .subscribe((status) => {
        if (!ativo) return;
        setAoVivo(status === "SUBSCRIBED");
        // Ao conectar (ou reconectar) busca a lista para nao perder nada.
        if (status === "SUBSCRIBED" || status === "CHANNEL_ERROR") {
          carregar()
            .then(() => {
              if (ativo) setErro(null);
            })
            .catch(() => {
              if (ativo) setErro("Não foi possível carregar as perguntas.");
            })
            .finally(() => {
              if (ativo) setCarregando(false);
            });
        }
      });

    return () => {
      ativo = false;
      supabase.removeChannel(canal);
    };
  }, [configurado, carregar]);

  const ordenadas = useMemo(() => ordenar(perguntas), [perguntas]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const limpo = texto.trim();
    if (!limpo || limpo.length > LIMITE || enviando) return;

    setEnviando(true);
    setErro(null);
    const { data, error } = await getSupabase()
      .from("questions")
      .insert({ text: limpo })
      .select(COLUNAS)
      .single();
    setEnviando(false);

    if (error || !data) {
      setErro("Não foi possível enviar a pergunta. Tente novamente.");
      return;
    }
    const nova = data as Pergunta;
    setPerguntas((atual) =>
      atual.some((q) => q.id === nova.id) ? atual : [...atual, nova],
    );
    setTexto("");
  }

  async function votar(id: string) {
    if (votados.has(id)) return;
    setErro(null);
    setVotados((atual) => new Set(atual).add(id));
    setPerguntas((atual) =>
      atual.map((q) =>
        q.id === id ? { ...q, votes_count: q.votes_count + 1 } : q,
      ),
    );

    const { error } = await getSupabase()
      .from("votes")
      .insert({ question_id: id, voter_id: getVoterId() });

    if (error) {
      // 23505: este navegador ja tinha votado nesta pergunta.
      if (error.code !== "23505") {
        setVotados((atual) => {
          const novo = new Set(atual);
          novo.delete(id);
          return novo;
        });
        setErro("Não foi possível registrar o voto. Tente novamente.");
      }
      // Volta a contagem para o valor real do servidor.
      carregar().catch(() => {});
    }
  }

  if (!configurado) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Perguntas ao vivo</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          Configuração pendente: defina NEXT_PUBLIC_SUPABASE_URL e
          NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente (veja
          .env.example).
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-10">
      <header>
        <h1 className="text-2xl font-semibold">Perguntas ao vivo</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Envie sua pergunta e vote nas dos outros. A lista se atualiza sozinha.
          {" "}
          <span aria-live="polite">{aoVivo ? "Ao vivo." : "Conectando..."}</span>
        </p>
      </header>

      <form onSubmit={enviar} className="mt-6">
        <label htmlFor="pergunta" className="sr-only">
          Sua pergunta
        </label>
        <textarea
          id="pergunta"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={LIMITE}
          rows={3}
          placeholder="Escreva sua pergunta (até 200 caracteres)"
          className="w-full resize-none rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus-visible:ring-zinc-100"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            {texto.length}/{LIMITE}
          </span>
          <button
            type="submit"
            disabled={enviando || texto.trim().length === 0}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {enviando ? "Enviando..." : "Enviar pergunta"}
          </button>
        </div>
      </form>

      {erro && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}

      <section className="mt-8" aria-label="Perguntas">
        {carregando ? (
          <p className="text-zinc-500">Carregando perguntas...</p>
        ) : ordenadas.length === 0 ? (
          <p className="text-zinc-500">
            Ainda não há perguntas. Seja a primeira pessoa a perguntar.
          </p>
        ) : (
          <ul className="space-y-3">
            {ordenadas.map((q) => {
              const jaVotou = votados.has(q.id);
              return (
                <li
                  key={q.id}
                  className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <p className="min-w-0 flex-1 break-words text-zinc-900 dark:text-zinc-100">
                    {q.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => votar(q.id)}
                    disabled={jaVotou}
                    aria-label={
                      jaVotou
                        ? `Você já votou. ${q.votes_count} votos`
                        : `Votar nesta pergunta. ${q.votes_count} votos`
                    }
                    className={`flex shrink-0 flex-col items-center rounded-md border px-3 py-1.5 text-sm transition ${
                      jaVotou
                        ? "cursor-default border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-300 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span aria-hidden="true">▲</span>
                    <span className="font-medium tabular-nums">
                      {q.votes_count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
