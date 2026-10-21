# Documentação de engenharia do Moview

Esta pasta registra o levantamento e a analise do sistema, sua arquitetura,
implementação, validação e limites conhecidos. O material foi elaborado a
partir do código e da configuração presentes no repositorio; nao substitui
medições de produção nem a configuração dos serviços externos.

## Documentos

1. [Requisitos e escopo](./requisitos.md) — atores, requisitos funcionais,
   requisitos nao funcionais, criterios de aceitação e itens fora do escopo.
2. [Analise e arquitetura](./arquitetura.md) — componentes, fluxos, dados,
   decisoes arquiteturais e analise de capacidade/elasticidade.
3. [Implementacao e operacao](./implementacao-operacao.md) — tecnologias,
   configuração, implantação, segurança e manutenção.
4. [Testes, desempenho e capacidade](./testes-capacidade.md) — evidências
   existentes, lacunas de testes e protocolo para medir concorrência e
   elasticidade sem inventar resultados.
5. [Processo de engenharia](./processo-engenharia.md) — linha do tempo
   comprovada pelo Git e rastreabilidade retrospectiva entre requisitos,
   implementação e validação.

## Estado e limites das afirmacoes

- Os recursos descritos como existentes foram observados nos arquivos do
  projeto.
- O repositorio nao registra resultados de teste de carga, numero de usuarios
  simultaneos, taxa de requisições, latencia sob carga ou limite de
  escalabilidade.
- A análise considera os planos gratuitos Vercel Hobby e Supabase Free e
  descreve suas cotas publicadas em [testes-capacidade.md](./testes-capacidade.md).
  Elas permitem identificar limites de consumo, mas **nao demonstram uma
  quantidade de usuarios simultaneos suportados**.
- O Moview nao possui um numero validado de usuarios simultaneos. O limite
  efetivo depende tambem do perfil de uso, cache, latência, quotas da TMDB e
  recursos compartilhados dos provedores.
- Requisitos de desempenho que aparecem como sugestoes estao identificados
  como metas propostas, nao como resultados alcançados.
- Valores e configurações de serviços externos podem mudar; confirme-os nos
  paineis e termos oficiais. Os valores consultados para esta analise foram
  verificados em 21/10/2026.

## Processo e rastreabilidade

Esta documentação foi derivada do codigo, dos arquivos de configuração e dos
guias existentes no repositorio. O processo formal de desenvolvimento,
participantes, iterações, priorização de requisitos e validação com usuarios
nao estao registrados; nao se presume que tenham sido executados. A linha do
tempo e a rastreabilidade retrospectiva estao em
[processo-engenharia.md](./processo-engenharia.md).

## Identificacao do produto

Moview e uma aplicação web de catálogo de filmes com interface em português,
consulta de dados da TMDB, autenticação por e-mail e favoritos privados por
conta. O frontend e uma SPA em React/Vite. A aplicação usa uma função
serverless na Vercel para a integração com a TMDB e o Supabase para
autenticação e persistencia.
