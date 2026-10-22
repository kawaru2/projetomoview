# Processo de engenharia do software

## 1. Base de evidência e escopo

Este documento reconstrói o ciclo de vida do Moview a partir do código
presente, da configuração e do histórico Git. Ele descreve o processo que
pode ser comprovado; não atribui ao projeto cerimônias, aprovações ou
validações sem registro.

### Fatos verificáveis no repositório

| Dado | Evidência observada |
| --- | --- |
| Produto | Aplicação web Moview, catálogo de filmes com autenticação e favoritos. |
| Início do histórico Git | 17/09/2026, commit inicial `1cead85`. |
| Último commit em `HEAD` nesta análise | 15/10/2026, `598b505` (`atualindo o readme`). |
| Tamanho do histórico em `HEAD` | 33 commits. |
| Período coberto pelo histórico | 17/09/2026 a 15/10/2026. |
| Tecnologias | React 19, Vite 8, React Router 7, Supabase JS 2, React Toastify e função Vercel para TMDB; ver `package.json`. |
| Validação executada nesta revisão | `npm run lint` e `npm run build` passaram em 21/10/2026. |
| Testes automatizados | Não há script `test` nem arquivos de teste `*.test.*`/`*.spec.*` localizados. |
| Integração contínua | Não foi localizada configuração CI no repositório rastreado. |
| Provas de deploy e telemetria | Não foram encontradas no repositório; arquivos de deploy/configuração não provam que houve deploy ou medição em produção. |

O histórico Git é evidência de alterações, mas mensagens de commit não
substituem requisitos aprovados, atas, revisões, testes, registros de deploy
ou aceite de usuário.

## 2. Modelo de ciclo de vida que os dados permitem afirmar

A sequência de commits mostra desenvolvimento **incremental e evolutivo**:
foram adicionadas interfaces e páginas, depois integrações externas,
autenticação, favoritos e tratamento de erros. Não há evidências suficientes
para classificar o trabalho como Scrum, Kanban, cascata ou outro processo
formal. Também não há registros de sprints, papéis formais, estimativas,
revisão por pares, aprovação de requisitos ou testes com usuários.

Para organizar o conhecimento de engenharia, esta documentação separa o
ciclo em levantamento de requisitos, análise/projeto, implementação,
verificação e operação/manutenção. As fases abaixo são uma leitura do produto
atual, não uma afirmação de que foram conduzidas formalmente nessa ordem.

## 3. Linha do tempo comprovada pelo Git

| Período | Evidência no histórico | Resultado identificável |
| --- | --- | --- |
| 17-18/09/2026 | `1cead85` (commit inicial), `31f80e9`, `4ac8c98`, `252c577` | Base Vite/React, páginas iniciais, cabeçalho e primeiros elementos da tela de login/toasts. |
| 19-21/09/2026 | `1962410`, `ab20686`, `aeca53c`, `52d2bf1`, `ef5593a` | Páginas adicionais e interface de cadastro, login e recuperação de senha; estes commits registram interface, não comprovam que a autenticação remota já estivesse integrada. |
| 22-26/09/2026 | `eabece5`, `4dcbf45`, `3a18cc8` | Início da página inicial e evolução de modais. |
| 29/09-01/10/2026 | `2ee6750`, `32f35bd`, `c797e80`, `ccd5a43`, `eb20c75`, `48303ca` | Integração de dados de filmes no contexto, página de catálogo, gêneros, classificação indicativa e refatoração de estilos. |
| 02-03/10/2026 | `56300f4`, `8537c8b`, `1a4abbb`, `6d1f496` | Modal compartilhado/biografias e carrossel com controles e transições. |
| 07/10/2026 | `47ba944`, `ff48ad5` | Melhorias de responsividade e migração de consulta TMDB para `/api/tmdb`, com token no ambiente server-side e middleware local. |
| 08-10/10/2026 | `db6fde3`, `ed78d82` | Ajustes na página Sobre e localização da interface em português. |
| 15/10/2026 | `c530120`, `d825dae`, `bcf18e8`, `9ec3c6d`, `598b505` | Integração de Supabase Auth/favoritos, callback, mensagens de erro, notificações, ajustes finais e README. |
| 21/10/2026 | Revisão/documentação desta sessão | Análise de requisitos, cotas gratuitas publicadas e validação local de lint/build; não constitui deploy nem teste de carga. |

Os identificadores de commit são abreviados para consulta no histórico Git
deste repositório. A linha do tempo descreve mudanças registradas, não
necessariamente a data em que a funcionalidade foi concebida ou implantada.

