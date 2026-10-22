# Análise e arquitetura

## 1. Visão geral

Moview é uma aplicação web de página única (SPA). O navegador executa React,
carrega os recursos estáticos publicados pela Vercel e comunica-se com dois
serviços gerenciados: Supabase e TMDB. A função `/api/tmdb` serve de proxy
server-side para chamadas TMDB e mantém o token fora do bundle cliente.

```text
Navegador
  |-- React/Vite SPA ------------------------------> Vercel (arquivos estáticos)
  |-- GET /api/tmdb?endpoint=... -----------------> Vercel Function
  |                                                   |-- token privado
  |                                                   `--> API TMDB
  `-- Supabase JS (sessão, Auth, favoritos) --------> Supabase Auth/PostgreSQL
                                                      `-- RLS na tabela favorites
```

## 2. Componentes e responsabilidades

| Componente | Responsabilidade |
| --- | --- |
| `src/App.jsx` e `src/pages/` | Rotas SPA para início, catálogo, sobre, login, callback, recuperação e favoritos. |
| `src/context/context.jsx` | Estado compartilhado de sessão, favoritos e dados de filmes; chamadas de autenticação e catálogo. |
| `src/service/supabase.js` | Criar cliente Supabase se URL e chave pública estiverem configuradas/válidas. |
| `api/tmdb.js` | Adaptar requisição/resposta HTTP da função Vercel ao handler compartilhado. |
| `server/tmdb.js` | Validar método, endpoints e parâmetros; consultar TMDB e definir cache HTTP. |
| `vite.config.js` | Implementar middleware local equivalente para `/api/tmdb` em desenvolvimento. |
| `vercel.json` | Reescrever rotas da SPA para `index.html`. |
| Supabase Auth | Ciclo de cadastro, sessão, confirmação de e-mail e recuperação de senha. |
| Supabase PostgreSQL/RLS | Persistência e isolamento por usuário dos favoritos. |
| TMDB | Catálogo externo, tendências, gêneros, detalhes e classificações. |

## 3. Fluxos principais

### 3.1 Consulta ao catálogo

1. O provider solicita tendências (`trending/movie/week`), populares
   (`movie/popular`), gêneros (`genre/movie/list`) e filmes descobertos
   (`discover/movie`).
2. O navegador chama `/api/tmdb` com `endpoint` e parâmetros permitidos.
3. A função verifica GET, allowlist, formato de idioma, página (1 a 500) e
   ordenação permitida.
4. O servidor consulta `https://api.themoviedb.org/3/...` com a credencial
   privada e retorna status/corpo.
5. As respostas bem-sucedidas recebem `Cache-Control:
   public, s-maxage=300, stale-while-revalidate=600`; respostas de erro não
    são armazenadas em cache.

As chamadas de detalhes (`movie/{id}`) e datas de lançamento
(`movie/{id}/release_dates`) seguem a mesma função. A tela de favoritos
consulta detalhes para exibir sinopses; existe cache em memória durante a
vida da página, e esses detalhes não são persistidos na tabela.

### 3.2 Autenticação

Cadastro/login/recuperação usam Supabase Auth pelo SDK no navegador. O provider
carrega a sessão inicial e escuta mudanças de autenticação. A confirmação de
cadastro retorna para `/auth/callback`; redefinição de senha utiliza
`/recuperarSenha`. As rotas são reescritas para a SPA pela configuração da
Vercel.

### 3.3 Favoritos

1. A interface exige usuário autenticado.
2. O cliente Supabase grava ou exclui em `public.favorites`.
3. A RLS do banco autoriza a operação usando a identidade da sessão (`auth.uid()`).
4. O provider carrega os favoritos da conta e atualiza o estado local.

O filtro `user_id` no cliente melhora a consulta, mas não constitui proteção.
O isolamento depende das policies RLS aplicadas no projeto Supabase.

## 4. Modelo de dados

O esquema esperado (a existência e o estado do banco remoto devem ser
confirmados no painel):

| Campo | Tipo esperado | Papel |
| --- | --- | --- |
| `id` | `bigint`, identidade, chave primária | Identificador da linha. |
| `user_id` | `uuid`, referência a `auth.users(id)` | Proprietário do favorito. |
| `movie_id` | `integer` | Identificador do filme na TMDB. |
| `movie_title` | `text` | Título apresentado na lista. |
| `poster_path` | `text`, anulável | Caminho do pôster na TMDB. |
| `created_at` | `timestamptz`, default `now()` | Data/hora de inclusão. |

