# Testes, desempenho e capacidade

## 1. Evidencias de validacao existentes

Na revisao que originou esta documentacao:

| Verificacao | Resultado | Alcance/limitacao |
| --- | --- | --- |
| `npm run lint` | Passou, sem erros reportados. | Analise estatica; nao prova funcionamento em runtime. |
| `npm run build` | Passou; Vite 8.3.0 gerou build de producao. | Build nao valida credenciais nem servicos remotos. |
| Tamanho do bundle | JS principal 550.19 kB minificado e 159.09 kB gzip. | O Vite emitiu aviso por ultrapassar 500 kB minificado. |
| Testes automatizados no repositorio | Nao foram encontrados arquivos `*.test.*`/`*.spec.*` e o `package.json` nao define script de teste. | Validacao automatizada funcional, integracao e carga permanecem pendentes. |
| Teste de capacidade existente | Nao localizado. | Nao ha numero validado de usuarios simultaneos, requisicoes/segundo ou elasticidade. |

O build e lint foram executados localmente em 21/10/2026. Essa evidencia
descreve somente este checkout e ambiente e nao certifica deploy remoto.

## 2. Envelope de recursos nos planos gratuitos

Premissa desta analise: Vercel Hobby e Supabase Free, sem upgrade. A tabela
resume cotas publicadas nos documentos oficiais consultados em 21/10/2026.
Elas podem mudar e o consumo agregado da conta/organizacao/projeto deve ser
confirmado nos respectivos paineis.

### Vercel Hobby

| Recurso | Cota mensal/limite publicado | Consequencia para o Moview |
| --- | ---: | --- |
| CDN requests | 1.000.000 por mes | Cota para requisicoes CDN; o consumo real depende dos recursos solicitados e do cache do navegador. |
| Fast Data Transfer | 100 GB por mes | Limita entrega dos recursos estaticos ao navegador; imagens de poster sao carregadas diretamente da TMDB, nao do bundle Vercel. |
| Fast Origin Transfer | 10 GB por mes | Trafego entre a rede Vercel e recursos de computacao, como Functions; respostas de `/api/tmdb` podem contribuir para esse consumo. |
| Function invocations | 1.000.000 por mes | Chamadas a `/api/tmdb` consomem execucoes quando chegam a funcao; respostas servidas do cache podem evitar execucao. |
| Active CPU | 4 horas por mes | Pode ser o limite antes da contagem de invocacoes, conforme o tempo de CPU de cada requisicao. |
| Provisioned memory | 360 GB-horas por mes | Uso depende da memoria provisionada e do tempo da funcao em execucao. |
| Memoria maxima de uma funcao | 2 GB | Limite por funcao, nao significa que o projeto tenha 2 GB de memoria exclusiva permanente. |
| Duracao maxima da funcao | 300 segundos no Hobby | Uma requisicao lenta a dependencia externa ainda pode falhar ao atingir o limite. |
| Concorrencia automatica | Ate 30.000 execucoes simultaneas; burst inicial de ate 1.000 concorrentes por 10 segundos por regiao | Teto/escala de plataforma, nao garantia de que Moview alcance essa concorrencia dentro das cotas mensais ou com latencia aceitavel. A escala pode levar minutos. |
| Upload estatico por deploy | 100 MB | Limite operacional de deploy; o build atual e inferior a esse teto. |

A Vercel tambem publica 5.000 transformacoes de imagem mensais no Hobby;
Moview recebe posters diretamente da TMDB e nao usa a transformacao de
imagem da Vercel no fluxo observado. O uso real pode mudar com futuras
alteracoes.

No Hobby, nao se deve presumir faturamento automatico de excedentes: a
documentacao informa que, em geral, recursos que excedem as cotas precisam
aguardar a janela de 30 dias para voltar a ser utilizados; algumas cotas
podem ter pausas menores. Planejar alertas e consultar o painel da conta.

#### Estimativas aritmeticas do codigo/build atual

- O carregamento inicial do provider faz quatro chamadas de catalogo e,
  apos receber os resultados, pode fazer ate tres chamadas de classificacao
  indicativa: ate sete requisicoes iniciais a `/api/tmdb`. Abertura de
  biografias e carregamento de sinopses de favoritos podem acrescentar
  requisicoes.