## 4. Levantamento e análise de requisitos

### Evidência disponível

- O README descreve o produto como catálogo de filmes com dados TMDB,
  autenticação Supabase e favoritos privados.
- O código implementa rotas para início, catálogo, sobre, login, callback,
  recuperação de senha e favoritos.
- Necessidades iniciais incluíam apresentação alternativa quando dados faltam,
  diferentes listagens, envio de favoritos e responsividade.
- Requisitos funcionais e não funcionais foram formalizados a partir do
  comportamento atual em [requisitos.md](./requisitos.md).

### O que não está registrado

Não foram encontrados documento original de requisitos, história de usuário,
persona validada, entrevistas, priorização aprovada, critério de aceite
assinado, matriz de risco ou aprovação de stakeholder. Assim, os RF/RNF em
`requisitos.md` são uma **especificação retrospectiva baseada no produto**,
não evidências de uma fase formal de requisitos.

## 5. Projeto e arquitetura

### Decisões observáveis no produto

1. SPA React com React Router, estado compartilhado por React Context.
2. Hospedagem estática e função serverless `/api/tmdb` na Vercel.
3. Handler compartilhado para a função em produção e middleware Vite em
   desenvolvimento.
4. Token TMDB mantido em variável server-side.
5. Cliente Supabase inicializado no navegador com variáveis públicas; Auth e
   favoritos acessados diretamente pelo SDK.
6. Isolamento de favoritos esperado por policies RLS no PostgreSQL.
7. Sinopses e detalhes não são persistidos junto aos favoritos; são
   consultados na TMDB.

Essas decisões e seus trade-offs estão detalhados em
[arquitetura.md](./arquitetura.md).

### Artefatos ausentes

Não foi localizado ADR (registro formal de decisão arquitetural), diagrama de
sequência versionado, modelo entidade-relacionamento versionado, especificação
OpenAPI ou documento de ameaças. A arquitetura nesta pasta é uma descrição
retrospectiva derivada do código.

## 6. Implementação e configuração

### Estrutura e tecnologias efetivas

- `src/pages/`: interfaces de página.
- `src/context/context.jsx`: sessão, favoritos e consultas de catálogo.
- `src/service/supabase.js`: inicialização defensiva do cliente.
- `api/tmdb.js` e `server/tmdb.js`: função e validação da integração TMDB.
- `vite.config.js`: middleware de desenvolvimento para a mesma rota.
- `vercel.json`: rewrites das rotas SPA.
- `package.json`: scripts `dev`, `build`, `lint` e `preview`; não possui
  script de teste.

Existe uma diferença de identificação: o campo `name` do package é
`projetolol`, enquanto README, interface e produto se apresentam como
Moview. A documentação mantém o nome de produto observado e não presume qual
deve ser o nome técnico definitivo do pacote.

## 7. Rastreabilidade requisito -> código -> verificação

Esta matriz relaciona o requisito retrospectivo ao código e ao nível de
verificação realmente disponível. “Inspeção de código” significa que a
implementação foi observada, não que o comportamento foi aprovado em teste
automatizado ou em produção.

