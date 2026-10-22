# Documentação de engenharia do Moview

Esta pasta registra o levantamento e a análise do sistema, sua arquitetura,
implementação, validação e limites conhecidos. O material foi elaborado a
partir do código e da configuração presentes no repositório; não substitui
medições de produção nem a configuração dos serviços externos.

## Documentos

1. [Requisitos e escopo](./requisitos.md) — atores, requisitos funcionais,
   requisitos não funcionais, critérios de aceitação e itens fora do escopo.
2. [Análise e arquitetura](./arquitetura.md) — componentes, fluxos, dados,
   decisões arquiteturais e análise de capacidade/elasticidade.
3. [Implementação e operação](./implementacao-operacao.md) — tecnologias,
   configuração, implantação, segurança e manutenção.
4. [Testes, desempenho e capacidade](./testes-capacidade.md) — resultados dos
   testes automatizados, lacunas de validação e protocolo para medir
   concorrência e elasticidade sem inventar resultados.
5. [Processo de engenharia](./processo-engenharia.md) — linha do tempo
   comprovada pelo Git e rastreabilidade retrospectiva entre requisitos,
   implementação e validação.

## Estado e limites das afirmações

- Os recursos descritos como existentes foram observados nos arquivos do
  projeto.
- O repositório não registra resultados de teste de carga, número de usuários
  simultâneos, taxa de requisições, latência sob carga ou limite de
  escalabilidade.
- A análise considera os planos gratuitos Vercel Hobby e Supabase Free e
  descreve suas cotas publicadas em [testes-capacidade.md](./testes-capacidade.md).
  Elas permitem identificar limites de consumo, mas **não demonstram uma
  quantidade de usuários simultâneos suportados**.
- O Moview não possui um número validado de usuários simultâneos. O limite
  efetivo depende também do perfil de uso, cache, latência, cotas da TMDB e
  recursos compartilhados dos provedores.
- Requisitos de desempenho que aparecem como sugestões estão identificados
  como metas propostas, não como resultados alcançados.
- Valores e configurações de serviços externos podem mudar; confirme-os nos
  painéis e termos oficiais. Os valores consultados para esta análise foram
  verificados em 21/10/2026.

## Processo e rastreabilidade

Esta documentação foi derivada do código e dos arquivos de configuração do
projeto. O processo formal de desenvolvimento,
participantes, iterações, priorização de requisitos e validação com usuários
não estão registrados; não se presume que tenham sido executados. A linha do
tempo e a rastreabilidade retrospectiva estão em
[processo-engenharia.md](./processo-engenharia.md).

## Identificação do produto

Moview é uma aplicação web de catálogo de filmes com interface em português,
consulta de dados da TMDB, autenticação por e-mail e favoritos privados por
conta. O frontend é uma SPA em React/Vite. A aplicação usa uma função
serverless na Vercel para a integração com a TMDB e o Supabase para
autenticação e persistência.
