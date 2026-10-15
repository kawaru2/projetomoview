# Moview

Catálogo de filmes em React com dados da TMDB, autenticação Supabase e lista
privada de favoritos.

## Funcionalidades

- Página inicial com três filmes populares e cartões no layout original.
- Catálogo de filmes com tendências e filmes mais bem avaliados.
- Carrossel interativo: selecionar um filme abre o modal com a biografia.
- Modal de filme com sinopse, gêneros, classificação indicativa e ação para
  adicionar/remover dos favoritos.
- Cadastro, confirmação de e-mail, login, logout e recuperação de senha pelo
  Supabase Auth.
- Lista de favoritos privada por usuário, com sinopse resumida e acesso à
  biografia completa.
- Notificações toast em português e transições suaves entre páginas.
- Layout responsivo e imagem de fundo da página de login otimizada.

## Tecnologias

- React 19 e Vite 8
- React Router 7
- Supabase Auth e PostgreSQL com Row Level Security (RLS)
- API da TMDB acessada por uma função serverless da Vercel
- React Toastify

## Executar localmente

Requisitos: Node.js e npm.

1. Clone e acesse o repositório:

   ```bash
   git clone https://github.com/kawaru2/projetomoview.git
   cd projetomoview
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie `.env.local` na raiz do projeto:

   ```env
   TMDB_READ_ACCESS_TOKEN=seu_token_privado_da_tmdb
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica_publishable
   ```

   `TMDB_READ_ACCESS_TOKEN` é um segredo de servidor: não use o prefixo
   `VITE_`. `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` são valores
   públicos do frontend; a chave deve ser Publishable/anon, nunca `Secret` ou
   `service_role`. `.env.local` é ignorado pelo Git.

4. Prepare Supabase Auth, Redirect URLs e a tabela `public.favorites` com RLS.
   Siga o [guia de uso do Supabase](./GUIA-USO-SUPABASE.md).

5. Inicie a aplicação:

   ```bash
   npm run dev
   ```

   Abra a URL informada pelo Vite, normalmente `http://localhost:5173`.

## Supabase

A tabela `favorites` guarda o ID do usuário, ID/título do filme, pôster e
data de criação. As policies RLS limitam cada usuário aos próprios registros.
O esquema e as instruções para configurar o SQL Editor estão em
[GUIA-USO-SUPABASE.md](./GUIA-USO-SUPABASE.md).

Na confirmação de cadastro, o Supabase retorna para `/auth/callback`; a
recuperação de senha usa `/recuperarSenha`. Adicione esses caminhos às
Redirect URLs do projeto Supabase. O arquivo [vercel.json](./vercel.json)
configura o fallback das rotas da aplicação para a SPA.

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Cadastre `TMDB_READ_ACCESS_TOKEN`, `VITE_SUPABASE_URL` e
   `VITE_SUPABASE_ANON_KEY` nas variáveis de ambiente dos ambientes usados.
3. Configure Site URL e Redirect URLs no Supabase para o domínio publicado.
4. Faça o deploy. Ao alterar variáveis `VITE_*`, gere um novo build/deploy.

A função [`api/tmdb.js`](./api/tmdb.js) usa o token privado para consultar a
TMDB. A lista de endpoints permitidos é implementada em
[`server/tmdb.js`](./server/tmdb.js); os detalhes de cada filme são consultados
sob demanda para exibir sinopses e o modal.

Consulte [GUIA-BACKEND-VERCEL-SUPABASE.md](./GUIA-BACKEND-VERCEL-SUPABASE.md)
para entender como o frontend, Vercel, Supabase e TMDB se comunicam.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor local do Vite. |
| `npm run build` | Gera o build de produção em `dist/`. |
| `npm run preview` | Serve localmente o build de produção. |
| `npm run lint` | Executa o ESLint. |

## Estrutura principal

```text
api/                 Função serverless da TMDB na Vercel
server/              Validação e lógica compartilhada da API TMDB
src/components/      Header, carrossel, modal e botão de favoritos
src/context/         Sessão, dados de filmes e estado dos favoritos
src/pages/           Home, catálogo, favoritos, login e outras páginas
src/service/         Cliente Supabase
src/utils/           Formatação de erros, gêneros e classificação
GUIA-USO-SUPABASE.md Guia de configuração do Supabase
GUIA-BACKEND-VERCEL-SUPABASE.md
                     Arquitetura e operação do backend
```

## Segurança

- Nunca publique `.env.local`, tokens da TMDB, chaves `Secret` ou
  `service_role`.
- As operações de favoritos usam a chave pública do Supabase e dependem das
  policies RLS no banco para isolar os dados dos usuários.
- Não remova nem abra as policies RLS para `anon`.

## Autor

Projeto desenvolvido por João Barros.