- Dividindo 1.000.000 de invocacoes por sete, obtem-se **aproximadamente
  142.857 carregamentos de catalogo sem cache por mes** como teto aritmetico
  baseado somente na contagem de invocacoes. Isso pressupoe que todas as sete
  chamadas cheguem a funcao, sem repeticoes, detalhes, favoritos, retries ou
  outras rotas. Nao e uma previsao de sessoes suportadas: a funcao tambem tem
  cotas de CPU/memoria, e o cache `s-maxage=300` pode reduzir invocacoes para
  respostas repetidas.
- No build medido, HTML, JS comprimido e CSS comprimido somam cerca de
  168 kB; incluir a imagem de fundo do login eleva o conjunto para cerca de
  421 kB. Dividir 100 GB por esses tamanhos da um teto aritmetico aproximado
  de **594 mil carregamentos sem a imagem** ou **237 mil com a imagem**, por
  mes. Sao cenarios de transferencia fria do bundle, antes de outras
  requisicoes, variacoes de resposta e bytes de protocolo; cache do navegador
  pode reduzir transferencia em visitas repetidas.
- Com quatro requisicoes CDN por primeiro carregamento, 1.000.000 de
  requisicoes corresponderia aritmeticamente a cerca de 250 mil
  carregamentos. Na pratica, HTML/arquivos auxiliares, chamadas de API,
  navegacao, cache do navegador e outros projetos da conta alteram o total.

Essas estimativas sao cenarios simplificados e nao devem ser somadas como se
fossem capacidade simultanea. O primeiro recurso a atingir sua cota varia com
o cache, a distribuicao de trafego, as duracoes e o bundle servido.

### Supabase Free

| Recurso | Cota publicada | Consequencia para o Moview |
| --- | ---: | --- |
| Usuarios ativos mensais (MAU) | 50.000 incluidos | Limite de usuarios ativos medido por mes, nao 50.000 usuarios simultaneos nem promessa de throughput. |
| Tamanho do banco por projeto | 500 MB | Limita o total persistido, incluindo dados e estruturas do banco. O tamanho real de cada favorito, indices e overhead precisa ser medido. |
| Compute do banco | Nano, CPU compartilhada, ate 0,5 GB RAM | Capacidade depende de consultas, concorrencia, cache do banco e carga compartilhada; nao ha conversao direta para usuarios. |
| Egress | 5 GB por mes | Inclui trafego de saida do Supabase, por exemplo respostas de consultas de favoritos. |
| Cached egress | 5 GB por mes | Cota separada indicada no plano; a aplicabilidade depende do tipo de resposta/camada cacheada. |
| File storage | 1 GB | O fluxo observado guarda os caminhos de posters, nao os arquivos de imagem, no Supabase. |
| Pausa por inatividade | Projetos Free podem ser pausados apos uma semana de baixa atividade | Pode exigir reativacao pelo painel e afetar disponibilidade. |
| Backup baixavel do banco | Nao incluido no Free | Definir estrategia de backup/exportacao compativel com as necessidades antes de depender do projeto como unica copia. |
| API requests | Anunciadas como ilimitadas | "Ilimitadas" nao significa compute, egress, conexoes, taxa de Auth ou latencia ilimitados. |
| E-mail Auth no provedor padrao | 2 e-mails por hora por projeto | Se o app usa o provedor de e-mail padrao, confirmacoes e recuperacoes podem ficar limitadas; verificar a configuracao SMTP efetiva. |

As taxas padrao documentadas de Auth tambem incluem limites por IP, como
30 requisicoes de cadastro/login/recuperacao por 5 minutos e 150 requisicoes
ao endpoint de token por 5 minutos. Ha limites por usuario para reenvio de
confirmacao e recuperacao. Consultar a configuracao real do projeto antes de
um ensaio; erros de limite retornam HTTP 429.

### Leitura de capacidade

- Um limite de 50.000 MAU do Supabase descreve inclusao no plano, nao
  concorrencia testada. Nao e valido reportar "50.000 usuarios simultaneos".
- Um maximo de 30.000 concorrencias da Vercel e um limite de plataforma de
  funcoes, nao a concorrencia suportavel pelo banco/TMDB ou pelo conjunto do
  Moview. O burst inicial e o escalonamento gradual tambem afetam picos.
- A cota de 1.000.000 de invocacoes e mensal; ela nao define uma taxa
  instantanea garantida. CPU, memoria provisionada, transferencia, cache,
  limites de Supabase Auth, banco e TMDB podem se esgotar antes.
