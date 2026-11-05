# PROJETO: App de perguntas ao vivo para evento

Equipe: Veronica Ferreira do Nascimento
Faculdade: IFRO Campus Porto Velho Calama

## Pedido original

Siga o CLAUDE.md e salve este pedido em PROJETO.md.

Crie um app de perguntas ao vivo para um evento. Qualquer pessoa, sem login, envia uma pergunta (até 200 caracteres) e vota nas perguntas dos outros. A lista fica ordenada por votos e atualiza sozinha para todo mundo com o Supabase Realtime. Crie as tabelas questions e votes no Supabase e mostre o SQL antes de aplicar. Cada navegador só pode votar uma vez por pergunta (guarde um id anônimo no localStorage).

Em todas as páginas, coloque um botão fixo "Equipe" no canto inferior direito que abre um modal com os participantes no formato Nome (Faculdade). Use os nomes da linha Equipe acima e guarde a lista em src/equipe.ts.

Stack: Next.js (App Router) com TypeScript e Tailwind, banco no Supabase e deploy na Vercel. Antes de enviar, rode npm run build e corrija os erros. Chaves do Supabase só em variáveis de ambiente.

## Requisitos

- Sem login: qualquer pessoa envia pergunta (máximo 200 caracteres) e vota.
- Lista ordenada por votos (maior primeiro), atualizada em tempo real para todos (Supabase Realtime).
- Tabelas questions e votes no Supabase; o SQL é mostrado antes de ser aplicado.
- Um voto por navegador em cada pergunta, usando um id anônimo salvo no localStorage.
- Botão fixo "Equipe" no canto inferior direito de todas as páginas, abrindo modal com participantes no formato Nome (Faculdade).
- Lista da equipe em src/equipe.ts.
- Stack: Next.js (App Router), TypeScript, Tailwind, Supabase, Vercel.
- Rodar npm run build e corrigir erros antes de entregar.
- Chaves do Supabase somente em variáveis de ambiente.

## Pronto quando

Conferir item por item no link da Vercel.

- [ ] Qualquer pessoa, sem login, envia uma pergunta de até 200 caracteres
- [ ] Perguntas vazias ou com mais de 200 caracteres não são aceitas
- [ ] Qualquer pessoa vota nas perguntas dos outros
- [ ] Um mesmo navegador só vota uma vez por pergunta (id anônimo no localStorage)
- [ ] A lista fica ordenada por votos (maior primeiro)
- [ ] Em dois navegadores abertos, uma pergunta ou voto novo aparece no outro sem recarregar a página
- [ ] Tabelas questions e votes criadas no Supabase com RLS ligado e políticas explícitas
- [ ] Botão fixo "Equipe" no canto inferior direito de todas as páginas, abrindo modal com Nome (Faculdade)
- [ ] A tela funciona bem no celular
- [ ] npm run build sem erros
- [ ] Chaves do Supabase só em variáveis de ambiente (.env.local e Vercel), nunca no código

## Como rodar

1. O `supabase/schema.sql` já foi aplicado no projeto Supabase `perguntas_ao_vivo`. Para outro projeto Supabase, rode esse arquivo no SQL Editor.
2. Copiar `.env.example` para `.env.local` e preencher `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave anon/publishable; a service role nunca vai para o cliente).
3. `npm install` e `npm run dev`.

## Como funciona

- Cada navegador recebe um id anônimo no localStorage. A tabela `votes` tem restrição única em `(question_id, voter_id)`, então o banco rejeita o segundo voto do mesmo navegador na mesma pergunta.
- Cada voto soma 1 em `questions.votes_count` por trigger, e o Realtime envia a atualização para todos.
- A leitura direta de `votes` é bloqueada; o navegador consulta os próprios votos pela função `meus_votos`.
- O botão "Equipe" fica no layout raiz e lê a lista de `src/equipe.ts`.
- Limite conhecido: sem login, o voto único vale por navegador, não por pessoa (quem apagar o localStorage pode votar de novo).

## Status

- App criado e `npm run build` e `npm run lint` passando.
- SQL de `supabase/schema.sql` confirmado e aplicado no projeto Supabase `perguntas_ao_vivo` (região sa-east-1). Testado no banco: voto soma 1, voto repetido é rejeitado, pergunta com mais de 200 caracteres é rejeitada, `votes` não é legível direto.
- Projeto `perguntas_ao_vivo` criado na Vercel e ligado a este repositório (branch main publica em produção, outras branches geram Preview).
- `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` cadastradas na Vercel (Production e Preview) e em `.env.local`.
- Falta conferir a lista "Pronto quando" no link publicado.
