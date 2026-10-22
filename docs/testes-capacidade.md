# Testes, desempenho e capacidade

## 1. Evidências de validação existentes

Resultados executados localmente neste checkout em 22/10/2026:

| Verificação | Resultado | Alcance/limitação |
| --- | --- | --- |
| `npm test` | Passou: 19 testes, 0 falhas. | Cobertura de utilitários de gêneros/classificação/mensagens de erro e da função de backend TMDB, com respostas externas simuladas. Não valida credenciais, serviços remotos nem integração implantada. |
| `npm run lint` | Passou, sem erros reportados. | Análise estática; não prova funcionamento em runtime. |
| `npm run build` | Passou; Vite 8.3.0 gerou build de produção. | Build não valida credenciais nem serviços remotos. |
| Tamanho do bundle | JS principal 550.19 kB minificado e 159.09 kB gzip. | O Vite emitiu aviso por ultrapassar 500 kB minificado. |
| Teste de capacidade existente | Não localizado. | Não há número validado de usuários simultâneos, requisições/segundo ou elasticidade. |

Os testes automatizados usam o runner nativo `node:test` e podem ser
executados com `npm test`. Os casos do backend substituem a chamada `fetch`
para verificar validações, encaminhamento, cache e tratamento de falhas sem
acessar a TMDB. Essa evidência descreve somente este checkout e ambiente; não
certifica deploy remoto, integração com Supabase/TMDB nem capacidade sob carga.

## 2. Envelope de recursos nos planos gratuitos

Premissa desta análise: Vercel Hobby e Supabase Free, sem upgrade. A tabela
resume cotas publicadas nos documentos oficiais consultados em 21/10/2026.
Elas podem mudar, e o consumo agregado da conta/organização/projeto deve ser
confirmado nos respectivos painéis.

### Vercel Hobby

| Recurso | Cota mensal/limite publicado | Consequência para o Moview |
| --- | ---: | --- |
| CDN requests | 1.000.000 por mês | Cota para requisições CDN; o consumo real depende dos recursos solicitados e do cache do navegador. |
| Fast Data Transfer | 100 GB por mês | Limita a entrega dos recursos estáticos ao navegador; imagens de pôster são carregadas diretamente da TMDB, não do bundle Vercel. |
| Fast Origin Transfer | 10 GB por mês | Tráfego entre a rede Vercel e recursos de computação, como Functions; respostas de `/api/tmdb` podem contribuir para esse consumo. |
| Function invocations | 1.000.000 por mês | Chamadas a `/api/tmdb` consomem execuções quando chegam à função; respostas servidas do cache podem evitar execução. |
| Active CPU | 4 horas por mês | Pode ser o limite antes da contagem de invocações, conforme o tempo de CPU de cada requisição. |
| Provisioned memory | 360 GB-horas por mês | O uso depende da memória provisionada e do tempo de execução da função. |
| Memória máxima de uma função | 2 GB | Limite por função; não significa que o projeto tenha 2 GB de memória exclusiva permanente. |
| Duração máxima da função | 300 segundos no Hobby | Uma requisição lenta à dependência externa ainda pode falhar ao atingir o limite. |
| Concorrência automática | Até 30.000 execuções simultâneas; burst inicial de até 1.000 concorrentes por 10 segundos por região | Teto/escala de plataforma; não é garantia de que o Moview alcance essa concorrência dentro das cotas mensais ou com latência aceitável. A escala pode levar minutos. |
| Upload estático por deploy | 100 MB | Limite operacional de deploy; o build atual é inferior a esse teto. |

A Vercel também publica 5.000 transformações de imagem mensais no Hobby; o
Moview recebe pôsteres diretamente da TMDB e não usa a transformação de
imagem da Vercel no fluxo observado. O uso real pode mudar com futuras
alterações.

No Hobby, não se deve presumir faturamento automático de excedentes: a
documentação informa que, em geral, recursos que excedem as cotas precisam
aguardar a janela de 30 dias para voltar a ser utilizados; algumas cotas
podem ter pausas menores. Planeje alertas e consulte o painel da conta.

#### Estimativas aritméticas do código/build atual

- O carregamento inicial do provider faz quatro chamadas de catálogo e,
  após receber os resultados, pode fazer até três chamadas de classificação
  indicativa: até sete requisições iniciais a `/api/tmdb`. A abertura de
  biografias e o carregamento de sinopses de favoritos podem acrescentar
  requisições.
