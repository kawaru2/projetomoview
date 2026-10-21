# Processo de engenharia do software

## 1. Base de evidencia e escopo

Este documento reconstrui o ciclo de vida do Moview a partir do codigo
presente, da configuracao, do historico Git e das notas locais de
desenvolvimento. Ele descreve o processo que pode ser comprovado; nao atribui
ao projeto cerimônias, aprovacoes ou validacoes sem registro.

### Fatos verificaveis no repositorio

| Dado | Evidencia observada |
| --- | --- |
| Produto | Aplicacao web Moview, catalogo de filmes com autenticacao e favoritos. |
| Inicio do historico Git | 17/09/2026, commit inicial `1cead85`. |
| Ultimo commit em `HEAD` nesta analise | 15/10/2026, `598b505` (`atualindo o readme`). |
| Tamanho do historico em `HEAD` | 33 commits. |
| Periodo coberto pelo historico | 17/09/2026 a 15/10/2026. |
| Tecnologias | React 19, Vite 8, React Router 7, Supabase JS 2, React Toastify e funcao Vercel para TMDB; ver `package.json`. |
| Validacao executada nesta revisao | `npm run lint` e `npm run build` passaram em 21/10/2026. |
| Testes automatizados | Nao ha script `test` nem arquivos de teste `*.test.*`/`*.spec.*` localizados. |
| Integracao continua | Nao foi localizada configuracao CI no repositorio rastreado. |
| Provas de deploy e telemetria | Nao foram encontradas no repositorio; arquivos de deploy/configuracao nao provam que houve deploy ou medicao em producao. |

O historico Git e evidencia de alteracoes, mas mensagens de commit nao
substituem requisitos aprovados, atas, revisoes, testes, registros de deploy
ou aceite de usuario.

## 2. Modelo de ciclo de vida que os dados permitem afirmar

A sequencia de commits mostra desenvolvimento **incremental e evolutivo**:
foram adicionadas interfaces e paginas, depois integracoes externas,
autenticacao, favoritos e tratamento de erros. Nao ha evidencias suficientes
para classificar o trabalho como Scrum, Kanban, cascata ou outro processo
formal. Tambem nao ha registros de sprints, papeis formais, estimativas,
revisao por pares, aprovacao de requisitos ou testes com usuarios.

Para organizar o conhecimento de engenharia, esta documentacao separa o
ciclo em levantamento de requisitos, analise/projeto, implementacao,
verificacao e operacao/manutencao. As fases abaixo sao uma leitura do produto
atual, nao afirmacao de que foram conduzidas formalmente nessa ordem.

## 3. Linha do tempo comprovada pelo Git

| Periodo | Evidencia no historico | Resultado identificavel |
| --- | --- | --- |
| 17-18/09/2026 | `1cead85` (commit inicial), `31f80e9`, `4ac8c98`, `252c577` | Base Vite/React, paginas iniciais, cabecalho e primeiros elementos da tela de login/toasts. |
| 19-21/09/2026 | `1962410`, `ab20686`, `aeca53c`, `52d2bf1`, `ef5593a` | Paginas adicionais e interface de cadastro, login e recuperacao de senha; estes commits registram interface, nao comprovam que autenticacao remota ja estivesse integrada. |
| 22-26/09/2026 | `eabece5`, `4dcbf45`, `3a18cc8` | Inicio da pagina inicial e evolucao de modais. |
| 29/09-01/10/2026 | `2ee6750`, `32f35bd`, `c797e80`, `ccd5a43`, `eb20c75`, `48303ca` | Integracao de dados de filmes no contexto, pagina de catalogo, generos, classificacao indicativa e refatoracao de estilos. |
| 02-03/10/2026 | `56300f4`, `8537c8b`, `1a4abbb`, `6d1f496` | Modal compartilhado/biografias e carrossel com controles e transicoes. |
| 07/10/2026 | `47ba944`, `ff48ad5` | Melhorias de responsividade e migracao de consulta TMDB para `/api/tmdb`, com token no ambiente server-side e middleware local. |
| 08-10/10/2026 | `db6fde3`, `ed78d82` | Ajustes na pagina Sobre e localizacao da interface em portugues. |
| 15/10/2026 | `c530120`, `d825dae`, `bcf18e8`, `9ec3c6d`, `598b505` | Integracao de Supabase Auth/favoritos, callback, mensagens de erro, notificacoes, ajustes finais e README. |
| 21/10/2026 | Revisao/documentacao desta sessao | Analise de requisitos, cotas gratuitas publicadas e validacao local de lint/build; nao constitui deploy nem teste de carga. |

Os identificadores de commit sao abreviados para consulta no historico Git
deste repositorio. A linha do tempo descreve mudancas registradas, nao
necessariamente a data em que a funcionalidade foi concebida ou implantada.

