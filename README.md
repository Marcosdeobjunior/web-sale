# Handoff: Sóter — loja de projetos (site, área do cliente e painel admin)

## Overview
Loja online onde a Sóter vende projetos prontos (sites e apps, entregues como código-fonte para download) para pequenas empresas. Inclui vitrine, catálogo, página de produto, checkout em 4 etapas, login com dois papéis (cliente / administrador), área do cliente e painel administrativo.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento, **não código de produção**. A tarefa é **recriar essas telas no ambiente do projeto** (React, Vue, etc.) usando seus padrões e bibliotecas. Se ainda não existe código, sugestão: **Next.js (App Router) + TypeScript**, Postgres (Prisma) ou Supabase para dados/autenticação, Stripe ou Mercado Pago para Pix/cartão/boleto, e armazenamento de arquivos (S3/Supabase Storage) com links de download assinados.

Abra `Soter Loja v2.dc.html` num navegador para usar o protótipo. Os dados (produtos, dúvidas, pedidos) estão no topo do bloco `<script data-dc-script>` como `SEED_PRODUCTS`, `REVIEWS`, `SEED_Q`, `SEED_ORDERS`. Toda a lógica de estado está na classe `Component` (método `renderVals`).

## Fidelity
**Alta fidelidade.** Cores, tipografia, espaçamentos e interações são finais. Recrie fielmente. Exceções intencionais: imagens são placeholders (o dono vai enviar prints), QR code Pix e links de demo/download são simulados.

## Linguagem visual (sistema "Industry")
- Estilo "blueprint/wireframe": cantos retos (radius 0 em cards, botões, inputs, tags), bordas finas de 1px, **marcas de registro "+"** nos 4 cantos de cards, figuras e botão primário (classe `.blueprint` + `<i class="corner tl|tr|bl|br">`, cruz de 11×11px deslocada -6px, cor = texto a 55%).
- Cards e figuras **sem preenchimento** (transparentes). O botão primário é o único objeto sólido (fundo accent).
- Imagens passam por **duotone**: `::after` com `background: accent; mix-blend-mode: color`.
- Títulos em Barlow Condensed 600, CAIXA ALTA. Corpo em Barlow.
- Ícones: Lucide, stroke-width 1.5.
- Kicker de seção: 13px, 600, uppercase, letter-spacing .08em, cor accent-700, acima de uma linha de 1px (divider) com 12px de padding inferior; 36px até o conteúdo.

## Design Tokens
Cores:
- bg `#f2f2f3` · surface `#e9e9ea` · text `#1d1f20` · accent `#5980a6`
- divider: `#1d1f20` a 16%
- accent ramp: 100 `#eef6ff`, 200 `#d6ebff`, 300 `#b5d9fd`, 400 `#94bce3`, 500 `#749dc4`, 600 `#597ea3` (hover primário), 700 `#416180` (texto accent pequeno / pressed), 800 `#2c455d`, 900 `#1d2d3d` (faixa do modo admin)
- neutral ramp: 100 `#f5f5f8`, 200 `#e7e7ea`, 300 `#d4d4d7`, 400 `#b7b7ba`, 500 `#98989b`, 600 `#7a7a7d`, 700 `#5d5d60`, 800 `#424244`, 900 `#2b2b2d`
- Texto secundário: text a 70% (meta) e 78% (parágrafos); inativo: 55%.

Tipografia (Google Fonts): Barlow 400/500/700, Barlow Condensed 400/600.
- Display home: clamp(44px, 7vw, 92px), lh 1.02, max 14ch
- H1 de páginas: clamp(40px, 5vw, 60–64px), lh 1
- H1 detalhe/checkout: 40–44px · H2 seções de conta/painel: 26px · títulos de card: 20–22px
- Preço grande: Barlow Condensed 600, 44px (detalhe), 22–24px (cards), 28px (total)
- Corpo: 15–16px, lh 1.5–1.65 · meta: 13px · labels de campo: 12px

Espaçamento: escala 3.4 / 6.8 / 10.2 / 13.6 / 20.4 / 27.2px. Layout usa gaps de 8, 12, 16, 24, 28, 32, 40, 48px. Seções: 72–96px verticais. Container: max-width 1200px, padding lateral clamp(20px, 5vw, 72px).

Sombras: sm `0 1px 2px #2b2b2d/14%`, md `0 3px 10px /16%`, lg `0 12px 32px /22%`.

Estados: hover primário accent-600, pressed accent-700; secondary hover = texto a 7%; ghost = texto accent, hover accent a 10%. Foco: `outline 2px solid accent; offset 2px`. Disabled: opacity .45.