Restrição recomendada/descrita: `unique (user_id, movie_id)`. Policies:
SELECT/INSERT/DELETE para `authenticated`, validando que a linha pertence a
`auth.uid()`. Sinopse, gêneros e detalhes são consultados na TMDB, não
armazenados como campos do favorito.

## 5. Análise de capacidade e elasticidade

### Premissa de infraestrutura

A análise considera Vercel Hobby e Supabase Free, sem alteração de plano.
As cotas publicadas e seus efeitos estão detalhados em
[testes-capacidade.md](./testes-capacidade.md). A hospedagem tem limites
mensais de transferência, requisições e execução de funções; o banco tem
limites de armazenamento, memória compartilhada, egress e usuários ativos
mensais.

O software combina recursos que podem escalar de formas diferentes:

- Os arquivos da SPA são entregues pela plataforma de hospedagem.
- A consulta TMDB passa por função serverless; o cache compartilhado da
  plataforma pode reduzir chamadas repetidas para as respostas
  bem-sucedidas conforme os cabeçalhos indicados. O provider faz inicialmente
  quatro consultas de catálogo e, após receber os filmes, até três consultas
  de classificação indicativa; cada detalhe de filme adicional pode gerar
  outra chamada.
- Auth e banco são serviços Supabase; limites dependem do plano, configuração,
  cotas e carga.
- A API TMDB também é uma dependência sujeita a disponibilidade e limites.
- A lista de favoritos pode disparar chamadas concorrentes de detalhes para
  cada filme carregado; usuários com muitas linhas podem aumentar a carga e o
  tempo de carregamento.

Logo, “serverless” descreve o modelo de execução e não prova capacidade
ilimitada, escalabilidade linear ou uma quantidade fixa de usuários. O teto de
concorrência anunciado pela plataforma não deve ser interpretado como
capacidade de aplicação: cotas mensais de execução/transferência e os limites
do banco e dos provedores externos podem ser alcançados antes.

### Como obter um limite demonstrado

Defina o que significa “simultâneo” (usuários ativos, requisições
concorrentes ou sessões), um perfil representativo de jornadas e critérios
mensuráveis. Teste em um ambiente de staging equivalente à produção,
registrando versões, planos, regiões, limites/cotas vigentes, cache frio e
quente, duração, carga aplicada, taxa de erro e percentis de latência. A
metodologia está em [testes-capacidade.md](./testes-capacidade.md).

## 6. Decisões, trade-offs e riscos

| Decisão observada | Benefício | Trade-off/risco |
| --- | --- | --- |
| Token TMDB mantido em variável server-side | O segredo não é enviado pelo bundle cliente. | A função é um intermediário público e precisa de cotas, monitoramento e controle de abuso para evitar consumo indevido. |
| Supabase acessado diretamente pelo navegador | Menos backend próprio e integração simples. | A segurança de dados depende de RLS e das grants/policies remotas corretas. |
| Detalhes buscados da TMDB sob demanda | Evita duplicar dados mutáveis no banco. | Dependência externa aumenta latência e pode gerar várias requisições por tela. |
| SPA e rotas reescritas | Navegação cliente e hospedagem simples. | Entrada direta em rotas depende de rewrite correto no ambiente publicado. |
| Cache HTTP de 5 minutos e stale de 10 minutos em sucesso | Pode reduzir repetição e melhorar resposta. | Comportamento e eficácia precisam ser medidos na infraestrutura real; cache não limita a primeira chamada nem protege rotas de abuso. |

## 7. Evoluções recomendadas

1. Instrumentar latência, falhas e volume por dependência sem registrar
   credenciais ou dados pessoais desnecessários.
2. Avaliar paginação dos favoritos, limite de requisições concorrentes e
   uso consistente de cache para evitar fan-out com listas extensas.
3. Fazer code splitting para reduzir o bundle inicial, dado o aviso atual de
   chunk acima de 500 kB.
4. Definir limites de uso/abuso, alertas e procedimento de incidente com base
   nos planos reais.
5. Definir estratégia de backup, restauração e exclusão de dados, incluindo
   usuários e favoritos.