- Dividindo 1.000.000 de invocações por sete, obtém-se **aproximadamente
  142.857 carregamentos de catálogo sem cache por mês** como teto aritmético
  baseado somente na contagem de invocações. Isso pressupõe que todas as sete
  chamadas cheguem à função, sem repetições, detalhes, favoritos, retries ou
  outras rotas. Não é uma previsão de sessões suportadas: a função também tem
  cotas de CPU/memória, e o cache `s-maxage=300` pode reduzir invocações para
  respostas repetidas.
- No build medido, HTML, JS comprimido e CSS comprimido somam cerca de
  168 kB; incluir a imagem de fundo do login eleva o conjunto para cerca de
  421 kB. Dividir 100 GB por esses tamanhos dá um teto aritmético aproximado
  de **594 mil carregamentos sem a imagem** ou **237 mil com a imagem**, por
  mês. São cenários de transferência fria do bundle, antes de outras
  requisições, variações de resposta e bytes de protocolo; o cache do navegador
  pode reduzir a transferência em visitas repetidas.
- Com quatro requisições CDN por primeiro carregamento, 1.000.000 de
  requisições corresponderia aritmeticamente a cerca de 250 mil
  carregamentos. Na prática, HTML/arquivos auxiliares, chamadas de API,
  navegação, cache do navegador e outros projetos da conta alteram o total.

Essas estimativas são cenários simplificados e não devem ser somadas como se
fossem capacidade simultânea. O primeiro recurso a atingir sua cota varia com
o cache, a distribuição de tráfego, as durações e o bundle servido.

### Supabase Free

| Recurso | Cota publicada | Consequência para o Moview |
| --- | ---: | --- |
| Usuários ativos mensais (MAU) | 50.000 incluídos | Limite de usuários ativos medido por mês; não são 50.000 usuários simultâneos nem promessa de throughput. |
| Tamanho do banco por projeto | 500 MB | Limita o total persistido, incluindo dados e estruturas do banco. O tamanho real de cada favorito, índices e overhead precisa ser medido. |
| Compute do banco | Nano, CPU compartilhada, até 0,5 GB RAM | A capacidade depende de consultas, concorrência, cache do banco e carga compartilhada; não há conversão direta para usuários. |
| Egress | 5 GB por mês | Inclui tráfego de saída do Supabase, por exemplo, respostas de consultas de favoritos. |
| Cached egress | 5 GB por mês | Cota separada indicada no plano; a aplicabilidade depende do tipo de resposta/camada cacheada. |
| File storage | 1 GB | O fluxo observado guarda os caminhos de pôsteres, não os arquivos de imagem, no Supabase. |
| Pausa por inatividade | Projetos Free podem ser pausados após uma semana de baixa atividade | Pode exigir reativação pelo painel e afetar a disponibilidade. |
| Backup baixável do banco | Não incluído no Free | Definir estratégia de backup/exportação compatível com as necessidades antes de depender do projeto como única cópia. |
| API requests | Anunciadas como ilimitadas | “Ilimitadas” não significa compute, egress, conexões, taxa de Auth ou latência ilimitados. |
| E-mail Auth no provedor padrão | 2 e-mails por hora por projeto | Se o app usa o provedor de e-mail padrão, confirmações e recuperações podem ficar limitadas; verificar a configuração SMTP efetiva. |

As taxas padrão documentadas de Auth também incluem limites por IP, como
30 requisições de cadastro/login/recuperação por 5 minutos e 150 requisições
ao endpoint de token por 5 minutos. Há limites por usuário para reenvio de
confirmação e recuperação. Consulte a configuração real do projeto antes de
um ensaio; erros de limite retornam HTTP 429.

### Leitura de capacidade

- Um limite de 50.000 MAU do Supabase descreve a inclusão no plano, não a
  concorrência testada. Não é válido reportar “50.000 usuários simultâneos”.
- Um máximo de 30.000 concorrências da Vercel é um limite de plataforma de
  funções, não a concorrência suportável pelo banco/TMDB ou pelo conjunto do
  Moview. O burst inicial e o escalonamento gradual também afetam os picos.