- O banco e compartilhado e possui apenas ate 0,5 GB de RAM no compute Nano.
  Sem uma carga de referencia e teste, nao e possivel estimar quantas
  operacoes de favoritos por segundo ele sustentara.
- O Moview nao controla os limites da TMDB. Verificar termos, quotas e
  resposta de rate limit vigentes com esse fornecedor antes de aumentar a
  carga.

**Conclusao operacional:** as cotas mensais fornecem um envelope de uso do
plano, mas a concorrencia efetiva do software permanece nao medida. As
estimativas acima dimensionam alguns limites de consumo; nao constituem
garantia de usuarios, sessoes, RPS ou SLA.

## 3. O que ainda nao pode ser afirmado

Sem um ensaio controlado e dados do ambiente implantado, nao declarar:

- quantidade maxima de usuarios simultaneos;
- requisicoes por segundo ou transacoes por segundo sustentaveis;
- tempo de resposta p95/p99 sob carga;
- percentual de disponibilidade ou SLA;
- elasticidade linear/automatica, fator de escala ou tempo de escalonamento;
- capacidade maxima do Supabase, Vercel ou TMDB;
- ausencia de falhas em condicoes de pico.

Esses valores dependem do plano contratado, regioes, configuracao, limites
vigentes, cache, perfil de interacao e servicos externos. O desenho serverless
nao fornece, isoladamente, um limite numerico.

## 4. Protocolo proposto para teste de carga

O protocolo e uma recomendacao de engenharia, nao um resultado ja executado.

### 3.1 Preparacao

1. Usar staging equivalente a producao em versoes, regiao e planos. Nao gerar
   carga contra contas de usuarios reais.
2. Consultar e registrar limites/quota atuais da Vercel, Supabase e TMDB.
   Confirmar autorizacao e limites para teste com os provedores.
3. Criar dados sinteticos e contas controladas. Usar contas separadas para
   verificar isolamento RLS.
4. Definir perfil realista de jornada (home, catalogo, abrir detalhe,
   autenticar e operar favoritos), proporcao por operacao, tempo de pausa e
   cache frio/quente.
5. Definir previamente criterio de sucesso com responsavel de produto e
   operacoes: carga alvo, duracao, p95/p99, taxa de erro, consumo de quota e
   limites de custo. Nao usar valores padrao sem aprovacao.
6. Ativar observabilidade para frontend, funcao, banco, autenticacao e
   dependencias; garantir que tokens e dados pessoais nao sejam registrados.

### 3.2 Execucao

1. Fazer aquecimento controlado, separando resultados de cache frio e quente.
2. Aumentar concorrencia em etapas; manter cada etapa pelo periodo acordado.
3. Executar uma etapa sustentada na carga alvo e depois testar um pico apenas
   se quotas e autorizacao permitirem.
4. Registrar usuarios virtuais concorrentes, requisicoes/segundo, duracao,
   mix de operacoes, erros, latencias p50/p95/p99, timeouts, respostas
   429/5xx, saturacao e consumo/quota de cada provedor.
5. Interromper se houver risco de custo, violacao de quota, degradacao severa
   ou impacto em usuarios.
6. Repetir cada cenario em condicoes comparaveis e registrar variacao.

### 3.3 Criterios e interpretacao

O limite demonstrado deve ser a maior carga que satisfaz todos os criterios
acordados durante a duracao definida, nao o primeiro pico em que a pagina
carregou. Informar separadamente:

- capacidade sustentada e capacidade de pico;
- usuario concorrente versus requisicao concorrente;
- resultados com cache frio e quente;
- limitacao que primeiro ocorreu (funcao, banco, auth ou TMDB);
- margem, variabilidade e configuracao do experimento.

O resultado e valido apenas para a configuracao e data testadas. Alterar
plano, regiao, codigo, politicas, limites ou comportamento de cache requer
nova medicao.

## 5. Como medir elasticidade

Elasticidade nao e um unico numero sem uma definicao operacional. Para este
sistema, medir:

- crescimento de capacidade/throughput ao elevar carga;
- latencia e taxa de erro em cada patamar;
- tempo de deteccao e resposta a aumento de carga, se houver metricas
  disponiveis;
- comportamento ao reduzir carga (recursos/consumo e recuperacao);
- limite de quotas e erros de dependencia;
- custo por volume de requisicoes ou jornada, conforme dados do provedor.

