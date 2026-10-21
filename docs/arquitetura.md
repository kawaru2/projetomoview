# Analise e arquitetura

## 1. Visao geral

Moview e uma aplicacao web de pagina unica (SPA). O navegador executa React,
carrega os recursos estaticos publicados pela Vercel e comunica-se com dois
servicos gerenciados: Supabase e TMDB. A funcao `/api/tmdb` serve de proxy
server-side para chamadas TMDB e mantem o token fora do bundle cliente.

```text
Navegador
  |-- React/Vite SPA ------------------------------> Vercel (arquivos estaticos)
  |-- GET /api/tmdb?endpoint=... -----------------> Vercel Function
  |                                                   |-- token privado
  |                                                   `--> API TMDB
  `-- Supabase JS (sessao, Auth, favoritos) --------> Supabase Auth/PostgreSQL
                                                      `-- RLS na tabela favorites
```

## 2. Componentes e responsabilidades

| Componente | Responsabilidade |
| --- | --- |
| `src/App.jsx` e `src/pages/` | Rotas SPA para inicio, catalogo, sobre, login, callback, recuperacao e favoritos. |
| `src/context/context.jsx` | Estado partilhado de sessao, favoritos e dados de filmes; chamadas de autenticacao e catalogo. |
| `src/service/supabase.js` | Criar cliente Supabase se URL e chave publica estiverem configuradas/validas. |
| `api/tmdb.js` | Adaptar requisicao/resposta HTTP da funcao Vercel ao handler compartilhado. |
| `server/tmdb.js` | Validar metodo, endpoints e parametros; consultar TMDB e definir cache HTTP. |
| `vite.config.js` | Implementar middleware local equivalente para `/api/tmdb` em desenvolvimento. |
| `vercel.json` | Reescrever rotas da SPA para `index.html`. |
| Supabase Auth | Ciclo de cadastro, sessao, confirmacao de e-mail e recuperacao de senha. |
| Supabase PostgreSQL/RLS | Persistencia e isolamento por usuario dos favoritos. |
| TMDB | Catalogo externo, tendencias, generos, detalhes e classificacoes. |

## 3. Fluxos principais

### 3.1 Consulta ao catalogo

1. O provider solicita tendencias (`trending/movie/week`), populares
   (`movie/popular`), generos (`genre/movie/list`) e filmes descobertos
   (`discover/movie`).
2. O navegador chama `/api/tmdb` com `endpoint` e parametros permitidos.
3. A funcao verifica GET, allowlist, formato de idioma, pagina (1 a 500) e
   ordenacao permitida.
4. O servidor consulta `https://api.themoviedb.org/3/...` com a credencial
   privada e retorna status/corpo.
5. As respostas bem sucedidas recebem `Cache-Control:
   public, s-maxage=300, stale-while-revalidate=600`; respostas de erro nao
   sao armazenadas em cache.

As chamadas de detalhes (`movie/{id}`) e datas de lancamento
(`movie/{id}/release_dates`) seguem a mesma funcao. A tela de favoritos
consulta detalhes para exibir sinopses; existe cache em memoria durante a
vida da pagina, e esses detalhes nao sao persistidos na tabela.

### 3.2 Autenticacao

Cadastro/login/recuperacao usam Supabase Auth pelo SDK no navegador. O provider
carrega a sessao inicial e escuta mudancas de autenticacao. Confirmacao de
cadastro retorna para `/auth/callback`; redefinicao de senha utiliza
`/recuperarSenha`. As rotas sao reescritas para a SPA pela configuracao da
Vercel.

### 3.3 Favoritos

1. A interface exige usuario autenticado.
2. O cliente Supabase grava ou exclui em `public.favorites`.
3. A RLS do banco autoriza a operacao usando a identidade da sessao (`auth.uid()`).
4. O provider carrega os favoritos da conta e atualiza o estado local.

O filtro `user_id` no cliente melhora a consulta, mas nao constitui protecao.
O isolamento depende das policies RLS aplicadas no projeto Supabase.

## 4. Modelo de dados

Esquema descrito no guia Supabase (a existencia e o estado do banco remoto
devem ser confirmados no painel):

| Campo | Tipo esperado | Papel |
| --- | --- | --- |
| `id` | `bigint`, identidade, chave primaria | Identificador da linha. |
| `user_id` | `uuid`, referencia a `auth.users(id)` | Proprietario do favorito. |
| `movie_id` | `integer` | Identificador do filme na TMDB. |
| `movie_title` | `text` | Titulo apresentado na lista. |
| `poster_path` | `text`, anulavel | Caminho do poster na TMDB. |
| `created_at` | `timestamptz`, default `now()` | Data/hora de inclusao. |

