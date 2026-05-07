# Marcelle — Visão Geral do Projeto
> Documento de referência consolidada · Atualizado em abril de 2026

---

## 1. O que é o Marcelle

**Marcelle** é uma plataforma de acompanhamento de clientes desenvolvida para uma profissional (coach ou consultora) gerir toda a jornada de seus clientes em um único lugar — desde a chegada até a evolução contínua.

A plataforma substitui planilhas, e-mails soltos e ferramentas desconectadas por um sistema integrado onde a profissional e sua equipe têm controle total do ciclo de vida de cada cliente, e os clientes têm uma interface dedicada para acompanhar seu progresso.

**Usuários da plataforma:**
- **Super Admin (Marcelle)** — visão completa, criação de equipe e gestão estratégica
- **Colaboradores** — acesso configurável por permissão
- **Clientes** — portal próprio, mobile-first

---

## 2. Identidade e Posicionamento

**Nome:** Marcelle
**Design System:** Stitch
**Paleta:** Cream · Teal · Salmon — elegante, acolhedor, profissional
**Tom:** Próximo e especializado, sem ser clínico

### Evolução visual

| Versão | URL | Característica |
|--------|-----|---------------|
| V1 inicial | marcelle2026.netlify.app | Primeira exploração — tom e estrutura iniciais |
| V1 atual | effortless-raindrop-9cc1e1.netlify.app | Visual mais refinado, próximo da identidade final |

O caminho visual evoluiu em direção a uma linguagem mais próxima da identidade da profissional: quente, confiável, com boa tipografia e espaçamento generoso. O próximo passo é formalizar esse visual em um sistema de marca (logo + desdobramentos) que sirva tanto para o site quanto para a plataforma.

---

## 3. O que foi construído

A plataforma foi desenvolvida em 8 fases com um monorepo completo. Estado atual: **fases 1 a 8 implementadas em código**, com a plataforma funcional e pronta para entrar em produção com clientes reais.

### Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 + Tailwind CSS |
| Backend | Fastify 5 |
| Banco de dados | PostgreSQL 16 + Prisma ORM |
| Cache / Filas | Redis 7 + BullMQ |
| Auth | NextAuth v5 (JWT) |
| Storage | Cloudflare R2 |
| Email | Resend |
| Realtime | Pusher |
| Monorepo | Turborepo + pnpm |
| Deploy | Vercel (web) + Railway (api) |
| Erros | Sentry |

### Apps no monorepo

- `apps/web` — plataforma principal (admin + portal do cliente)
- `apps/api` — backend Fastify
- `apps/site` — site institucional / marketing

---

## 4. Funcionalidades da Plataforma

### Para a profissional (admin)

**Gestão de Clientes**
- Cadastro de novos clientes com envio automático de acesso por email
- Lista com filtros por fase do lifecycle, colaborador e status
- Perfil completo do cliente com tabs organizadas

**Anamnese**
- Builder de seções e perguntas personalizável
- Visualização consolidada de todas as respostas do cliente
- Upload de documentos pelo cliente

**Plano**
- Editor de blocos (Tiptap) com seções arrastáveis
- Sidebar com metas (CRUD inline)
- Compartilhamento controlado com o cliente
- Versionamento automático e histórico
- Export em PDF com branding Marcelle

**Tarefas**
- Três tipos: CHECK (checkbox), REFLEXÃO (texto), ENVIO (upload)
- Tarefas recorrentes com agendamento automático (BullMQ)
- Sistema de dúvidas: cliente abre → admin responde → thread visível
- Status automático para tarefas vencidas

**Hub Educacional**
- 8 trilhas com 5 materiais cada (40 conteúdos base)
- Tipos: artigo, vídeo embed, checklist interativo, PDF, reflexão
- Progresso por trilha com destaque na trilha mais relevante para a fase do cliente

**Dashboard Admin**
- KPIs: total de clientes ativos, tarefas pendentes, dúvidas abertas
- Clientes por fase do lifecycle
- Alerta de clientes inativos (sem engajamento > 7 dias)
- Gráfico de engajamento mensal

### Para o cliente

**Portal Mobile-First**
- Bottom nav mobile + header desktop
- Saudação personalizada ("Bom dia, [nome]")
- Progress ring do plano geral
- Cards das próximas tarefas (máx. 3)
- Próximo material na trilha em andamento

**Anamnese**
- Form multi-step responsivo com progresso visual por seção
- Auto-save a cada campo
- Upload de documentos

**Meu Plano**
- Visualização elegante (read-only) do plano compartilhado
- Progress ring de metas
- Download do PDF
- Timestamp da última atualização

**Aprender**
- Grid de trilhas com progresso
- Material com navegação prev/next
- Seção de comentários por conteúdo
- Checklist interativo que salva estado por cliente

**Notificações**
- Push (PWA com service worker)
- In-app em tempo real via Pusher (< 2s)
- Email para eventos críticos (< 30s)
- Opt-in/out por tipo de notificação

---

## 5. Lifecycle de Clientes

A plataforma gerencia os clientes ao longo de 5 estágios visuais distintos. O lifecycle determina quais trilhas educacionais são destacadas e como o dashboard admin prioriza alertas.

---

## 6. O que está pendente (caminho para produção)

### Testes
- Playwright E2E: fluxos completos de login, anamnese, plano e tarefas
- Vitest integration: API de tasks, clients, notifications
- Meta: 80% de cobertura nas camadas de serviço