Registrar graficos e series temporais, configuracao e momento da medicao.
Distinguir escalonamento automatico da infraestrutura de cache, que reduz
chamadas repetidas, e de limites/quota de servicos gerenciados.

## 6. Testes funcionais recomendados

Como nao ha suite automatizada visivel no repositorio, criar testes para
cobrir ao menos:

- handler TMDB: metodo nao permitido, endpoint fora da allowlist,
  parametros invalidos, token ausente, resposta de erro e falha de rede;
- sessao: inicializacao, login, logout, callback de confirmacao e recuperacao;
- favoritos: adicionar, remover, duplicata, erro de rede e mudanca de usuario;
- RLS: duas contas nao podem ler, inserir em nome de, ou excluir favoritos
  uma da outra;
- navegacao direta/refresh nas rotas SPA publicadas;
- mensagens de erro, estado de carregamento e operacao sem configuracao do
  Supabase;
- regressao visual/responsividade e acessibilidade por teclado/leitor de tela.

Testes de integracao contra Supabase/TMDB devem usar ambientes e credenciais
controlados. Nao compartilhar segredos com CI ou incluir tokens em fixtures.

## 7. Registro de resultados

Para cada execucao, preencher:

| Campo | Valor a registrar |
| --- | --- |
| Data e responsavel | A preencher |
| Commit/versao da aplicacao | A preencher |
| Ambiente, regiao e planos | A preencher |
| Versoes e configuracao dos provedores | A preencher |
| Perfil de carga e duracao | A preencher |
| Concorrencia e RPS observados | A preencher |
| Latencia p50/p95/p99 | A preencher |
| Erros/timeouts/429/5xx | A preencher |
| Cache frio/quente | A preencher |
| Quotas/custo/saturacao | A preencher |
| Resultado e limitacao encontrada | A preencher |

**Conclusao atual:** sem execucao registrada, a capacidade e a elasticidade do
Moview permanecem **nao determinadas**.

## 8. Reprodutibilidade e validade

Para que outra pessoa consiga repetir e interpretar uma verificacao, arquivar
com o resultado:

- hash do commit, versoes do Node.js/npm e dependencias instaladas;
- ambiente, regiao, planos e configuracoes efetivas dos provedores;
- versoes/data das documentacoes oficiais consultadas para limites, quotas e
  autorizacao de carga;
- scripts de teste e parametros usados, sem segredos ou dados pessoais;
- conjunto de dados sinteticos ou procedimento para recria-lo;
- criterios de sucesso definidos antes da execucao, resultados brutos
  agregados e metodo de calculo das metricas;
- desvios, falhas, repeticoes, limitacoes e qualquer alteracao de configuracao
  durante o ensaio.

As conclusoes nao devem ser generalizadas para outras regioes, planos,
periodos, perfis de carga ou versoes sem evidencias adicionais. Relatar
dependencias externas, tamanho da amostra, variabilidade e possiveis vieses.
Preservar dados brutos de forma segura e compartilhar apenas informacoes
necessarias, sem credenciais, identificadores de usuarios ou outros dados
pessoais.

Ao documentar o metodo de desenvolvimento ou citar praticas/criterios de
engenharia, registrar o processo realmente utilizado, fontes tecnicas
consultadas e suas versoes/datas. O repositorio atual nao registra metodologia
formal nem referencias bibliograficas; nao apresentar um processo ou fonte
como aplicado sem confirmacao.

## Fontes oficiais de cotas

Valores consultados em 21/10/2026; confirmar novamente antes de operar ou
alterar limites:

- [Vercel pricing](https://vercel.com/pricing) — precos e cotas por plano.
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) — uso mensal
  incluido e comportamento quando cotas sao excedidas.
- [Vercel limits](https://vercel.com/docs/limits) — limites gerais de conta e
  deploy.
- [Vercel Functions limits](https://vercel.com/docs/functions/limitations)
  — memoria, duracao e limites das funcoes.
- [Vercel concurrency scaling](https://vercel.com/docs/functions/concurrency-scaling)
  — concorrencia maxima, burst e escala automatica.
- [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
  — uso comercial permitido e regras de uso.
- [Supabase pricing](https://supabase.com/pricing) — cotas Free, incluindo
  MAUs, banco, egress e armazenamento.
- [Supabase compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)
  — compute Nano e limites de banco.
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
  — pausa por inatividade e consideracoes operacionais do plano gratuito.
- [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)
  — limites de e-mail e requisicoes de autenticacao.