Restricao recomendada/descrita: `unique (user_id, movie_id)`. Policies:
SELECT/INSERT/DELETE para `authenticated`, validando que a linha pertence a
`auth.uid()`. Sinopse, generos e detalhes sao consultados na TMDB, nao
armazenados como campos do favorito.

## 5. Analise de capacidade e elasticidade

### Premissa de infraestrutura

A analise considera Vercel Hobby e Supabase Free, sem alteracao de plano.
As cotas publicadas e seus efeitos estao detalhados em
[testes-capacidade.md](./testes-capacidade.md). A hospedagem tem limites
mensais de transfer, requisicoes e execucao de funcoes; o banco tem limites de
armazenamento, memoria compartilhada, egress e usuarios ativos mensais.

O software combina recursos que podem escalar de formas diferentes:

- Os arquivos da SPA sao entregues pela plataforma de hospedagem.
- A consulta TMDB passa por funcao serverless; o cache compartilhado da
  plataforma pode reduzir chamadas repetidas para as respostas bem
  sucedidas conforme os cabecalhos indicados. O provider faz inicialmente
  quatro consultas de catalogo e, apos receber os filmes, ate tres consultas
  de classificacao indicativa; cada detalhe de filme adicional pode gerar
  outra chamada.
- Auth e banco sao servicos Supabase; limites dependem do plano, configuracao,
  quotas e carga.
- A API TMDB tambem e uma dependencia sujeita a disponibilidade e limites.
- A lista de favoritos pode disparar chamadas concorrentes de detalhes para
  cada filme carregado; usuarios com muitas linhas podem aumentar a carga e o
  tempo de carregamento.

Logo, “serverless” descreve o modelo de execucao e nao prova capacidade
ilimitada, escalabilidade linear ou uma quantidade fixa de usuarios. O teto de
concorrencia anunciado pela plataforma nao deve ser interpretado como
capacidade de aplicacao: cotas mensais de execucao/transferencia e os limites
do banco e dos provedores externos podem ser alcancados antes.

### Como obter um limite demonstrado

Definir o que significa “simultaneo” (usuarios ativos, requisicoes
concorrentes ou sessoes), um perfil representativo de jornadas e criterios
mensuraveis. Testar em um ambiente de staging equivalente a producao,
registrando versoes, planos, regioes, limites/quota vigentes, cache frio e
quente, duracao, carga aplicada, taxa de erro e percentis de latencia. A
metodologia esta em [testes-capacidade.md](./testes-capacidade.md).

## 6. Decisoes, trade-offs e riscos

| Decisao observada | Beneficio | Trade-off/risco |
| --- | --- | --- |
| Token TMDB mantido em variavel server-side | O segredo nao e enviado pelo bundle cliente. | A funcao e um intermediario publico e precisa de quotas, monitoramento e controle de abuso para evitar consumo indevido. |
| Supabase acessado diretamente pelo navegador | Menos backend proprio e integracao simples. | A seguranca de dados depende de RLS e das grants/policies remotas corretas. |
| Detalhes buscados da TMDB sob demanda | Evita duplicar dados mutaveis no banco. | Dependencia externa aumenta latencia e pode gerar varias requisicoes por tela. |
| SPA e rotas reescritas | Navegacao cliente e hospedagem simples. | Entrada direta em rotas depende de rewrite correto no ambiente publicado. |
| Cache HTTP de 5 minutos e stale de 10 minutos em sucesso | Pode reduzir repeticao e melhorar resposta. | Comportamento e eficacia precisam ser medidos na infraestrutura real; cache nao limita a primeira chamada nem protege rotas de abuso. |

## 7. Evolucoes recomendadas

1. Instrumentar latencia, falhas e volume por dependencia sem registrar
   credenciais ou dados pessoais desnecessarios.
2. Avaliar pagina a pagina dos favoritos, limite de requisicoes concorrentes e
   uso consistente de cache para evitar fan-out com listas extensas.
3. Fazer code splitting para reduzir o bundle inicial, dado o aviso atual de
   chunk acima de 500 kB.
4. Definir limites de uso/abuso, alertas e procedimento de incidente com base
   nos planos reais.
5. Definir estrategia de backup, restauracao e exclusao de dados, incluindo
   usuarios e favoritos.