- A cota de 1.000.000 de invocações é mensal; ela não define uma taxa
  instantânea garantida. CPU, memória provisionada, transferência, cache,
  limites de Supabase Auth, banco e TMDB podem se esgotar antes.
- O banco é compartilhado e possui apenas até 0,5 GB de RAM no compute Nano.
  Sem uma carga de referência e teste, não é possível estimar quantas
  operações de favoritos por segundo ele sustentará.
- O Moview não controla os limites da TMDB. Verifique os termos, as cotas e a
  resposta de rate limit vigentes com esse fornecedor antes de aumentar a
  carga.

**Conclusão operacional:** as cotas mensais fornecem um envelope de uso do
plano, mas a concorrência efetiva do software permanece não medida. As
estimativas acima dimensionam alguns limites de consumo; não constituem
garantia de usuários, sessões, RPS ou SLA.

## 3. O que ainda não pode ser afirmado

Sem um ensaio controlado e dados do ambiente implantado, não declare:

- quantidade máxima de usuários simultâneos;
- requisições por segundo ou transações por segundo sustentáveis;
- tempo de resposta p95/p99 sob carga;
- percentual de disponibilidade ou SLA;
- elasticidade linear/automática, fator de escala ou tempo de escalonamento;
- capacidade máxima do Supabase, Vercel ou TMDB;
- ausência de falhas em condições de pico.

Esses valores dependem do plano contratado, das regiões, da configuração, dos
limites vigentes, do cache, do perfil de interação e dos serviços externos. O
desenho serverless não fornece, isoladamente, um limite numérico.

### 3.1 Protocolo proposto para teste de carga

O protocolo é uma recomendação de engenharia, não um resultado já executado.

#### 3.1.1 Preparação

1. Usar staging equivalente à produção em versões, região e planos. Não gerar
   carga contra contas de usuários reais.
2. Consultar e registrar limites/cotas atuais da Vercel, Supabase e TMDB.
   Confirmar autorização e limites para teste com os provedores.
3. Criar dados sintéticos e contas controladas. Usar contas separadas para
   verificar isolamento RLS.
4. Definir perfil realista de jornada (home, catálogo, abrir detalhe,
   autenticar e operar favoritos), proporção por operação, tempo de pausa e
   cache frio/quente.
5. Definir previamente o critério de sucesso com o responsável de produto e
   operações: carga-alvo, duração, p95/p99, taxa de erro, consumo de cotas e
   limites de custo. Não usar valores padrão sem aprovação.
6. Ativar observabilidade para frontend, função, banco, autenticação e
   dependências; garantir que tokens e dados pessoais não sejam registrados.

#### 3.1.2 Execução

1. Fazer aquecimento controlado, separando resultados de cache frio e quente.
2. Aumentar a concorrência em etapas; manter cada etapa pelo período acordado.
3. Executar uma etapa sustentada na carga-alvo e depois testar um pico apenas
   se as cotas e a autorização permitirem.
4. Registrar usuários virtuais concorrentes, requisições/segundo, duração,
   mix de operações, erros, latências p50/p95/p99, timeouts, respostas
   429/5xx, saturação e consumo/cotas de cada provedor.
5. Interromper se houver risco de custo, violação de cota, degradação severa
   ou impacto em usuários.
6. Repetir cada cenário em condições comparáveis e registrar variações.

#### 3.1.3 Critérios e interpretação

O limite demonstrado deve ser a maior carga que satisfaz todos os critérios
acordados durante a duração definida, não o primeiro pico em que a página
carregou. Informe separadamente:

- capacidade sustentada e de pico;
- usuário concorrente versus requisição concorrente;
- resultados com cache frio e quente;
- limitação que ocorreu primeiro (função, banco, auth ou TMDB);
- margem, variabilidade e configuração do experimento.

O resultado é válido apenas para a configuração e a data testadas. Alterar
plano, região, código, políticas, limites ou comportamento de cache requer
nova medição.

## 4. Como medir elasticidade

Elasticidade não é um único número sem uma definição operacional. Para este
sistema, meça:

- crescimento de capacidade/throughput ao elevar a carga;
- latência e taxa de erro em cada patamar;
- tempo de detecção e resposta ao aumento de carga, se houver métricas
  disponíveis;
- comportamento ao reduzir a carga (recursos/consumo e recuperação);
- limite de cotas e erros de dependência;
- custo por volume de requisições ou jornada, conforme os dados do provedor.

