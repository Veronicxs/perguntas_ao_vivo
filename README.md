# Base da oficina: do prompt ao deploy

Modelo de repositório para os projetos da oficina Conexão Tech.RO.

## O que tem aqui
| Arquivo | Para quê |
|---|---|
| `CLAUDE.md` | Regras do projeto que o Claude lê em toda sessão |
| `AGENTS.md` | Aponta o Codex para as mesmas regras |
| `.claude/skills/` | Skills oficiais e populares, usadas sozinhas quando o assunto aparece: `frontend-design` (Anthropic), `vercel-react-best-practices` e `web-design-guidelines` (Vercel) e `supabase-postgres-best-practices` (Supabase) |
| `.claude/commands/` | `/publicar` |
| `.claude/settings.json` | Libera build e lint e bloqueia a leitura do `.env` |
| `.mcp.json` | Supabase e Vercel para quem usa o Claude Code no terminal |

## Skills de terceiros
Copiadas sem alteração dos repositórios oficiais, com as licenças originais:
- `frontend-design`: [anthropics/skills](https://github.com/anthropics/skills) (Apache 2.0, ver `LICENSE.txt` na pasta)
- `vercel-react-best-practices`: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT)
- `web-design-guidelines`: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT)
- `supabase-postgres-best-practices`: [supabase/agent-skills](https://github.com/supabase/agent-skills) (MIT)

## Como usar
Este é um repositório modelo. Ele começa sem app: na primeira sessão o Claude cria o Next.js na raiz, mantendo estes arquivos.

1. Clique em **Use this template → Create a new repository** e crie o repositório da equipe.
2. Abra **claude.ai/code**, escolha o repositório e ligue os conectores do Supabase e da Vercel. No Codex, conecte o mesmo repositório.
3. Cole o prompt inicial da ideia escolhida, com a linha Equipe preenchida.
4. Ajuste pedindo no chat e, para publicar, use `/publicar`.