| Requisito | Implementação identificada | Evidência de verificação disponível | Situação |
| --- | --- | --- | --- |
| RF-01 Destaques na página inicial | `src/pages/Home.jsx`, `src/context/context.jsx` | Inspeção de código; lint e build passam. | Teste funcional automatizado não localizado. |
| RF-02 Catálogo/tendências | `src/pages/Filmes.jsx`, `src/components/carrossel.jsx`, `src/context/context.jsx` | Inspeção de código; lint e build passam. | Teste funcional automatizado não localizado. |
| RF-03 Detalhes/biografia | `src/components/modalBio.jsx`, `src/pages/Favoritos.jsx`, handler TMDB | Inspeção de código; lint e build passam. | Integração real e estados de falha não exercitados nesta validação. |
| RF-04 Gêneros/avaliações/classificação | `src/utils/obterGeneros.js`, `src/utils/obterClassiIndicativa.js`, contexto | Inspeção de código; lint e build passam. | Teste com dados remotos não registrado. |
| RF-05-RF-07 Cadastro, sessão e recuperação | `src/pages/Login.jsx`, `src/pages/AuthCallback.jsx`, `src/pages/recuperarSenha.jsx`, contexto e cliente Supabase | Inspeção de código; lint e build passam. | Teste com projeto Supabase configurado não registrado. |
| RF-08 Favoritar/desfavoritar | `src/components/FavoriteButton.jsx`, contexto | Inspeção de código; lint e build passam. | Teste de integração de gravação não localizado. |
| RF-09 Isolamento RLS | Configuração necessária documentada na documentação de operação | A documentação explica as policies esperadas; o código não verifica a configuração remota. | Precisa confirmar no projeto Supabase e testar com duas contas. |
| RF-10 Lista de favoritos | `src/pages/Favoritos.jsx`, contexto | Inspeção de código; lint e build passam. | Consulta real/isolamento não testados nesta validação. |
| RF-11 Responsividade/notificações | CSS e `src/mediaQueries.css`; React Toastify | Inspeção de código; lint e build passam. | Sem matriz de dispositivos, teste visual ou auditoria de acessibilidade registrada. |
| RNF-01 Segredos de integração | `api/tmdb.js`, `server/tmdb.js`, `vite.config.js` | Inspeção de variáveis/handler; lint e build passam. | Sem auditoria independente ou verificação de configuração remota. |
| RNF-05/RNF-06 Desempenho/capacidade | Cotas de Vercel/Supabase e fluxo TMDB documentados em `testes-capacidade.md` | Contas aritméticas baseadas em cotas oficiais e bundle local. | Sem benchmark; não demonstra concorrência, latência ou SLA. |

## 8. Verificação, validação e qualidade

### Verificações realmente executadas nesta revisão

| Data | Comando | Resultado |
| --- | --- | --- |
| 21/10/2026 | `npm.cmd run lint` | Sucesso, sem erros reportados. |
| 21/10/2026 | `npm.cmd run build` | Sucesso com Vite 8.3.0. |
| 21/10/2026 | Build de produção | JS principal: 550.19 kB minificado, 159.09 kB gzip; Vite alerta acima de 500 kB minificado. |
| 21/10/2026 | Verificação de links Markdown locais | Todos os links relativos resolvem nos seis documentos de `docs/`. |

As verificações foram executadas localmente no checkout analisado. Build e
lint não testam Auth, RLS, TMDB, navegadores, ambiente Vercel, uso real nem
carga.

### Testes não evidenciados

Não há suíte de unidade, integração, ponta a ponta, visual, acessibilidade,
segurança ou carga rastreada. Também não há evidências de cobertura, execução
de testes por pull request ou aprovação formal. A lista de testes que devem
ser acrescentados está em [testes-capacidade.md](./testes-capacidade.md).

## 9. Implantação, operação e manutenção

O repositório contém configuração para Vercel e informações de configuração
do Supabase, mas não contém logs de deploy, identificador de ambiente,
histórico de release, telemetria, incidentes, alertas, SLO, backup validado
ou ensaio de restauração. Portanto:

- O uso de Vercel Hobby e Supabase Free é uma premissa de análise baseada no
  pedido do responsável, não uma leitura autenticada dos painéis da conta.
- Deploy e variáveis remotas precisam ser confirmados no painel.
- As cotas oficiais são limites de plano; não equivalem a testes de
  capacidade do aplicativo.
- Sem métricas ou testes de carga, não declare usuários simultâneos,
  throughput sustentado, disponibilidade ou elasticidade do Moview.
- Sem backup/restore demonstrado, não afirme objetivo de recuperação nem
  proteção contra perda de dados.

As cotas gratuitas e suas implicações estão em
[testes-capacidade.md](./testes-capacidade.md); instruções operacionais estão
em [implementacao-operacao.md](./implementacao-operacao.md).

## 10. Conclusão do ciclo de vida conhecido

O que os artefatos permitem sustentar: desenvolvimento incremental de uma
SPA React entre 17/09/2026 e 15/10/2026, com integração TMDB, posterior
integração Supabase Auth/favoritos, tratamento de erros e configuração de
deploy. Nesta revisão, lint e build local passaram.

O que permanece desconhecido: requisitos originalmente aprovados, processo
formal adotado, aceite de usuários, resultados funcionais em ambiente
integrado, deploy efetivo, políticas RLS atualmente aplicadas, métricas de
produção, quantidade simultânea suportada, elasticidade, disponibilidade,
backup e recuperabilidade.

Essas lacunas não são preenchidas por suposição. Para converter a descrição
retrospectiva em ciclo de engenharia verificável, registre daqui em diante
decisões, requisitos e critérios de aceite, testes e resultados, releases e
configurações sem credenciais, além de eventos operacionais relevantes.
