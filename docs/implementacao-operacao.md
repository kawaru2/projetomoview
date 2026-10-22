# Implementação e operação

## 1. Stack observada

| Camada | Tecnologia |
| --- | --- |
| Interface | React 19, JavaScript e CSS |
| Build/desenvolvimento | Vite 8, plugin React, compilador React |
| Rotas | React Router 7 |
| Notificações | React Toastify |
| Autenticação e banco | Supabase JS 2, Supabase Auth e PostgreSQL |
| Integração de filmes | TMDB API v3 por função serverless Vercel |
| Qualidade estática | ESLint |

As versões declaradas estão no `package.json`; revalide antes da publicação,
pois dependências e plataformas evoluem.

## 2. Configuração local

Pré-requisitos: Node.js compatível com as versões instaladas e npm.

1. Instale dependências com `npm install`.
2. Disponibilize as variáveis de ambiente:

   ```env
   TMDB_READ_ACCESS_TOKEN=token_privado_tmdb
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica
   ```

3. Configure Supabase Auth, URLs de redirecionamento, tabela e RLS conforme
   os requisitos descritos em [requisitos.md](./requisitos.md).
4. Inicie com `npm run dev`. O middleware do Vite encaminha localmente
   `/api/tmdb` ao handler compartilhado.

`TMDB_READ_ACCESS_TOKEN` é um segredo server-side e não deve ter prefixo `VITE_`.
As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` ficam disponíveis
no cliente. Use apenas URL e chave pública (Publishable/anon); nunca use
`Secret`/`service_role` em `VITE_*`.

## 3. Build e deploy

- `npm run lint`: executa ESLint.
- `npm run build`: gera os arquivos de produção.
- `npm run preview`: serve o build localmente para verificação.
- Deploy: conecte o repositório à Vercel, configure as três variáveis nos
  ambientes apropriados e publique.
- Alterações em `VITE_*` exigem novo build, pois seus valores são incorporados
  ao bundle cliente.
- Configure Site URL e Redirect URLs do Supabase para os domínios usados e
  caminhos `/auth/callback` e `/recuperarSenha`.
- O `vercel.json` reescreve as rotas SPA; valide a navegação direta e a atualização
  das rotas depois do deploy.
- Esta documentação assume Vercel Hobby e Supabase Free. As cotas de
  referência e as implicações operacionais estão em
  [testes-capacidade.md](./testes-capacidade.md); confirme o consumo real nos
  painéis antes de estimar o uso restante.
- A documentação oficial da Vercel define o Hobby para uso pessoal não
  comercial. Se a implantação tiver finalidade comercial, inclusive conforme
  os critérios de uso comercial da Vercel, a premissa de permanecer nesse
  plano precisa ser revista para cumprir os termos vigentes.

## 4. Segurança e privacidade

- Não publique o token TMDB, chaves Supabase secret/service role nem
  capturas de tela ou logs com credenciais.
- O fato de a chave Supabase ser pública não elimina a necessidade de RLS.
- Confirme em ambiente real que RLS está habilitada e que cada policy limita
  a linha a `auth.uid()`. Teste com duas contas distintas.
- O handler TMDB limita os endpoints e parâmetros aceitos; respostas de erro
  não recebem cache. O handler registra erros de integração no log.
- Revise limites e proteção contra abuso da rota pública `/api/tmdb`.
- Defina política de privacidade, retenção, exclusão de conta, consentimento
  e processo para incidentes antes do uso com público.
- Confirme os termos atuais da TMDB para uso e atribuição de dados/imagens e
  as licenças das dependências distribuídas. Registre fontes, versões e data
  da verificação; não presuma permissão de republicação somente porque a API
  está acessível.
- Use dados sintéticos em testes e demonstrações sempre que possível. Defina
  base legal, minimização, prazo de retenção, fluxo de exclusão e proteção de
  dados pessoais com os responsáveis pelo projeto.

## 5. Observabilidade e operação

O código consultado não mostra uma plataforma de métricas/tracing integrada,
nem define SLO, alertas, backup/restore ou runbook operacional. Para produção,
acompanhe pelo menos:

- taxa, latência e falhas da função TMDB, separadas por classe de status;
- cache hit/miss se a plataforma disponibilizar esse dado;
- erros/latência de autenticação e operações PostgreSQL;
- volume e concorrência por dependência e consumo das cotas/plano;
- disponibilidade percebida por verificação sintética sem credenciais;
- logs com identificadores técnicos, nunca senhas/tokens ou dados pessoais
  desnecessários.

Documente responsáveis, canais de alerta, escalonamento e procedimentos de
degradação quando TMDB ou Supabase estiver indisponível. Não existe evidência
de que essas operações estejam implantadas; verifique com os responsáveis
antes de afirmar disponibilidade operacional.

## 6. Manutenção e riscos conhecidos

- Build local validado nesta revisão; o bundle JavaScript principal ficou em
  550.19 kB minificado (159.09 kB gzip), acima do limite de aviso de 500 kB
  do Vite. Avalie a divisão por rotas/`import()` e meça o impacto.
- Endereços de imagens em algumas páginas usam HTTP, enquanto outras usam
  HTTPS; antes da produção, verifique e padronize HTTPS para evitar conteúdo
  misto em origem HTTPS.
- O comportamento do cache depende da plataforma e das configurações efetivas
  do deploy.
- Atualizações de framework, SDKs ou provedor devem passar por lint, build e
  verificação funcional; atualmente não há suíte automatizada de unidade ou
  integração registrada no package.
- A validade das conclusões técnicas fica restrita ao commit, configuração,
  ambiente, regiões, planos e data verificados. Mudanças nesses fatores podem
  exigir nova validação; consulte a documentação oficial vigente dos
  provedores em vez de extrapolar limites ou termos de uma verificação antiga.