## Screens / Views

### Navegação global
Barra sticky no topo (fundo bg, borda inferior 1px). Marca "SÓTER" (Condensed 22px, uppercase) à esquerda; links: Projetos, Sobre, e depois conforme o papel:
- Visitante: "Entrar" + botão "Carrinho (n)" (ícone shopping-cart)
- Cliente: "Minha conta" + Carrinho
- Admin: "Painel" (sem carrinho) **e uma faixa acima** da nav: fundo accent-900, texto bg, 13px — "MODO ADMINISTRADOR · Use “Editar” em qualquer projeto para alterar o site." + links Painel / Sair à direita.

Rodapé: borda superior, marca, Projetos, Sobre, Contato (mailto), "© 2026 Sóter".

### 1. Home
- Hero (padding 96/72): título "Sites e apps prontos para o seu negócio.", subtítulo (18px, max 56ch), botões "Ver projetos →" (primário blueprint, 12×20px, 15px) e "Falar comigo" (ghost, mailto).
- 01 · Projetos em destaque — grid `auto-fill minmax(280px,1fr)`, gap 40/32. Card: imagem 16:10 duotone com borda inferior, padding 18px: kicker tipo, título, resumo, preço + "★ nota · N avaliações". Card inteiro clicável → detalhe.
- 02 · Como funciona — 3 colunas: número grande accent (40px) 01/02/03, título, texto (Escolha / Pague / Baixe e publique).
- 03 · Quem já usa — 2 citações (Condensed 500, 26px) com atribuição.
- 04 · Sobre — foto 4:3 blueprint+duotone + texto e e-mail. Link "Sobre" da nav rola até aqui.

### 2. Catálogo
Cabeçalho com H1 "Projetos", contador ("4 projetos") e controle segmentado Todos / Sites / Apps. Grid `auto-fill minmax(300px,1fr)`. Card como na home + tags de tecnologia (tag-neutral), tag "Novo" (tag-accent) e botões Detalhes (secondary) / Comprar (primary — adiciona ao carrinho e vai ao checkout). Para admin: botões "Ver página" / "Editar".

### 3. Detalhe do projeto
- Breadcrumb Projetos / Nome.
- Grid 2 colunas `auto-fit minmax(min(100%,420px),1fr)`, gap 48.
  - Esquerda: imagem principal 16:10 blueprint+duotone; abaixo 4 botões de miniatura (01 Página inicial, 02 Página interna, 03 No celular, 04 Vídeo) — borda accent quando ativo.
  - Direita (sticky top 96): card blueprint padding 28 — kicker tipo (+ botão "Editar produto" se admin), nome (40px), avaliação, resumo, preço 44px, "ou R$ X no Pix (5% off)", botões "Comprar agora" (primário), "Adicionar ao carrinho" (vira "No carrinho ✓"), "Ver demo ao vivo" (ghost + ícone external-link), lista "O que está incluso" com ícones check accent.
- Abas (Condensed 18px uppercase, sublinhado 2px accent no ativo): Descrição · Tecnologias (tabela Tecnologia / Para que serve) · Avaliações (★★★★★ + texto + autor) · Dúvidas (FAQ público geral + do produto).

### 4. Checkout (4 etapas)
Barra de progresso: 4 colunas, linha de 2px (accent se concluída/atual, divider se futura) + rótulo "01 CARRINHO / 02 DADOS / 03 PAGAMENTO / 04 DOWNLOAD".
Layout: conteúdo à esquerda + resumo sticky à direita (itens, subtotal, "Desconto Pix (5%)" em accent-700 quando Pix, total 28px).
1. Carrinho: linhas com miniatura 96px, nome, "Tipo · licença para 1 negócio", preço, Remover. Vazio: "Seu carrinho está vazio." + Ver projetos. Continuar desabilitado se vazio.
2. Dados: Nome completo, E-mail ("é para onde vai o download"). Validação: nome ≥ 2 caracteres e e-mail válido. Pré-preenchido se logado.
3. Pagamento: segmentado Pix / Cartão / Boleto.
   - Pix: QR 180px + texto + código copia-e-cola + "Copiar código" (→ "Código copiado ✓") + "Já paguei".
   - Cartão: número, validade, CVV, parcelas (1–3x sem juros), "Pagar R$ X".
   - Boleto: texto de prazo + "Gerar boleto".
   - Selo "Pagamento processado com segurança" (ícone cadeado).
4. Download: card central — ícone check-circle, "PAGAMENTO CONFIRMADO", aviso de e-mail, lista de itens com "Baixar", botão "Ir para minha conta" (cliente) ou "Voltar para a loja".