## 4. Levantamento e analise de requisitos

### Evidencia disponivel

- O README descreve o produto como catalogo de filmes com dados TMDB,
  autenticacao Supabase e favoritos privados.
- O codigo implementa rotas para inicio, catalogo, sobre, login, callback,
  recuperacao de senha e favoritos.
- O diario local de desenvolvimento lista necessidades iniciais como
  apresentacao alternativa quando dados faltam, diferentes listagens, envio
  de favoritos e responsividade.
- Requisitos funcionais e nao funcionais foram formalizados a partir do
  comportamento atual em [requisitos.md](./requisitos.md).

### O que nao esta registrado

Nao foram encontrados documento original de requisitos, historia de usuario,
persona validada, entrevistas, priorizacao aprovada, criterio de aceite
assinado, matriz de risco ou aprovacao de stakeholder. Assim, os RF/RNF em
`requisitos.md` sao uma **especificacao retrospectiva baseada no produto**,
nao evidencias de uma fase formal de requisitos.

## 5. Projeto e arquitetura

### Decisoes observaveis no produto

1. SPA React com React Router, estado compartilhado por React Context.
2. Hospedagem estatica e funcao serverless `/api/tmdb` na Vercel.
3. Handler compartilhado para a funcao em producao e middleware Vite em
   desenvolvimento.
4. Token TMDB mantido em variavel server-side.
5. Cliente Supabase inicializado no navegador com variaveis publicas; Auth e
   favoritos acessados diretamente pelo SDK.
6. Isolamento de favoritos esperado por policies RLS no PostgreSQL.
7. Sinopses e detalhes nao sao persistidos junto aos favoritos; sao
   consultados na TMDB.

Essas decisoes e seus trade-offs estao detalhados em
[arquitetura.md](./arquitetura.md).

### Artefatos ausentes

Nao foi localizado ADR (registro formal de decisao arquitetural), diagrama de
sequencia versionado, modelo entidade-relacionamento versionado, especificacao
OpenAPI ou documento de ameacas. A arquitetura nesta pasta e uma descricao
retrospectiva derivada do codigo.

## 6. Implementacao e configuracao

### Estrutura e tecnologias efetivas

- `src/pages/`: interfaces de pagina.
- `src/context/context.jsx`: sessao, favoritos e consultas de catalogo.
- `src/service/supabase.js`: inicializacao defensiva do cliente.
- `api/tmdb.js` e `server/tmdb.js`: funcao e validacao da integracao TMDB.
- `vite.config.js`: middleware de desenvolvimento para a mesma rota.
- `vercel.json`: rewrites das rotas SPA.
- `package.json`: scripts `dev`, `build`, `lint` e `preview`; nao possui
  script de teste.

Existe uma diferenca de identificacao: o campo `name` do package e
`projetolol`, enquanto README, interface e produto se apresentam como
Moview. A documentacao mantem o nome de produto observado e nao presume qual
deve ser o nome tecnico definitivo do pacote.

## 7. Rastreabilidade requisito -> codigo -> verificacao

Esta matriz relaciona o requisito retrospectivo ao codigo e ao nivel de
verificacao realmente disponivel. “Inspecao de codigo” significa que a
implementacao foi observada, nao que o comportamento foi aprovado em teste
automatizado ou em producao.

