# Sóter — loja de projetos

Loja online onde a Sóter vende projetos prontos (sites e apps, entregues como código-fonte) para pequenas empresas: vitrine, catálogo, página de produto, checkout em 4 etapas, login com dois papéis (cliente / administrador), área do cliente e painel administrativo.

Implementação em **Next.js (App Router) + TypeScript** recriando o protótipo de alta fidelidade que está em [`design/`](design/). A especificação completa (tokens, telas, interações, modelo de dados) está em [`design/HANDOFF.md`](design/HANDOFF.md).

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção
npm run typecheck
```

Acesso de demonstração na tela **Entrar**: `admin@soter.dev` abre o painel; qualquer outro e-mail entra como cliente (`cliente@demo.com` já tem um pedido).

## Estrutura

```
app/                    rotas (App Router)
  page.tsx              home  (/#sobre rola até a seção Sobre)
  projetos/             catálogo e /projetos/[id] (detalhe)
  checkout/             carrinho → dados → pagamento → download
  entrar/               login
  conta/                área do cliente (projetos, dúvidas, perfil)
  admin/                painel (produtos, dúvidas, vendas); /admin?editar=<id> abre o editor
  globals.css           base + classes da página
components/             Header, Footer, cards de produto, Tabs, Segmented, ImageSlot, RequireRole
lib/
  types.ts              Product, Order, Question, User
  seed.ts               dados de exemplo do protótipo
  store.tsx             estado da loja (React context + localStorage)
  config.ts             pixDiscount, showRatings, e-mails
  format.ts             moeda, datas, validação
styles/industry.css     design system "Industry" (tokens e classes .btn, .card, .blueprint…)
design/                 protótipo original — abra "Soter Loja v2.dc.html" no navegador
```

## Estado atual e próximos passos

O app reproduz todas as telas e interações do protótipo, mas os dados ainda vivem **no navegador** (`lib/store.tsx`, salvos em `localStorage`). Pontos marcados com `TODO(produção)` no código:

- **Dados**: Postgres (Prisma) ou Supabase para `Product`, `Order`, `Question`, `User`; trocar as ações do store por chamadas aos endpoints (`GET /products`, `POST/PATCH /admin/products`, `GET /me/orders`, `POST /me/questions`, `PATCH /admin/questions/:id`).
- **Autenticação**: senha com hash ou magic link, `role` salvo no usuário, `/admin/*` e `/conta` protegidos no servidor (hoje `RequireRole` é só uma guarda no cliente). Remover o bloco "Acesso de demonstração".
- **Pagamento**: Stripe ou Mercado Pago para Pix/cartão/boleto (`POST /checkout`), com webhook que cria o `Order` e libera o download.
- **Downloads**: arquivos em S3/Supabase Storage com URL assinada (`GET /downloads/:orderId`).
- **Imagens**: os prints são placeholders (`ImageSlot`, aceita `src`), com duotone aplicado. Links de demo ao vivo também estão pendentes.