### Performance
- Lighthouse > 90 em todos os critérios
- Core Web Vitals: LCP < 2.5s · CLS < 0.1 · INP < 200ms
- Paginação cursor-based em todas as listas longas

### Acessibilidade
- WCAG 2.1 AA nas telas principais
- Contraste verificado em todos os tokens
- Navegação por teclado funcional

### Produção
- Backup automático (Supabase daily)
- Rate limiting nas rotas críticas (auth, upload)
- Documentação de runbook (deploy, rollback, reset de senha)

### Dados
- Seed de dados demo com cliente fictício
- Conta da Marcelle (super_admin) criada e testada
- Todas as trilhas e materiais publicados

---

## 7. Marca: próximo passo — Logo e Desdobramentos v1

### Por que agora

A plataforma está funcional. O site institucional tem uma direção visual definida. O momento é criar a identidade formal de marca que amarre tudo — plataforma, site, comunicações e materiais.

### Princípios de marca (a partir do que foi construído)

- **Acolhedor sem ser casual** — a paleta cream/teal/salmon já comunica isso
- **Especializado sem ser clínico** — profissional, mas próximo
- **Moderno e atemporal** — sem tendências passageiras, com longevidade
- **Adaptável** — funciona em fundo claro, escuro, mobile e impresso

### Workflow de criação de logo com IA

#### Etapa 1 — Exploração de referências (Moodboard)

**Ferramentas:** Midjourney · Pinterest · Are.na
**O que fazer:** gerar variações de conceito antes de entrar em qualquer ferramenta de logo

Prompts sugeridos no Midjourney:
```
professional coaching brand logo, minimal, warm cream teal salmon palette,
clean sans-serif, geometric mark, white background --ar 1:1 --style raw
```
```
wellness financial advisor brand identity, logo variations, editorial feel,
warm palette, modern --ar 16:9
```

**Objetivo:** selecionar 2–3 direções de conceito (ex: tipográfico puro, marca + texto, ícone abstrato)

---

#### Etapa 2 — Geração de conceitos de logo

**Ferramenta principal: Ideogram** (melhor para logos com texto)
**Ferramenta alternativa: Recraft AI** (output vetorial nativo)

No **Ideogram**:
- Usar o modo "Design" ou "Logo"
- Prompt exemplo: `Minimalist logo for "Marcelle", professional coaching platform, warm teal and salmon color palette, clean typography, geometric accent mark, white background`
- Gerar 20–30 variações, selecionar as melhores 5

No **Recraft AI** (recraft.ai):
- Criar projeto com paleta exata (cream #F5F0E8 · teal #2D8B7A · salmon #E8856A)
- Solicitar variações de marca tipográfica e marca com ícone
- Exportar em SVG (Recraft entrega vetores prontos)

---

#### Etapa 3 — Refinamento em Figma

Com os SVGs ou imagens selecionadas:

1. **Vetorizar** (se necessário): importar no Figma, usar "Vectorize" ou limpar manualmente
2. **Tipografia**: definir fonte final (sugestões: DM Sans, Neue Haas Grotesk, Instrument Sans)
3. **Ajustar proporções**: garantir legibilidade em 16px e em 300px
4. **Criar as variações de logo:**
   - Horizontal (logo + texto lado a lado)
   - Vertical (logo sobre texto)
   - Ícone isolado (para favicon, app icon)
   - Versão monocromática (preto e branco)
   - Versão negativa (para fundo escuro)

---

#### Etapa 4 — Desdobramentos da identidade v1

**Prioridade alta (para lançamento):**
- [ ] Favicon 32×32 e 180×180 (Apple touch icon)
- [ ] Open Graph image (1200×630) para links no WhatsApp e redes sociais
- [ ] Header de email (600px wide)
- [ ] Splash screen do PWA
- [ ] Cabeçalho do PDF do plano financeiro

**Prioridade média (próximas semanas):**
- [ ] Template de stories (Instagram)
- [ ] Cartão digital / assinatura de email
- [ ] Apresentação de proposta (template de slides)

**Prioridade baixa (conforme necessidade):**
- [ ] Kit de marca para parceiros
- [ ] Papelaria digital (recibo, contrato)

---

#### Etapa 5 — Entrega de assets

Organização de pasta sugerida:
```
/marca
  /logo
    marcelle-logo-horizontal.svg
    marcelle-logo-vertical.svg
    marcelle-icon.svg
    marcelle-logo-mono.svg
    marcelle-logo-negativo.svg
  /tokens
    paleta.png
    tipografia.png
  /aplicacoes
    og-image.png
    favicon.ico
    email-header.png
    splash-pwa.png
```

---

## 8. Métricas de sucesso do produto (pós-lançamento)

| Métrica | Meta | Prazo |
|---------|------|-------|
| Clientes ativos na plataforma | 10 | Mês 2 |
| Taxa de conclusão de tarefas | > 70% | Mês 2 |
| Engajamento com trilhas | > 50% dos clientes | Mês 3 |
| Opt-in de push notifications | > 80% dos clientes | Mês 1 |
| NPS da plataforma | > 8 | Mês 3 |
| Uptime | > 99.5% | Contínuo |

---

## 9. Links e referências

| Recurso | URL |
|---------|-----|
| Site v1 inicial | https://marcelle2026.netlify.app/ |
| Site v1 atual | https://effortless-raindrop-9cc1e1.netlify.app/ |
| Repositório da plataforma | _/marcelle-platform_ |

---

*Documento gerado a partir dos arquivos de projeto em `/marcelle` · Pasta do projeto: Dropbox/_claude/marcelle*
