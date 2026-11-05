---
description: Revisa segurança e celular, faz o build, commit e envia para publicar na Vercel.
---

Antes de publicar, revise o diff atual (`git diff`) e corrija o que encontrar:
1. Chaves ou segredos no código ou no commit
2. Tabela nova sem RLS ou sem política
3. Formulário sem validação ou dado do usuário mostrado sem escapar
4. Algo que quebra no celular (largura fixa, texto cortado)
5. Botão "Equipe" faltando em alguma página
6. Use a skill `web-design-guidelines` nas páginas alteradas (acessibilidade e UX) e corrija o que ela apontar

Depois publique:
1. Rode `npm run build` e corrija todos os erros.
2. Confira se cada variável usada no código existe na Vercel (Production e Preview).
3. Faça commit com mensagem curta em português e envie para o GitHub.
4. Se o deploy falhar, leia o log da Vercel, explique a causa em uma frase e corrija.
5. No final, me dê o link e o que testar nele. Lembre que branch gera Preview e só a `main` vai para produção.
