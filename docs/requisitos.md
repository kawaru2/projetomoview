# Requisitos e escopo

## 1. Contexto e objetivo

O Moview permite explorar filmes, consultar informações e manter uma lista
privada de favoritos. A interface é direcionada a usuários finais que acessam
o serviço por navegador. Este documento formaliza o comportamento observado
no código; não representa uma especificação contratual aprovada por partes
interessadas.

O problema de usuário, a contribuição diferenciadora do produto, os perfis
prioritários e a validação de valor com usuários ainda precisam ser definidos
com stakeholders. Não há registro no repositório que permita atribuir um
processo formal de desenvolvimento, entrevistas, iterações ou priorização.

## 2. Atores e sistemas externos

| Ator/sistema | Responsabilidade |
| --- | --- |
| Visitante | Consultar páginas públicas e iniciar cadastro/login. |
| Usuário autenticado | Manter e consultar seus próprios favoritos; gerir a conta. |
| TMDB | Fornecer catálogo, tendências, gêneros e detalhes de filmes. |
| Supabase Auth | Cadastrar, autenticar e recuperar contas por e-mail. |
| Supabase PostgreSQL | Persistir favoritos e aplicar autorização por linha (RLS). |
| Vercel | Hospedar a SPA e executar a função `/api/tmdb`. |

## 3. Requisitos funcionais observados

| ID | Requisito | Critério de aceitação observável |
| --- | --- | --- |
| RF-01 | Exibir página inicial com destaques de filmes populares. | A página inicial mostra até três resultados recebidos da TMDB. |
| RF-02 | Exibir catálogo de filmes e tendências semanais. | A página de filmes apresenta carrossel de tendências e lista de filmes mais bem avaliados/descobertos. |
| RF-03 | Consultar detalhes/biografia do filme. | A interface exibe os dados disponíveis e trata falhas da consulta. |
| RF-04 | Exibir gênero, avaliação e classificação quando disponíveis. | Os campos são apresentados a partir dos dados da TMDB; a classificação etária consulta lançamentos no Brasil para os destaques carregados. |
| RF-05 | Criar conta por e-mail e senha. | O Supabase Auth recebe os dados e o usuário é informado quando precisa confirmar o e-mail. |
| RF-06 | Autenticar e encerrar sessão. | Login valida credenciais; logout encerra a sessão via Supabase. |
| RF-07 | Recuperar e atualizar senha. | O link direciona para `/recuperarSenha` e a nova senha é enviada ao Supabase Auth. |
| RF-08 | Marcar/desmarcar filmes como favoritos. | A operação grava ou remove o favorito da conta autenticada e atualiza o estado exibido. |
| RF-09 | Restringir favoritos a cada usuário. | A tabela `public.favorites` aplica RLS comparando `user_id` com `auth.uid()`. |
| RF-10 | Listar favoritos da conta autenticada. | A rota `/favoritos` exige usuário autenticado e carrega somente os registros permitidos pela RLS. |
| RF-11 | Exibir interface adaptável e notificações. | A aplicação inclui estilos responsivos e mensagens de estado/erro em português. |

## 4. Requisitos não funcionais

Os itens abaixo distinguem o que o código implementa do que requer validação
operacional.

| ID | Requisito | Estado/evidência |
| --- | --- | --- |
| RNF-01 Segurança de credenciais | O token TMDB é lido pela função server-side em `TMDB_READ_ACCESS_TOKEN`; valores `VITE_*` são públicos e não devem conter segredos. | Implementado no desenho e descrito no README. |
| RNF-02 Autorização de dados | Favoritos devem ser protegidos no banco por RLS, não apenas ocultados na interface. | O frontend espera policies `SELECT`, `INSERT` e `DELETE`; a configuração está descrita na documentação de operação. A implantação real das policies deve ser verificada no projeto. |
| RNF-03 Validação da integração externa | A rota TMDB permite endpoints e parâmetros restritos e apenas método GET. | Implementado em `server/tmdb.js`; não equivale a um teste de segurança independente. |
| RNF-04 Disponibilidade | Erros de integração e configuração devem ser comunicados sem sucesso fictício. | Tratamento parcial no frontend e função; disponibilidade/SLO não foi medida. |
| RNF-05 Desempenho | A aplicação deve responder dentro de metas acordadas, inclusive sob concorrência. | Sem metas homologadas, medição ou teste de carga no repositório. |
| RNF-06 Escalabilidade | A solução deve suportar aumento de uso sem degradação inaceitável. | A hospedagem usa SPA e função serverless; capacidade efetiva e limites não foram medidos. |
| RNF-07 Compatibilidade | A aplicação deve funcionar nos navegadores e dispositivos suportados pelo público-alvo. | O layout é responsivo; matriz de navegadores/dispositivos e testes não estão documentados. |
| RNF-08 Acessibilidade | Fluxos essenciais devem ser utilizáveis por teclado e tecnologias assistivas. | Não existe relatório de auditoria automatizada ou manual no repositório. |
| RNF-09 Manutenibilidade | Código deve ser verificável por lint e build de produção. | `npm run lint` e `npm run build` passaram nesta revisão; o build emite aviso de chunk principal acima de 500 kB. |
| RNF-10 Privacidade | Dados pessoais devem ser limitados ao necessário e operados conforme política aplicável. | E-mail/nome são tratados pelo Supabase; não foram encontrados documentos de retenção, consentimento ou política de privacidade nesta documentação. |

### Metas de desempenho propostas (ainda não aprovadas ou medidas)

Para transformar RNF-05 em requisito verificável, produto/equipe deve aprovar
um perfil e metas, por exemplo: definir percentis de latência para p95/p99,
taxa de erro máxima e carga concorrente sustentada durante um período. Não
usar valores hipotéticos como resultado do sistema. Os valores devem ser
preenchidos após estabelecer um ambiente, versões, regiões e limites dos
provedores e executar o protocolo em
[testes e capacidade](./testes-capacidade.md).

## 5. Regras de negócio e dados

- Um usuário precisa estar autenticado para gerir favoritos.
- A identificação no banco é o par `(user_id, movie_id)`; recomenda-se uma
  restrição única para evitar duplicatas por conta.
- O usuário só pode consultar, inserir ou excluir linhas cujo `user_id`
  corresponde a `auth.uid()` (RLS).
- O banco guarda identificadores, título, caminho do pôster e data de criação;
  detalhes mais extensos são obtidos sob demanda da TMDB.
- Os dados de catálogo apresentados dependem da disponibilidade e do conteúdo da
  TMDB; o Moview não é a fonte editorial desses dados.

## 6. Fora do escopo observado

Não há evidência no repositório de pesquisa textual de filmes, painel
administrativo, recomendação personalizada, pagamentos, moderação, API
pública para terceiros, suporte offline, notificações push ou gestão de
assinaturas. Não afirme essas capacidades em materiais do produto sem
implementá-las e validá-las.

## 7. Pendências de levantamento

Antes de tratar os requisitos como linha de base formal, confirme com
stakeholders: perfis de usuário, navegadores suportados, metas de desempenho,
disponibilidade, recuperação de desastre, retenção/exclusão de conta, política
de privacidade, acessibilidade e requisitos legais. Confirme também o
problema de usuário que se pretende resolver, a contribuição esperada e o
processo usado para coletar e priorizar requisitos. Registre responsável,
prioridade, origem, decisão e critério de aceite para cada requisito; ligar
cada critério aos testes correspondentes e manter a rastreabilidade quando
houver alterações.