Registre gráficos e séries temporais, a configuração e o momento da medição.
Distingua o escalonamento automático da infraestrutura do cache, que reduz
chamadas repetidas, e dos limites/cotas de serviços gerenciados.

## 5. Testes funcionais recomendados

Como não há suíte automatizada visível no repositório, crie testes para
cobrir ao menos:

- handler TMDB: método não permitido, endpoint fora da allowlist,
  parâmetros inválidos, token ausente, resposta de erro e falha de rede;
- sessão: inicialização, login, logout, callback de confirmação e recuperação;
- favoritos: adicionar, remover, duplicata, erro de rede e mudança de usuário;
- RLS: duas contas não podem ler, inserir em nome de ou excluir favoritos
  uma da outra;
- navegação direta/refresh nas rotas SPA publicadas;
- mensagens de erro, estado de carregamento e operação sem configuração do
  Supabase;
- regressão visual/responsividade e acessibilidade por teclado/leitor de tela.

Testes de integração contra Supabase/TMDB devem usar ambientes e credenciais
controlados. Não compartilhe segredos com CI nem inclua tokens em fixtures.

## 6. Registro de resultados

Para cada execução, preencha:

| Campo | Valor a registrar |
| --- | --- |
| Data e responsável | A preencher |
| Commit/versão da aplicação | A preencher |
| Ambiente, região e planos | A preencher |
| Versões e configuração dos provedores | A preencher |
| Perfil de carga e duração | A preencher |
| Concorrência e RPS observados | A preencher |
| Latência p50/p95/p99 | A preencher |
| Erros/timeouts/429/5xx | A preencher |
| Cache frio/quente | A preencher |
| Cotas/custo/saturação | A preencher |
| Resultado e limitação encontrada | A preencher |

**Conclusão atual:** sem execução registrada, a capacidade e a elasticidade do
Moview permanecem **não determinadas**.

## 7. Reprodutibilidade e validade

Para que outra pessoa consiga repetir e interpretar uma verificação, arquive
com o resultado:

- hash do commit, versões do Node.js/npm e dependências instaladas;
- ambiente, região, planos e configurações efetivas dos provedores;
- versões/data das documentações oficiais consultadas para limites, cotas e
  autorização de carga;
- scripts de teste e parâmetros usados, sem segredos ou dados pessoais;
- conjunto de dados sintéticos ou procedimento para recriá-lo;
- critérios de sucesso definidos antes da execução, resultados brutos
  agregados e método de cálculo das métricas;
- desvios, falhas, repetições, limitações e qualquer alteração de configuração
  durante o ensaio.

As conclusões não devem ser generalizadas para outras regiões, planos,
períodos, perfis de carga ou versões sem evidências adicionais. Relate
dependências externas, tamanho da amostra, variabilidade e possíveis vieses.
Preserve dados brutos de forma segura e compartilhe apenas informações
necessárias, sem credenciais, identificadores de usuários ou outros dados
pessoais.

Ao documentar o método de desenvolvimento ou citar práticas/critérios de
engenharia, registre o processo realmente utilizado, as fontes técnicas
consultadas e suas versões/datas. O repositório atual não registra metodologia
formal nem referências bibliográficas; não apresente um processo ou uma fonte
como aplicados sem confirmação.

## Fontes oficiais de cotas

Valores consultados em 21/10/2026; confirme-os novamente antes de operar ou
alterar limites:

- [Vercel pricing](https://vercel.com/pricing) — preços e cotas por plano.
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby) — uso mensal
  incluído e comportamento quando cotas são excedidas.
- [Vercel limits](https://vercel.com/docs/limits) — limites gerais de conta e
  deploy.
- [Vercel Functions limits](https://vercel.com/docs/functions/limitations)
  — memória, duração e limites das funções.
- [Vercel concurrency scaling](https://vercel.com/docs/functions/concurrency-scaling)
  — concorrência máxima, burst e escala automática.
- [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
  — uso comercial permitido e regras de uso.
- [Supabase pricing](https://supabase.com/pricing) — cotas Free, incluindo
  MAUs, banco, egress e armazenamento.
- [Supabase compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)
  — compute Nano e limites de banco.
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
  — pausa por inatividade e considerações operacionais do plano gratuito.
- [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)
  — limites de e-mail e requisições de autenticação.
