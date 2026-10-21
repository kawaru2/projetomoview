# Requisitos e escopo

## 1. Contexto e objetivo

O Moview permite explorar filmes, consultar informacoes e manter uma lista
privada de favoritos. A interface é direcionada a usuarios finais que acessam
o servico por navegador. Este documento formaliza o comportamento observado
no código; nao representa uma especificação contratual aprovada por partes
interessadas.

O problema de usuário, a contribuição diferenciadora do produto, os perfis
prioritários e a validação de valor com usuários ainda precisam ser definidos
com stakeholders. Nao ha registro no repositorio que permita atribuir um
processo formal de desenvolvimento, entrevistas, iteracoes ou priorizacao.

## 2. Atores e sistemas externos

| Ator/sistema | Responsabilidade |
| --- | --- |
| Visitante | Consultar paginas publicas e iniciar cadastro/login. |
| Usuario autenticado | Manter e consultar seus proprios favoritos; gerir a conta. |
| TMDB | Fornecer catalogo, tendencias, generos e detalhes de filmes. |
| Supabase Auth | Cadastrar, autenticar e recuperar contas por e-mail. |
| Supabase PostgreSQL | Persistir favoritos e aplicar autorizacao por linha (RLS). |
| Vercel | Hospedar a SPA e executar a funcao `/api/tmdb`. |

## 3. Requisitos funcionais observados

| ID | Requisito | Criterio de aceitacao observavel |
| --- | --- | --- |
| RF-01 | Exibir pagina inicial com destaques de filmes populares. | A pagina inicial mostra ate tres resultados recebidos da TMDB. |
| RF-02 | Exibir catalogo de filmes e tendencias semanais. | A pagina de filmes apresenta carrossel de tendencias e lista de filmes mais bem avaliados/descobertos. |
| RF-03 | Consultar detalhes/biografia do filme. | A interface exibe os dados disponiveis e trata falhas da consulta. |
| RF-04 | Exibir genero, avaliacao e classificacao quando disponiveis. | Os campos sao apresentados a partir dos dados da TMDB; classificacao etaria consulta lancamentos no Brasil para os destaques carregados. |
| RF-05 | Criar conta por e-mail e senha. | O Supabase Auth recebe os dados e o usuario e informado quando precisa confirmar o e-mail. |
| RF-06 | Autenticar e encerrar sessao. | Login valida credenciais; logout encerra a sessao via Supabase. |
| RF-07 | Recuperar e atualizar senha. | O link direciona para `/recuperarSenha` e a nova senha e enviada ao Supabase Auth. |
| RF-08 | Marcar/desmarcar filmes como favoritos. | A operacao grava ou remove o favorito da conta autenticada e atualiza o estado exibido. |
| RF-09 | Restringir favoritos a cada usuario. | A tabela `public.favorites` aplica RLS comparando `user_id` com `auth.uid()`. |
| RF-10 | Listar favoritos da conta autenticada. | A rota `/favoritos` exige usuario autenticado e carrega somente os registros permitidos pela RLS. |
| RF-11 | Exibir interface adaptavel e notificacoes. | A aplicacao inclui estilos responsivos e mensagens de estado/erro em portugues. |

## 4. Requisitos nao funcionais

Os itens abaixo distinguem o que o codigo implementa do que requer validacao
operacional.

