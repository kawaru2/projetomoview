# Implementacao e operacao

## 1. Stack observada

| Camada | Tecnologia |
| --- | --- |
| Interface | React 19, JavaScript e CSS |
| Build/desenvolvimento | Vite 8, plugin React, compilador React |
| Rotas | React Router 7 |
| Notificacoes | React Toastify |
| Autenticacao e banco | Supabase JS 2, Supabase Auth e PostgreSQL |
| Integracao de filmes | TMDB API v3 por funcao serverless Vercel |
| Qualidade estatica | ESLint |

As versoes declaradas estao no `package.json`; revalidar antes da publicacao,
pois dependencias e plataformas evoluem.

## 2. Configuracao local

Prerequisitos: Node.js compativel com as versoes instaladas e npm.

1. Instale dependencias com `npm install`.
2. Crie `.env.local` na raiz com:

   ```env
   TMDB_READ_ACCESS_TOKEN=token_privado_tmdb
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica
   ```

3. Configure Supabase Auth, URLs de redirecionamento, tabela e RLS conforme
   `GUIA-USO-SUPABASE.md`.
4. Inicie com `npm run dev`. O middleware do Vite encaminha localmente
   `/api/tmdb` ao handler compartilhado.

`TMDB_READ_ACCESS_TOKEN` e segredo server-side e nao deve ter prefixo `VITE_`.
As variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` ficam disponiveis
no cliente. Usar apenas URL e chave publica (Publishable/anon); nunca usar
`Secret`/`service_role` em `VITE_*`. Nunca adicionar `.env.local` ao Git.

## 3. Build e deploy

- `npm run lint`: executa ESLint.
- `npm run build`: gera os arquivos de producao em `dist/`.
- `npm run preview`: serve o build localmente para verificacao.
- Deploy: conectar o repositorio a Vercel, configurar as tres variaveis nos
  ambientes apropriados e publicar.
- Alteracoes em `VITE_*` exigem novo build, pois seus valores sao incorporados
  ao bundle cliente.
- Configurar Site URL e Redirect URLs do Supabase para os dominios usados e
  caminhos `/auth/callback` e `/recuperarSenha`.
- O `vercel.json` reescreve as rotas SPA; validar navegacao direta e refresh
  das rotas depois do deploy.
- Esta documentacao assume Vercel Hobby e Supabase Free. As cotas de
  referencia e as implicacoes operacionais estao em
  [testes-capacidade.md](./testes-capacidade.md); confirmar consumo real nos
  paineis antes de estimar o uso restante.
- A documentacao oficial da Vercel define o Hobby para uso pessoal nao
  comercial. Se a implantacao tiver finalidade comercial, inclusive conforme
  os criterios de uso comercial da Vercel, a premissa de permanecer nesse
  plano precisa ser revista para cumprir os termos vigentes.

## 4. Seguranca e privacidade

- Nao publicar token TMDB, `.env.local`, chaves Supabase secret/service role,
  nem screenshots/logs com credenciais.
- O fato da chave Supabase ser publica nao elimina a necessidade de RLS.
- Confirmar em ambiente real que RLS esta habilitada e que cada policy limita
  a linha a `auth.uid()`. Testar com duas contas distintas.
- O handler TMDB limita os endpoints e parametros aceitos; respostas de erro
  nao recebem cache. O handler registra erros de integracao no log.
- Revisar limites e protecao contra abuso da rota publica `/api/tmdb`.
- Definir politica de privacidade, retencao, exclusao de conta, consentimento
  e processo para incidentes antes de uso com publico.
- Confirmar os termos atuais da TMDB para uso e atribuicao de dados/imagens, e
  as licencas das dependencias distribuidas. Registrar fontes, versoes e data
  da verificacao; nao presumir permissao de republicacao somente porque a API
  esta acessivel.
- Usar dados sinteticos em testes e demonstracoes sempre que possivel. Definir
  base legal, minimizacao, prazo de retencao, fluxo de exclusao e protecao de
  dados pessoais com os responsaveis do projeto.

## 5. Observabilidade e operacao

O codigo consultado nao mostra uma plataforma de metricas/tracing integrada,
nem define SLO, alertas, backup/restore ou runbook operacional. Para producao,
acompanhar pelo menos:

- taxa, latencia e falhas da funcao TMDB, separadas por classe de status;
- cache hit/miss se a plataforma disponibilizar esse dado;
- erros/latencia de autenticacao e operacoes PostgreSQL;
- volume e concorrencia por dependencia e consumo das quotas/plano;
- disponibilidade percebida por verificacao sintética sem credenciais;
- logs com identificadores tecnicos, nunca senhas/tokens ou dados pessoais
  desnecessarios.

Documentar responsaveis, canais de alerta, escalonamento e procedimentos de
degradacao quando TMDB ou Supabase estiver indisponivel. Nao existe evidencia
de que essas operacoes estejam implantadas; verificar com os responsaveis
antes de afirmar disponibilidade operacional.

## 6. Manutencao e riscos conhecidos

- Build local validado nesta revisao; o bundle JavaScript principal ficou em
  550.19 kB minificado (159.09 kB gzip), acima do limite de aviso de 500 kB
  do Vite. Avaliar divisao por rotas/`import()` e medir impacto.
- Enderecos de imagens em algumas paginas usam HTTP, enquanto outras usam
  HTTPS; antes de producao, verificar e padronizar HTTPS para evitar conteudo
  misto em origem HTTPS.
- O comportamento do cache depende da plataforma e das configuracoes efetivas
  do deploy.
- Atualizacoes de framework, SDKs ou provedor devem passar lint, build e
  verificacao funcional; atualmente nao ha suite automatizada de unidade ou
  integracao registrada no package.
- A validade das conclusoes tecnicas fica restrita ao commit, configuracao,
  ambiente, regioes, planos e data verificados. Mudancas nesses fatores podem
  exigir nova validacao; consultar a documentacao oficial vigente dos
  provedores em vez de extrapolar limites ou termos de uma verificacao antiga.

## 7. Referencias internas

- Configuracao detalhada da tabela e autenticacao: `GUIA-USO-SUPABASE.md`.
- Fluxos entre frontend, Vercel, Supabase e TMDB:
  `GUIA-BACKEND-VERCEL-SUPABASE.md`.
- Scripts de projeto e variaveis: `README.md`.