| Requisito | Implementacao identificada | Evidencia de verificacao disponivel | Situacao |
| --- | --- | --- | --- |
| RF-01 Destaques na pagina inicial | `src/pages/Home.jsx`, `src/context/context.jsx` | Inspecao de codigo; lint e build passam. | Teste funcional automatizado nao localizado. |
| RF-02 Catalogo/tendencias | `src/pages/Filmes.jsx`, `src/components/carrossel.jsx`, `src/context/context.jsx` | Inspecao de codigo; lint e build passam. | Teste funcional automatizado nao localizado. |
| RF-03 Detalhes/biografia | `src/components/modalBio.jsx`, `src/pages/Favoritos.jsx`, handler TMDB | Inspecao de codigo; lint e build passam. | Integracao real e estados de falha nao exercitados nesta validacao. |
| RF-04 Generos/avaliacoes/classificacao | `src/utils/obterGeneros.js`, `src/utils/obterClassiIndicativa.js`, contexto | Inspecao de codigo; lint e build passam. | Teste com dados remotos nao registrado. |
| RF-05-RF-07 Cadastro, sessao e recuperacao | `src/pages/Login.jsx`, `src/pages/AuthCallback.jsx`, `src/pages/recuperarSenha.jsx`, contexto e cliente Supabase | Inspecao de codigo; lint e build passam. | Teste com projeto Supabase configurado nao registrado. |
| RF-08 Favoritar/desfavoritar | `src/components/FavoriteButton.jsx`, contexto | Inspecao de codigo; lint e build passam. | Teste de integracao de gravacao nao localizado. |
| RF-09 Isolamento RLS | Configuracao requerida documentada em `GUIA-USO-SUPABASE.md` | Guia explica policies esperadas; codigo nao verifica a configuracao remota. | Precisa confirmar no projeto Supabase e testar com duas contas. |
| RF-10 Lista de favoritos | `src/pages/Favoritos.jsx`, contexto | Inspecao de codigo; lint e build passam. | Consulta real/isolamento nao testados nesta validacao. |
| RF-11 Responsividade/notificacoes | CSS e `src/mediaQueries.css`; React Toastify | Inspecao de codigo; lint e build passam. | Sem matriz de dispositivos, teste visual ou auditoria de acessibilidade registrada. |
| RNF-01 Segredos de integracao | `api/tmdb.js`, `server/tmdb.js`, `vite.config.js` | Inspecao de variaveis/handler; lint e build passam. | Sem auditoria independente ou verificacao de configuracao remota. |
| RNF-05/RNF-06 Desempenho/capacidade | Cotacoes de Vercel/Supabase e fluxo TMDB documentados em `testes-capacidade.md` | Contas aritmeticas baseadas em cotas oficiais e bundle local. | Sem benchmark; nao demonstra concorrencia, latencia ou SLA. |

## 8. Verificacao, validacao e qualidade

### Verificacoes realmente executadas nesta revisao

| Data | Comando | Resultado |
| --- | --- | --- |
| 21/10/2026 | `npm.cmd run lint` | Sucesso, sem erros reportados. |
| 21/10/2026 | `npm.cmd run build` | Sucesso com Vite 8.3.0. |
| 21/10/2026 | Build de producao | JS principal: 550.19 kB minificado, 159.09 kB gzip; Vite alerta acima de 500 kB minificado. |
| 21/10/2026 | Verificacao de links Markdown locais | Todos os links relativos resolvem nos seis documentos de `docs/`. |

As verificacoes foram executadas localmente no checkout analisado. Build e
lint nao testam Auth, RLS, TMDB, navegadores, ambiente Vercel, uso real nem
carga.

### Testes nao evidenciados

Nao ha suite de unidade, integracao, ponta a ponta, visual, acessibilidade,
seguranca ou carga rastreada. Tambem nao ha evidencias de cobertura, execucao
de testes por pull request ou aprovacao formal. A lista de testes que devem
ser acrescentados esta em [testes-capacidade.md](./testes-capacidade.md).

## 9. Implantacao, operacao e manutencao

O repositorio contem configuracao para Vercel e guias de configuracao
Supabase, mas nao contem logs de deploy, identificador de ambiente,
historico de release, telemetria, incidentes, alertas, SLO, backup validado
ou ensaio de restauracao. Portanto:

- O uso de Vercel Hobby e Supabase Free e uma premissa de analise baseada no
  pedido do responsavel, nao uma leitura autenticada dos paineis da conta.
- Deploy e variaveis remotas precisam ser confirmados no painel.
- As cotas oficiais sao limites de plano; nao equivalem a testes de
  capacidade do aplicativo.
- Sem metricas ou testes de carga, nao declarar usuarios simultaneos,
  throughput sustentado, disponibilidade ou elasticidade do Moview.
- Sem backup/restore demonstrado, nao afirmar objetivo de recuperacao nem
  protecao contra perda de dados.

As cotas gratuitas e suas implicacoes estao em
[testes-capacidade.md](./testes-capacidade.md); instrucoes operacionais estao
em [implementacao-operacao.md](./implementacao-operacao.md).

## 10. Conclusao do ciclo de vida conhecido

O que os artefatos permitem sustentar: desenvolvimento incremental de uma
SPA React entre 17/09/2026 e 15/10/2026, com integracao TMDB, posterior
integracao Supabase Auth/favoritos, tratamento de erros e configuracao de
deploy. Nesta revisao, lint e build local passaram.

O que permanece desconhecido: requisitos originalmente aprovados, processo
formal adotado, aceite de usuarios, resultados funcionais em ambiente
integrado, deploy efetivo, politicas RLS atualmente aplicadas, metricas de
producao, quantidade simultanea suportada, elasticidade, disponibilidade,
backup e recuperabilidade.

Essas lacunas nao sao preenchidas por suposicao. Para converter a descricao
retrospectiva em ciclo de engenharia verificavel, guardar daqui em diante
decisoes, requisitos e criterios de aceite, testes e resultados, releases e
configuracoes sem credenciais, e eventos operacionais relevantes.