| ID | Requisito | Estado/evidencia |
| --- | --- | --- |
| RNF-01 Seguranca de credenciais | O token TMDB e lido pela funcao server-side em `TMDB_READ_ACCESS_TOKEN`; valores `VITE_*` sao publicos e nao devem conter segredos. | Implementado no desenho e descrito no README. |
| RNF-02 Autorizacao de dados | Favoritos devem ser protegidos no banco por RLS, nao apenas ocultados na interface. | O frontend espera policies `SELECT`, `INSERT` e `DELETE`; a configuracao esta descrita no guia Supabase. A implantacao real das policies deve ser verificada no projeto. |
| RNF-03 Validacao da integracao externa | A rota TMDB permite endpoints e parametros restritos e apenas metodo GET. | Implementado em `server/tmdb.js`; nao equivale a um teste de seguranca independente. |
| RNF-04 Disponibilidade | Erros de integracao e configuracao devem ser comunicados sem sucesso ficticio. | Tratamento parcial no frontend e funcao; disponibilidade/SLO nao foi medido. |
| RNF-05 Desempenho | A aplicacao deve responder dentro de metas acordadas, inclusive sob concorrencia. | Sem metas homologadas, medicao ou teste de carga no repositorio. |
| RNF-06 Escalabilidade | A solucao deve suportar aumento de uso sem degradacao inaceitavel. | A hospedagem usa SPA e funcao serverless; capacidade efetiva e limites nao foram medidos. |
| RNF-07 Compatibilidade | A aplicacao deve funcionar nos navegadores e dispositivos suportados pelo publico-alvo. | O layout e responsivo; matriz de navegadores/dispositivos e testes nao estao documentados. |
| RNF-08 Acessibilidade | Fluxos essenciais devem ser utilizaveis por teclado e tecnologias assistivas. | Nao existe relatorio de auditoria automatizada ou manual no repositorio. |
| RNF-09 Manutenibilidade | Codigo deve ser verificavel por lint e build de producao. | `npm run lint` e `npm run build` passaram nesta revisao; o build emite aviso de chunk principal acima de 500 kB. |
| RNF-10 Privacidade | Dados pessoais devem ser limitados ao necessario e operados conforme politica aplicavel. | E-mail/nome sao tratados pelo Supabase; nao foram encontrados documentos de retencao, consentimento ou politica de privacidade nesta documentacao. |

### Metas de desempenho propostas (ainda nao aprovadas ou medidas)

Para transformar RNF-05 em requisito verificável, produto/equipe deve aprovar
um perfil e metas, por exemplo: definir percentis de latência para p95/p99,
taxa de erro maxima e carga concorrente sustentada durante um periodo. Não
usar valores hipotéticos como resultado do sistema. Os valores devem ser
preenchidos apos estabelecer um ambiente, versoes, regioes e limites dos
provedores e executar o protocolo em
[testes e capacidade](./testes-capacidade.md).

## 5. Regras de negocio e dados

- Um usuário precisa estar autenticado para gerir favoritos.
- A identificacao no banco e o par `(user_id, movie_id)`; o guia Supabase
  recomenda uma restrição única para evitar duplicatas por conta.
- O usuário só pode consultar, inserir ou excluir linhas cujo `user_id`
  corresponde a `auth.uid()` (RLS).
- O banco guarda identificadores, titulo, caminho do poster e data de criacao;
  detalhes mais extensos sao obtidos sob demanda da TMDB.
- Os dados de catalogo apresentados dependem da disponibilidade e conteudo da
  TMDB; o Moview não é a fonte editorial desses dados.

## 6. Fora do escopo observado

Não há evidência no repositório de pesquisa textual de filmes, painel
administrativo, recomendação personalizada, pagamentos, moderação, API
pública para terceiros, suporte offline, notificações push ou gestão de
assinaturas. Nao afirmar essas capacidades em materiais do produto sem
implementa-las e valida-las.

## 7. Pendencias de levantamento

Antes de tratar os requisitos como linha de base formal, confirmar com
stakeholders: perfis de usuário, navegadores suportados, metas de desempenho,
disponibilidade, recuperação de desastre, retenção/exclusão de conta, politica
de privacidade, acessibilidade e requisitos legais. Confirmar também o
problema de usuário que se pretende resolver, a contribuição esperada e o
processo usado para coletar e priorizar requisitos. Registrar responsável,
prioridade, origem, decisão e critério de aceite para cada requisito; ligar
cada critério aos testes correspondentes e manter a rastreabilidade quando
houver alterações.
