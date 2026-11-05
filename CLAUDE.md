# Projeto da oficina Conexão Tech.RO

## O que é
Um app web pequeno, feito numa oficina de 1h30. A equipe descreve o projeto no primeiro pedido.
Salve essa descrição em `PROJETO.md` e use como referência nas próximas sessões. Atualize o arquivo quando o escopo mudar.

## Primeira sessão
Se ainda não existe app Next.js na raiz, crie com `create-next-app` (TypeScript, Tailwind, App Router) numa pasta temporária e mova os arquivos para a raiz. Não apague `CLAUDE.md`, `AGENTS.md`, `.claude/` nem `.mcp.json`.

## Equipe
Os nomes ficam em `src/equipe.ts` no formato Nome (Faculdade). Todas as páginas têm o botão "Equipe".

## Stack
- Next.js (App Router) com TypeScript e Tailwind
- Supabase (Postgres, Auth, Storage, Realtime) para dados
- Vercel para deploy, publicando a cada push

## Como trabalhar
- Faça uma coisa por vez, a menor que funcione, e mostre o resultado.
- Antes de criar ou alterar tabelas, mostre o SQL e espere a confirmação.
- Toda tabela nova tem RLS ligado e políticas explícitas.
- Rode `npm run build` antes de cada commit e corrija os erros.
- Chaves só em variáveis de ambiente (`.env.local` e Vercel). Nunca no código nem no commit.
- Use a chave pública (anon/publishable) no navegador. A service role nunca vai para o cliente.
- Variáveis do Supabase: pegue a URL e a chave publishable pelo conector do Supabase e crie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel (Production e Preview) pelo conector da Vercel, e também em `.env.local`. Se algum conector não estiver disponível, peça para a equipe colar os valores.
- Telas pensadas primeiro para o celular.
- Textos da interface em português do Brasil.

## Comandos
- `npm run dev`: servidor local
- `npm run build`: checagem de tipos e build (obrigatório antes do commit)
- `npm run lint`: lint

## Pronto quando
Registre em `PROJETO.md` a lista "Pronto quando" do pedido e confira item por item no link da Vercel.