### 5. Login
Card blueprint central, max 440px, padding 36: "ENTRAR", texto, campos E-mail e Senha, erro inline (600, accent-900), botão primário Entrar, "Esqueci minha senha", bloco "Acesso de demonstração" (remover em produção).
Regra do protótipo: `admin@soter.dev` → papel admin; qualquer outro → cliente. **Em produção:** autenticação real (senha com hash / magic link), papel armazenado no usuário (`role: 'admin' | 'client'`), rotas `/admin/*` protegidas no servidor.

### 6. Área do cliente
Cabeçalho "Área do cliente" + "OLÁ, {primeiro nome}" + Sair. Abas:
- Meus projetos: "Adquiridos" (linha com miniatura, nome, "Pedido #N · comprado em data", Ver página, Baixar) e "Disponíveis para você" (cards dos projetos ainda não comprados com Detalhes/Comprar).
- Dúvidas: card "Enviar uma dúvida" (select: Dúvida geral + projetos; textarea; Enviar desabilitado se vazio; confirmação) + "Minhas perguntas" (tag Respondida [accent] / Aguardando resposta [outline], projeto, data, pergunta, bloco "Resposta da Sóter" com borda esquerda accent) + FAQ público.
- Perfil: Nome, E-mail, Salvar ("Dados salvos.").

### 7. Painel do administrador
Cabeçalho "Painel do administrador / PAINEL". 3 cards de métricas: Vendas, Receita, Dúvidas pendentes (valor 40px). Abas:
- Produtos: "+ Novo produto"; editor inline (card blueprint) com Nome, Preço, Tipo (Site/App), "Publicado na loja" (checkbox), Resumo, "O que está incluso — um item por linha", Salvar/Cancelar. Tabela: Produto, Tipo, Preço, Vendas, Status (tag Publicado/Oculto), Ver / Editar. Produtos ocultos não aparecem na loja.
- Dúvidas (n): cards pendentes com autor · projeto · data, pergunta, textarea de resposta, checkbox "Publicar também no FAQ do site" (padrão marcado), Responder. Lista "Respondidas" com tag "No FAQ do site" / "Só para o cliente" e ação "Publicar no FAQ" / "Tirar do FAQ".
- Vendas: tabela Pedido, Cliente (nome + e-mail), Projeto, Data, Valor.

## Interactions & Behavior
- Troca de tela rola para o topo. "Sobre" rola suavemente até a seção.
- Comprar = adiciona ao carrinho (sem duplicar) e abre checkout etapa 1.
- Concluir pagamento cria um pedido por item (e-mail do usuário logado ou do formulário) → aparece em "Meus projetos" e em Vendas.
- Desconto Pix de 5% (configurável).
- Responder dúvida muda status para respondida; se "publicar", entra no FAQ público (aba Dúvidas do produto + FAQ da conta).
- Layout fluido: grids com auto-fill/auto-fit, colunas colapsam abaixo de ~860px; tabelas com scroll horizontal.

## State / Data model
```
Product   { id, nome, tipo: 'Site'|'App', cat, preco, resumo, desc[], tech[{n,d}], incluso[], nota, aval, novo?, ativo }
Order     { oid, pid, email, cliente, data, valor }
Question  { id, pid|null, autor, email, q, a, status: 'pending'|'answered', publico, data }
User      { nome, email, role: 'admin'|'client' }
```
Endpoints sugeridos: `GET /products`, `POST/PATCH /admin/products`, `POST /checkout` (cria cobrança), webhook de pagamento → cria `Order` e libera download, `GET /me/orders`, `GET /downloads/:orderId` (URL assinada), `POST /me/questions`, `PATCH /admin/questions/:id`.

Configurações (props do protótipo): `pixDiscount` (bool), `showRatings` (bool).

## Assets
- Imagens: todas são placeholders (`<image-slot>`) — prints dos projetos (card + galeria de 4 por produto, último é vídeo) e foto do dono na seção Sobre. Aplicar duotone.
- Ícones Lucide inline: shopping-cart, arrow-right, check, check-circle, external-link, download, lock.
- Fontes: Barlow e Barlow Condensed (Google Fonts).

## Files
- `Soter Loja v2.dc.html` — protótipo completo (template + lógica + dados de exemplo)
- `_ds/.../styles.css` — tokens e classes do sistema Industry (`.btn`, `.card`, `.blueprint`, `.corner`, `.tag`, `.input`, `.field`, `.seg`, `.table`, `.nav`, `.duotone`)
- `support.js`, `_ds/.../_ds_bundle.js`, `image-slot.js` — runtime necessário para abrir o protótipo
