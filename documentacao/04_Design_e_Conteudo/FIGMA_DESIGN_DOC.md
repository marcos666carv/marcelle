# Marcelle Platform — Design Document para Figma Make

> Documentação completa de todas as telas, estados, fluxos e componentes.
> Referência primária: design dos arquivos `análise marcos/index.html` e `index.html` (Strategic Dashboard).
> Para uso no Figma Make (AI-to-design).

---

## 1. Design System

### 1.1 Paleta de Cores

Extraída dos arquivos existentes — fusão entre a proposta editorial e o dashboard.

| Token | Hex | Nome | Uso |
|-------|-----|------|-----|
| `color-bg` | `#F5F4F0` | Cream | Background principal de todas as telas |
| `color-bg-subtle` | `#EAE8E0` | Cream escuro | Cards, inputs, áreas recuadas |
| `color-teal` | `#0B3B32` | Deep Teal | Sidebar, botões primários, headers |
| `color-teal-light` | `#E8F0EE` | Teal claro | Hover, badges de teal |
| `color-salmon` | `#FF9EAA` | Salmon | Destaque, progresso, accents ativos, seleção |
| `color-salmon-subtle` | `#FFF0F2` | Salmon claro | Badges, backgrounds de alerta suave |
| `color-text` | `#1C1B1A` | Quase preto | Texto principal |
| `color-muted` | `#6B7280` | Cinza médio | Texto secundário, labels |
| `color-border` | `#E5E2D9` | Bege claro | Bordas de cards, separadores |
| `color-white` | `#FFFFFF` | Branco | Superfície de cards |
| `color-dark` | `#1C1B1A` | Dark | Footer, seção escura, dark mode |

**Estados**
| Estado | Cor |
|--------|-----|
| Success | `#10B981` (Emerald 500) |
| Warning | `#F59E0B` (Amber 500) |
| Error | `#EF4444` (Red 500) |
| Info | `#3B82F6` (Blue 500) |

### 1.2 Tipografia

| Token | Família | Peso | Tamanho | Uso |
|-------|---------|------|---------|-----|
| `type-display` | DM Sans | 700 | 40–96px | Títulos de seção, hero |
| `type-heading-xl` | DM Sans | 600 | 28–32px | Títulos de página |
| `type-heading-lg` | DM Sans | 600 | 20–24px | Títulos de card, modal |
| `type-heading-md` | DM Sans | 600 | 16–18px | Subtítulos, tab labels |
| `type-body-lg` | Inter | 400 | 16–18px | Corpo de texto principal |
| `type-body` | Inter | 400 | 14px | Texto padrão da interface |
| `type-body-sm` | Inter | 400 | 12px | Labels, captions, metadata |
| `type-label` | Inter | 600 | 10–11px | Labels uppercase com tracking |
| `type-mono` | Jetbrains Mono | 400 | 13px | Valores monetários, métricas |

**Letter spacing especial:** labels uppercase → `tracking: 0.12–0.15em`

### 1.3 Espaçamento (8pt grid)

```
4px   xs   — gaps mínimos, padding de badge
8px   sm   — gap entre elementos próximos
12px  md   — padding de input
16px  lg   — padding de card pequeno
20px  xl   — gap padrão entre componentes
24px  2xl  — padding de card padrão
32px  3xl  — padding de seção interna
40px  4xl  — margin entre seções
64px  5xl  — padding de página (desktop)
```

### 1.4 Raio de Borda

```
4px   — badges, tags pequenas
8px   — inputs, buttons pequenos
12px  — buttons, cards menores
16px  — cards padrão
20px  — cards maiores, modais
24px  — modais grandes, bottom sheets
999px — pills, avatars
```

### 1.5 Sombras

```
shadow-xs  — 0 1px 2px rgba(0,0,0,0.04) — cards flat
shadow-sm  — 0 4px 12px rgba(0,0,0,0.06) — cards elevados
shadow-md  — 0 8px 24px rgba(0,0,0,0.08) — dropdowns, tooltips
shadow-lg  — 0 16px 48px rgba(0,0,0,0.12) — modais
```

---

## 2. Componentes Base

### 2.1 Botões

| Variante | Cor fundo | Cor texto | Uso |
|---------|-----------|-----------|-----|
| `Primary` | `#0B3B32` | `#FFFFFF` | Ação principal |
| `Secondary` | `#FFFFFF` | `#0B3B32` | Ação secundária (com borda) |
| `Salmon` | `#FF9EAA` | `#0B3B32` | Destaque, confirmações |
| `Ghost` | `transparent` | `#1C1B1A` | Ações terciárias |
| `Danger` | `#FEE2E2` | `#DC2626` | Excluir, desativar |

**Tamanhos:** SM (h-8, px-3, text-xs) | MD (h-10, px-4, text-sm) | LG (h-12, px-6, text-base)
**Estados:** Default → Hover (opacity 90) → Active (scale 0.98) → Disabled (opacity 40) → Loading (spinner)

### 2.2 Inputs

Estrutura padrão:
- Label (Inter 12px, 600, uppercase, tracking wide, color-muted)
- Input (background color-bg-subtle, borda color-border, foco borda teal + ring teal/10)
- Helper text / Error message

**Variantes:**
- Text input
- Textarea
- Select dropdown (custom, não browser default)
- Currency input (prefix R$ em cor-muted, valor em DM Sans semibold)
- Date picker
- File upload (drag and drop)
- Scale 1–10 (slider visual com bolinha salmon)
- Toggle (switch)
- Checkbox (customizado com check em salmon)
- Radio group

### 2.3 Cards

**Card Base:** bg-white, borda color-border, shadow-xs, radius-16
**Card Elevated:** shadow-sm, hover → shadow-md, transition

Variantes:
- Card simples (título + conteúdo)
- Card com header colorido (teal ou salmon)
- Card de métrica (label + número grande + tendência)
- Card de tarefa (ícone tipo + título + prazo + status)
- Card de trilha (cover + título + progresso)
- Card de cliente (avatar + nome + fase lifecycle + badge status)

### 2.4 Badges / Tags

```
Salmon   — #FFF0F2 / #FF9EAA     → Urgente, Ativo, Destaque
Teal     — #E8F0EE / #0B3B32     → Admin, Concluído
Amber    — #FEF3C7 / #92400E     → Pendente, Em andamento
Red      — #FEE2E2 / #DC2626     → Vencido, Erro
Green    — #D1FAE5 / #065F46     → Sucesso, Feito
Gray     — #F3F4F6 / #6B7280     → Inativo, Rascunho
```

### 2.5 Avatars

- Circular, com iniciais em fallback
- Tamanhos: 24px, 32px, 40px, 48px, 64px
- Cores de fundo por inicial (hash do nome → cor pastel)
- Com badge de status (ponto verde = online, cinza = offline)

### 2.6 Progress Ring

- SVG circular, stroke salmon
- Número percentual em DM Sans bold no centro
- Track em color-bg-subtle
- Tamanhos: 48px, 64px, 80px

### 2.7 Lifecycle Phase Indicator

5 fases, visual de "trilha" horizontal (dots conectados por linha):
1. ● Caos Silencioso — vermelho pastel
2. ● Clareza Inicial — âmbar
3. ● Construção Ativa — azul
4. ● Expansão & Liberdade — roxo
5. ● Plenitude — verde

Fase ativa: filled, salmon border ring. Fases futuras: outline. Passadas: teal filled.

### 2.8 Notification Bell

- Ícone lucide Bell
- Badge vermelho com número (se > 9 → "9+")
- Dropdown: lista de notificações com ícone tipo + texto + timestamp

---

## 3. Layout & Navegação

### 3.1 Admin Layout (Desktop)

```
┌──────────────────────────────────────────────────────┐
│ Sidebar (240px, bg-teal)    │  Main Content Area      │
│                             │  (flex-1, overflow-y)   │
│  ┌─────────────────────┐    │                         │
│  │ [M] Marcelle        │    │  ┌──────────────────┐   │
│  │     Breciani        │    │  │ Page Header      │   │
│  │     Admin           │    │  │ Title + Actions  │   │
│  └─────────────────────┘    │  └──────────────────┘   │
│                             │                         │
│  ● Dashboard                │  Page content...        │
│  ● Clientes                 │                         │
│  ● Conteúdo                 │                         │
│  ● Equipe (superadmin)      │                         │
│                             │                         │
│  ─────────────────────      │                         │
│  [Avatar] Marcelle  [>|]    │                         │
│  [Sair]                     │                         │
└──────────────────────────────────────────────────────┘
```

### 3.2 Admin Layout (Mobile)

- Header: [≡ Menu] [Logo MB] [🔔] [Avatar]
- Sidebar: drawer slide-in da esquerda, overlay semitransparente
- Content: fullwidth, padding 20px

### 3.3 Cliente Layout (Desktop)

```
┌──────────────────────────────────────────────────────┐
│ Header top (bg-white, sticky)                        │
│ [MB logo] [Início][Tarefas][Aprender][Meu Plano] [⊕]│
│                                              [Avatar] │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Page content (max-w-2xl centrado, padding 32px)     │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### 3.4 Cliente Layout (Mobile — PWA)

```
┌─────────────────────┐
│ Page content        │
│ (padding bottom 72) │
│                     │
│                     │
├─────────────────────┤
│ Bottom Nav (fixed)  │
│ [🏠][✓][📚][👤]     │
└─────────────────────┘
```

---

## 4. Telas — Admin

### TELA A01 — Login

**URL:** `/login`
**Tipo:** Tela centralizada, fundo cream

**Layout:**
```
Centro vertical e horizontal
  ├── Logo: quadrado teal com "MB" branco, DM Sans bold
  ├── Título: "Marcelle Breciani" — DM Sans 22px semibold teal
  ├── Subtítulo: "Planejamento Financeiro Humanizado" — Inter 12px muted
  ├── Card branco (radius 20, shadow-sm, padding 32)
  │     ├── "Entrar na plataforma" — DM Sans 16px semibold
  │     ├── Input Email
  │     ├── Input Senha (com toggle show/hide)
  │     └── Button Primary "Entrar" (full width)
  └── Footer: "© 2025 Marcelle Breciani"
```

**Estados:**
- Default
- Loading (botão com spinner, inputs disabled)
- Erro (toast top-right vermelho: "Credenciais inválidas")

---

### TELA A02 — Dashboard Admin

**URL:** `/dashboard`
**Tipo:** Overview do negócio

**Layout:**
```
Page Header
  ├── "Bom dia, Marcelle 👋"
  └── Data atual

KPI Row (4 cards, grid 4 cols)
  ├── [🧑] Clientes ativos — número grande
  ├── [✓] Tarefas pendentes — número
  ├── [?] Dúvidas abertas — número
  └── [📊] Engajamento médio — percentual

Seção: Clientes por Fase (tabela)
  ├── Fase | Clientes | % Engajamento | Ação
  ├── O Caos Silencioso — badge vermelho pastel
  ├── Clareza Inicial — badge âmbar
  ├── Construção Ativa — badge azul
  ├── Expansão & Liberdade — badge roxo
  └── Plenitude — badge verde

Seção: Atenção Necessária (coluna direita ou bottom)
  ├── Clientes sem atividade há +7 dias
  ├── Dúvidas sem resposta
  └── Tarefas vencidas hoje
```

---

### TELA A03 — Lista de Clientes

**URL:** `/clientes`
**Tipo:** Tabela com filtros

**Layout:**
```
Page Header
  ├── Título "Clientes" + contador (ex: "12 clientes")
  ├── [Barra de busca] — placeholder "Buscar por nome ou email..."
  ├── [Filtro: Fase] dropdown
  ├── [Filtro: Colaborador] dropdown (super admin)
  └── Button Primary [+ Novo Cliente]

Tabela
  ├── Colunas: Avatar+Nome | Fase | Tarefas Pendentes | Última Atividade | Status | Ações
  ├── Linha de cliente:
  │     ├── Avatar (iniciais) + Nome + email (muted)
  │     ├── Badge de fase lifecycle
  │     ├── Número de tarefas pendentes (badge salmon se > 0)
  │     ├── "Há X dias" (vermelho se > 7)
  │     ├── Badge status onboarding
  │     └── [Ver] botão ghost
  ├── Empty state: ícone Users + "Nenhum cliente ainda"
  └── Paginação: botões prev/next + "Mostrando 1-10 de 24"
```

---

### TELA A04 — Cadastro de Novo Cliente (Modal / Drawer)

**Trigger:** Botão "+ Novo Cliente" na tela A03
**Tipo:** Drawer lateral (slide from right, 480px) OU Modal centrado

**Layout:**
```
Header do drawer
  ├── "Novo Cliente"
  └── [X fechar]

Formulário em seções

─── Dados Pessoais ────────────────
  ├── Input: Nome completo* (required)
  ├── Input: Email* (required)
  ├── Input: Telefone/WhatsApp
  ├── Input: Data de nascimento
  └── Input: Profissão/Ocupação

─── Atribuição ─────────────────────
  ├── Select: Colaborador responsável
  └── Select: Fase do lifecycle
        └── Dropdown com as 5 fases (ícone + nome + descrição breve)

─── Informações Financeiras ────────
  ├── Input: Renda mensal (currency)
  └── Textarea: Observações iniciais (notas internas)

Footer do drawer
  ├── Button Secondary "Cancelar"
  └── Button Primary "Criar cliente"

Estados:
  - Loading: campos disabled + spinner no botão
  - Erro de validação: campo vermelho + mensagem
  - Sucesso: drawer fecha + toast "Cliente criado" + linha aparece na tabela
```

---

### TELA A05 — Perfil do Cliente (Admin view)

**URL:** `/clientes/[id]`
**Tipo:** Página com tabs

**Header do perfil:**
```
Avatar grande (64px) + Nome + email + badge lifecycle + badge onboarding
[Editar perfil] [↗ Ver como cliente]

Tabs: [Visão Geral] [Anamnese] [Plano] [Tarefas] [Educação]
```

#### Tab: Visão Geral
```
Grid 2 colunas:

Coluna Esquerda:
  ├── Card: Métricas
  │     ├── Tarefas concluídas / total
  │     ├── Trilhas em progresso
  │     ├── Última atividade
  │     └── Data de início
  ├── Card: Metas (do plano)
  │     └── Lista de metas com progress bar
  └── Card: Notas internas (só admin)
        └── Textarea editável

Coluna Direita:
  ├── Card: Próximas tarefas
  │     └── Lista de 3 próximas tarefas com prazo
  ├── Card: Fase do Lifecycle
  │     └── Visual das 5 fases com fase atual destacada
  └── Card: Colaborador responsável
        └── Avatar + nome + [Reatribuir]
```

#### Tab: Tarefas
→ Ver TELA A06

#### Tab: Anamnese
→ Ver TELA A08

#### Tab: Plano
→ Ver TELA A10

---

### TELA A06 — Gestão de Tarefas do Cliente (Admin)

**Contexto:** Tab "Tarefas" na TELA A05

**Layout:**
```
Header
  ├── Título "Tarefas de [Nome do Cliente]"
  └── Button Primary [+ Nova Tarefa]

Filtros em linha
  └── Pills: [Todas] [Pendentes] [Concluídas] [Vencidas] [Aguardando Resposta]

Lista de tarefas
  └── TaskCard (para cada tarefa)
```

**TaskCard (Admin view):**
```
┌─────────────────────────────────────────────────┐
│ [ícone tipo]  Título da tarefa         [status] │
│               Descrição curta                    │
│               📅 Prazo: DD/MM/AAAA              │
│               👤 Criado por: Admin              │
│                                                  │
│ [dúvida aberta badge]     [Editar] [Excluir]    │
└─────────────────────────────────────────────────┘
```

Ícones por tipo:
- ✓ CHECK — círculo com check
- ⚡ ACTION — raio
- 💭 REFLECTION — balão de fala
- 📎 UPLOAD — clipe
- 📖 READING — livro

---

### TELA A07 — Modal: Nova Tarefa / Editar Tarefa

**Trigger:** Botão "+ Nova Tarefa" na TELA A06
**Tipo:** Modal centrado (480px, max-h 90vh, overflow scroll)

**Layout:**
```
Modal Header
  ├── "Nova Tarefa" / "Editar Tarefa"
  └── [X]

── Informações Básicas ──────────────────
  ├── Input: Título da tarefa* (required)
  ├── Textarea: Descrição / instruções

── Tipo de Tarefa ───────────────────────
  └── SELETOR VISUAL DE TIPO (grid 2×3 ou 5 opções)
      ┌──────────────────────────────────────┐
      │  [ ✓ CHECK ]     [ ⚡ AÇÃO ]         │
      │    Confirmação     Ação concreta      │
      │                                      │
      │  [ 💭 REFLEXÃO ] [ 📎 UPLOAD ]       │
      │    Resposta texto  Enviar documento   │
      │                                      │
      │  [ 📖 LEITURA ]                      │
      │    Conteúdo para ler                 │
      └──────────────────────────────────────┘
      ► Selecionado: borda salmon + bg salmon-subtle + check no canto

── Configuração ─────────────────────────
  ├── Date picker: Data de vencimento
  ├── Select: Prioridade (LOW / MEDIUM / HIGH / URGENT)
  │           ícone + cor: cinza / âmbar / laranja / vermelho
  ├── Toggle: Tarefa recorrente?
  │     └── Se sim → mostra:
  │           Select: Frequência (Semanal / Mensal)
  │           Input: Intervalo (ex: "a cada X semanas")
  └── File input: Material de apoio (link ou upload)

Modal Footer
  ├── Button Secondary "Cancelar"
  └── Button Primary "Salvar tarefa"
```

---

### TELA A08 — Anamnese (Admin Builder)

**Contexto:** Tab "Anamnese" na TELA A05

**Estado 1 — Anamnese não criada:**
```
Empty state
  ├── Ícone clipboard
  ├── "Anamnese não criada ainda"
  ├── "Crie a anamnese para enviar ao cliente ou preencher juntos."
  └── Button Primary [Criar Anamnese]
```

**Estado 2 — Anamnese criada (admin view):**
```
Status badge: [Rascunho / Enviada / Em preenchimento / Concluída / Validada]

Seções (accordion ou lista)
  ├── Seção 1: "Contexto de Vida"
  │     ├── Pergunta 1: texto (resposta do cliente ou vazia)
  │     └── ...
  └── Botão [+ Adicionar Seção]

Rodapé
  └── [Compartilhar com cliente] → muda status para "Enviada"
```

---

### TELA A09 — Equipe (Gestão de Colaboradores)

**URL:** `/equipe`
**Acesso:** Apenas Super Admin

**Layout:**
```
Page Header
  ├── Título "Equipe"
  └── Button Primary [+ Adicionar Colaborador]

Tabela de colaboradores
  ├── Colunas: Avatar+Nome | Email | Permissões | Clientes | Status | Ações
  ├── Linha:
  │     ├── Avatar (iniciais, cor teal) + Nome + email
  │     ├── Tags de permissões (max 3 visíveis + "+N")
  │     ├── Número de clientes atribuídos
  │     ├── Badge Ativo/Inativo
  │     └── [⚙ Permissões] [🚫 Desativar]
  └── Empty state com ícone Users
```

**Modal: Adicionar / Editar Colaborador:**
```
Input: Nome
Input: Email
─── Permissões ────────────────────────
Checklist visual:
  ☑ Gerenciar clientes       ☐ Gerenciar equipe
  ☑ Gerenciar tarefas        ☑ Ver métricas
  ☑ Gerenciar planos         ☐ Gerenciar conteúdo
```

---

### TELA A10 — Plano Financeiro (Admin Editor)

**Contexto:** Tab "Plano" na TELA A05

**Layout:**
```
Toolbar de ações
  ├── Status pill (dropdown): [Rascunho ▾]
  ├── Toggle: [👁 Compartilhar com cliente]
  ├── [Histórico de versões] (dropdown)
  └── [↓ Exportar PDF]

Editor de blocos (Tiptap-style)
  ├── Título editável grande (DM Sans, placeholder "Plano Financeiro de...")
  ├── Blocos de texto rico (headings, bullets, bold)
  └── [+ Adicionar bloco]

Sidebar direita: Metas
  ├── "Metas" header + [+ Nova meta]
  └── Meta card:
        ├── Ícone categoria (casa, viagem, etc)
        ├── Título
        ├── Progress bar salmon com valor/total
        └── Prazo badge
```

**Modal: Nova Meta:**
```
Input: Título da meta*
Select: Categoria (ícone + nome)
  ├── 🛡 Reserva de Emergência
  ├── 💳 Quitação de Dívidas
  ├── 📈 Investimento
  ├── 🏠 Imóvel
  ├── ✈ Viagem
  ├── 🌿 Aposentadoria
  ├── 🎓 Educação
  └── ★ Outro
Input: Valor alvo (R$)
Input: Valor atual (R$)
Date picker: Data alvo
```

---

### TELA A11 — Hub de Conteúdo (Admin)

**URL:** `/conteudo`

**Layout:**
```
Page Header
  ├── Título "Conteúdo"
  └── Button Primary [+ Novo Material]

Tabs: [Trilhas] [Todos os materiais]

─── Aba Trilhas ─────────────────────────
Grid de trilhas (2 colunas desktop):
  └── TrackCard:
        ├── Cover color (teal ou salmon gradient)
        ├── Título da trilha
        ├── "X materiais"
        ├── Toggle Público/Privado
        └── [Editar] [Ver]

─── Aba Materiais ───────────────────────
Tabela
  ├── Título | Trilha | Tipo | Status | Publicado em | Ações
  └── Filtros: trilha, tipo, público/privado
```

---

## 5. Telas — Cliente

### TELA C01 — Início (Dashboard Cliente)

**URL:** `/inicio`

**Layout:**
```
Saudação
  ├── "Bom dia, [Nome] 👋"
  └── Subtítulo suave: "Aqui está o seu progresso hoje."

── Seção: Progresso do Plano ─────────
Card com progress ring grande (80px, salmon)
  ├── "Progresso do Plano"
  ├── % completado (metas concluídas)
  └── Sub: "X de Y metas atingidas"

── Seção: Próximas Tarefas ──────────
Título "Para você fazer" + [Ver todas →]
Lista de 3 tarefas mais urgentes
  └── TaskCard (cliente view) — ver TELA C02

── Seção: Continue Aprendendo ────────
Card da trilha em andamento
  ├── Título da trilha
  ├── Progress bar
  └── "Próximo: [título do material]" + [Acessar →]

── Seção: Atualizações ───────────────
Feed de notificações recentes (3 itens)
  └── "[Ícone] [Texto] · [tempo]"
```

---

### TELA C02 — Tarefas (Cliente)

**URL:** `/tarefas`

**Layout:**
```
Page Header
  └── "Minhas Tarefas"

Tabs com contador:
  [Pendentes (X)] [Concluídas] [Vencidas]

Lista de TaskCards (cliente view)
```

**TaskCard — Cliente view:**
```
┌───────────────────────────────────────┐
│ [ícone tipo]  Título da tarefa        │
│               Descrição              │
│                                       │
│ 📅 Vence em X dias      [URGENTE]    │
│                                       │
│ ─────────────── ação por tipo ─────── │
│ CHECK:      [☐ Marcar como feito]    │
│ REFLECTION: [Escrever resposta...]   │
│ UPLOAD:     [📎 Enviar arquivo]      │
│ READING:    [📖 Acessar material]    │
│ ACTION:     [☐ Concluir ação]        │
│                                       │
│              [❓ Tenho uma dúvida]   │
└───────────────────────────────────────┘
```

**Cores de prazo:**
- +7 dias: cinza
- 3–7 dias: âmbar
- 1–2 dias: laranja
- Vencida: vermelho

---

### TELA C03 — Detalhe de Tarefa + Dúvida

**URL:** `/tarefas/[id]`

**Layout:**
```
Back link "← Tarefas"

Header da tarefa
  ├── [ícone tipo grande] Tipo: CHECK / AÇÃO / etc
  ├── Título (DM Sans, 24px)
  ├── Descrição completa
  └── Badges: prazo + prioridade

Material de apoio (se houver)
  └── Card com link externo ou PDF embed

Área de resposta
  └── [Por tipo — igual ao TaskCard mas expandido]

── Dúvidas ─────────────────────────────
Seção colapsável "Suas dúvidas (X)"

Thread de dúvida:
  ├── [Você] "Texto da dúvida" · 12/03
  ├── [Marcelle] "Resposta da admin" · 13/03
  └── Badge: [Resolvida] ou [Aguardando resposta]

Input nova dúvida:
  ├── Textarea "Descreva sua dúvida..."
  └── Button Salmon [Enviar dúvida]
```

---

### TELA C04 — Aprender (Hub Educacional)

**URL:** `/aprender`

**Layout:**
```
Page Header
  ├── "Aprender"
  └── "Seu desenvolvimento financeiro."

── Trilha em destaque ────────────────
Card largo (full width, bg-teal)
  ├── Label: "Em andamento"
  ├── Título da trilha
  ├── Progress bar branca
  └── Button branco [Continuar]

── Todas as Trilhas ──────────────────
Título "Escolha uma trilha"
Grid 2 colunas (mobile: 1 col)
  └── TrackCard (cliente view):
        ├── Cover (cor sólida ou gradiente por trilha)
        ├── Título da trilha
        ├── "X materiais"
        ├── Progress bar (% concluído)
        └── Badge: [Nova] se < 7 dias / [Em andamento] / [Concluída ✓]
```

**Cores das trilhas:**
```
Aposentadoria       — Teal
Compra de Imóvel    — Blue
Viagem              — Amber
Quitação de Dívidas — Red
Partilha de Bens    — Purple
Educação Base       — Green
Mindset & Dinheiro  — Pink (salmon)
Cases Reais         — Dark (1C1B1A)
```

---

### TELA C05 — Trilha de Conteúdo

**URL:** `/aprender/[slug]`

**Layout:**
```
Back link "← Aprender"

Cover da trilha (full width, 200px height, cor da trilha)
  ├── Título (DM Sans 28px, branco)
  └── "X de Y materiais concluídos"

Progress bar salmon (full width, 8px)

Lista de materiais (ordenados)
  └── ContentRow:
        ├── [número ordinal]
        ├── [ícone tipo: artigo/vídeo/checklist/template/case/reflexão]
        ├── Título do material
        ├── Tipo badge
        └── Status: ○ Não iniciado | ◑ Em andamento | ✓ Concluído
              ► ✓ preenchido com salmon
```

---

### TELA C06 — Material de Conteúdo

**URL:** `/aprender/[slug]/[id]`

**Layout por tipo:**

**ARTIGO:**
```
Back + Breadcrumb
Título (DM Sans 28px)
Meta: tipo + tempo de leitura
Corpo em rich text (Inter, line-height 1.7)
Seção de comentários
Botão [✓ Marcar como concluído]
[← Anterior]  [Próximo →]
```

**VÍDEO:**
```
Embed (16:9, radius 12)
Título + Descrição
Comentários
Botão [✓ Marcar como concluído]
```

**CHECKLIST:**
```
Título
Instrução
Lista de itens com checkbox interativo
Progress: "X de Y itens"
Botão [✓ Concluir checklist] (aparece quando todos marcados)
```

**REFLEXÃO:**
```
Título
Pergunta(s) em destaque (DM Sans, itálico, fundo cream)
Textarea grande: "Escreva sua reflexão..."
Botão [Salvar reflexão]
Nota: "Sua resposta fica guardada no seu perfil."
```

**TEMPLATE:**
```
Título + Descrição
Preview do PDF (se possível)
Button Salmon [↓ Baixar template]
```

**CASE STUDY:**
```
Label: "Caso Real" (badge salmon)
Título
Seções: Contexto | Desafio | Processo | Resultado
Bloco de destaque: métrica principal (ex: "Rentabilidade triplicada")
Reflexão: "O que você pode aprender com este caso?"
```

---

### TELA C07 — Meu Plano (Cliente)

**URL:** `/meu-plano`

**Layout:**
```
Page Header
  ├── "Meu Plano Financeiro"
  └── "Última atualização: DD/MM/AAAA"

── Metas ────────────────────────────
Título "Suas Metas"
Lista de GoalCards:
  └── GoalCard:
        ├── Ícone da categoria (colorido)
        ├── Título da meta
        ├── Progress bar (salmon)
        ├── Valor atual / Valor alvo (DM Sans mono)
        └── Prazo + badge status

── Plano ─────────────────────────────
Conteúdo do plano (read-only, rich text formatado)
Seções com títulos bem destacados

── Ações ─────────────────────────────
Button ghost [↓ Baixar PDF do Plano]
```

---

## 6. Fluxos de Usuário

### 6.1 Fluxo Admin — Onboarding de Novo Cliente

```
[A03 Lista] → [Clica "+ Novo Cliente"]
  → [A04 Drawer Criar Cliente] → preenche dados → [Criar]
  → Toast "Cliente criado" + Redireciona para [A05 Perfil do Cliente]
  → Tab Anamnese → [Criar Anamnese]
  → Configura seções e perguntas
  → [Compartilhar com cliente]
  → Sistema envia notificação ao cliente
  → Cliente preenche anamnese
  → Admin valida
  → Admin cria Plano [A10]
  → Admin compartilha plano com cliente
  → Admin cria primeiras tarefas [A07]
```

### 6.2 Fluxo Admin — Criar Tarefa

```
[A05 Perfil] → Tab Tarefas → [+ Nova Tarefa]
  → [A07 Modal Nova Tarefa]
  → Título + Descrição
  → SELETOR DE TIPO (visual, obrigatório)
  → Prazo + Prioridade
  → Toggle recorrência (opcional)
  → [Salvar tarefa]
  → Toast "Tarefa criada" + Aparece na lista
  → Cliente recebe push notification
```

### 6.3 Fluxo Cliente — Completar Tarefa

```
Push notification → Abre app → [C01 Início]
  → Vê tarefa pendente → Clica
  → [C02 Tarefas] ou [C03 Detalhe]
  → Executa ação por tipo (check / texto / upload)
  → Confirma
  → Toast "Tarefa concluída!" (salmon)
  → Progresso atualizado no [C01]
  → Admin recebe notificação
```

### 6.4 Fluxo Cliente — Abrir Dúvida

```
[C03 Detalhe de Tarefa]
  → Clica [❓ Tenho uma dúvida]
  → Textarea aparece / expande
  → Escreve dúvida
  → [Enviar dúvida]
  → Admin recebe notificação
  → Admin responde no painel
  → Cliente recebe push: "Sua dúvida foi respondida"
  → Cliente vê resposta na thread [C03]
```

### 6.5 Fluxo Cliente — Trilha Educacional

```
[C01 Início] → Card "Continue Aprendendo" → [Continuar]
  → [C05 Trilha]
  → Clica em material
  → [C06 Material]
  → Lê / assiste / preenche
  → [✓ Marcar como concluído]
  → Progress bar da trilha avança
  → "Próximo material" sugerido
```

---

## 7. Estados Especiais

### 7.1 Empty States

| Tela | Ícone | Mensagem principal | Ação |
|------|----|------|------|
| Lista de clientes vazia | Users | "Nenhum cliente ainda" | [+ Criar primeiro cliente] |
| Tarefas pendentes vazia | CheckSquare | "Nada pendente! Você está em dia." | — |
| Tarefas (cliente) vazia | Sparkles | "Aguardando novas tarefas da Marcelle" | — |
| Anamnese não criada | ClipboardList | "Anamnese não criada" | [Criar Anamnese] |
| Plano não criado | FileText | "Plano não criado" | [Criar Plano] |
| Hub vazio | BookOpen | "Conteúdo em breve" | — |

### 7.2 Loading States

- Skeleton screens (animated pulse, cream-200)
- Spinner no botão ao submeter form
- Tabelas: 5 linhas skeleton
- Cards: shape do card em skeleton

### 7.3 Toast Notifications

| Tipo | Cor | Ícone | Exemplos |
|------|-----|-------|---------|
| Sucesso | Verde | ✓ | "Cliente criado", "Tarefa concluída" |
| Erro | Vermelho | ✗ | "Credenciais inválidas", "Erro ao salvar" |
| Info | Azul | ℹ | "Plano compartilhado com cliente" |
| Aviso | Âmbar | ⚠ | "Tarefa vencida há 3 dias" |

Posição: top-right. Duração: 4s. Botão fechar incluído.

---

## 8. Componentes Específicos

### 8.1 Seletor de Tipo de Tarefa

**Descrição:** O elemento mais importante da criação de tarefas. Deve ser visual e intuitivo.

```
Grid 2×3 (ou 5 botões em wrap)
Cada opção:
┌────────────────────────┐
│  [ícone 24px]          │
│  NOME DO TIPO          │
│  Descrição breve       │
│                   [✓]  │ (quando selecionado)
└────────────────────────┘

Estado padrão:  borda color-border, bg-white
Estado hover:   borda teal-200, bg-teal-50
Estado ativo:   borda salmon, bg-salmon-subtle, check salmon no canto
```

Tipos:
```
✓ CHECK      — "Confirmação simples. Cliente marca como feito."
⚡ AÇÃO       — "Ação concreta com prazo. Ex: Abrir conta, cancelar cartão."
💭 REFLEXÃO  — "Pergunta para o cliente responder em texto."
📎 ENVIO      — "Cliente deve enviar documento ou comprovante."
📖 LEITURA   — "Material para ler ou assistir. Pode ser um conteúdo da plataforma."
```

### 8.2 Lifecycle Phase Selector (Admin)

**Usado em:** Criar/editar cliente, perfil do cliente

```
Componente visual horizontal (ou dropdown em mobile):

○ → ○ → ○ → ● → ○
1    2    3    4    5

Cada dot:
  - Número da fase
  - Cor associada
  - Tooltip com nome ao hover
  - Fase ativa: filled salmon + escala maior
```

### 8.3 Priority Badge

```
LOW     — #F3F4F6 / #6B7280  — "Baixa"
MEDIUM  — #FEF3C7 / #92400E  — "Média"
HIGH    — #FED7AA / #9A3412  — "Alta"
URGENT  — #FEE2E2 / #DC2626  — "Urgente"
```

### 8.4 Notification Bell Dropdown

```
[🔔] + badge número

Dropdown (240px):
  Header: "Notificações" + [Marcar todas como lidas]

  Item de notificação:
    ├── [ícone tipo] [ponto azul se não lida]
    ├── Texto da notificação
    └── Tempo relativo: "há 5 min", "há 2h", "Ontem"

  Footer: [Ver todas as notificações →]
```

---

## 9. Referências Visuais do Design Existente

### Do arquivo `análise marcos/index.html` (proposta editorial):

**Usar como referência para:**
- Tom visual geral (clean, editorial, respira bem)
- Tipografia: DM Sans + Inter como par principal
- Paleta: cream (#F5F4F0) como base, teal (#1C1B1A → migrar para #0B3B32), accent suave
- Espaçamento generoso — não encher de elementos
- Labels uppercase com letter-spacing exagerado (classe `.tracking-widest-extra`)
- Seções com `hairline` (1px, 15% opacity) como separadores
- Cards de depoimento com fundo `bg-brand-light/50` arredondado

**Patterns diretos:**
- Hero: texto muito grande + subtítulo leve
- Grid 12 colunas com numeração `01.` `02.` `03.`
- Quote blocks: borda esquerda 2px accent + fundo suave
- Seção escura (#1C1B1A) com texto claro para "O Caminho" (etapas)
- Depoimentos em scroll horizontal com snap

### Do arquivo `index.html` (Strategic Dashboard):

**Usar como referência para:**
- Header sticky com blend de cores (light/dark por tab)
- Navegação em pill (rounded-full, fundo translúcido)
- Cards com gradiente animado no hover
- Estrutura de tabs internas (Flywheel / Lifecycle / Planner / Social)
- Action plan com checkboxes + time estimate + link de entrega
- Kanban de conteúdo social por categoria
- Modal de detalhe com copy de post

**Cores exatas do dashboard:**
- Background geral light: `#F2F0E9`
- Cor principal: `#0B3B32`
- Accent principal: `#FF9EAA`
- Card: `#FFFFFF`
- Border: `#E5E2D9`
- Text muted: `#6B7280`

---

## 10. Mapa Completo de Telas (Figma Pages sugeridas)

### Page 1: Design System
- Colors
- Typography
- Spacing
- Icons (lucide subset)
- Components: Buttons, Inputs, Badges, Cards, Progress
- Dark variants

### Page 2: Auth
- A01 — Login (default, loading, error)

### Page 3: Admin — Global
- A02 — Dashboard
- A03 — Lista de Clientes (com filtros + empty state)
- A09 — Equipe

### Page 4: Admin — Cliente
- A04 — Modal Novo Cliente
- A05 — Perfil do Cliente (todas as tabs)
- A06 — Lista de Tarefas (admin view)
- A07 — Modal Nova/Editar Tarefa (com seletor visual)
- A08 — Anamnese (admin builder)
- A10 — Editor de Plano
- A11 — Hub de Conteúdo

### Page 5: Cliente — Dashboard
- C01 — Início
- C07 — Meu Plano

### Page 6: Cliente — Tarefas
- C02 — Lista de Tarefas
- C03 — Detalhe de Tarefa + Thread de dúvida

### Page 7: Cliente — Educação
- C04 — Hub (lista de trilhas)
- C05 — Trilha
- C06 — Material (todas as 6 variantes por tipo)

### Page 8: Mobile — Admin
- A02, A03, A04, A05, A07 em viewport 390px

### Page 9: Mobile — Cliente (PWA)
- C01, C02, C03, C04, C05, C06, C07 em viewport 390px

### Page 10: States & Micro-interactions
- Empty states
- Loading skeletons
- Toast notifications
- Modals (abertos e fechados)
- Hover states de botões
- Seletor de tipo de tarefa (todos os estados)

---

## 11. Prompts sugeridos para Figma Make

Para usar no Figma Make com AI, sugestões de prompts por tela:

**Design System:**
```
Create a minimal design system for a financial planning platform called "Marcelle Platform".
Color palette: cream #F5F4F0, deep teal #0B3B32, salmon #FF9EAA, text #1C1B1A, muted #6B7280, border #E5E2D9.
Typography: DM Sans for headings (bold 600-700), Inter for body (400-500).
Style: clean, editorial, lots of whitespace, no harsh gradients. Inspired by luxury editorial design.
Components needed: Primary button (teal), Secondary button (outlined), input fields, badges in 6 color variants, cards with subtle borders, progress bars in salmon.
```

**Admin Dashboard:**
```
Create an admin dashboard screen for a financial planning platform.
Background: #F5F4F0 cream. Sidebar: #0B3B32 deep teal (240px, fixed left).
Sidebar has: logo "MB" in white square, nav items with lucide icons: Dashboard, Clientes, Conteúdo, Equipe. Bottom has user avatar and logout.
Main content: 4 KPI cards (white background, subtle border), then a table of clients sorted by lifecycle phase.
Each client row shows: avatar with initials, name+email, lifecycle phase badge (5 colored variants), pending tasks count, last activity.
Style: minimal, editorial, generous spacing. No gradients.
```

**Task Creation Modal:**
```
Design a task creation modal for a financial planning platform.
Modal size: 480px wide, centered, dark overlay background.
Title: "Nova Tarefa" with X close button.
Fields:
1. Text input for task title (label uppercase tracking-wide)
2. Textarea for description
3. TASK TYPE SELECTOR — visual grid of 5 options with icons and labels: CHECK (circle-check icon, "Confirmação simples"), AÇÃO (zap icon, "Ação concreta"), REFLEXÃO (message-circle, "Pergunta reflexiva"), ENVIO (paperclip, "Enviar documento"), LEITURA (book-open, "Conteúdo educativo"). Selected state: salmon border + soft salmon background + checkmark.
4. Date picker for deadline
5. Priority selector: LOW/MEDIUM/HIGH/URGENT with color indicators
6. Recurrence toggle
Cancel and "Salvar tarefa" buttons at bottom.
Colors: teal #0B3B32 primary, salmon #FF9EAA for selected states, cream #F5F4F0 backgrounds.
```

**Cliente Task View:**
```
Create a task card component for a financial planning client interface.
Mobile-first, max-width 640px, clean white card with subtle border on cream background.
Card shows: task type icon (colored), task title (DM Sans semibold), description (Inter light), deadline with urgency color (green > 7 days, amber 3-7, red < 3 or overdue).
At bottom of card: action area that changes by type:
- CHECK: large checkbox button "Marcar como feito"
- REFLECTION: expandable textarea "Escreva sua resposta..."
- UPLOAD: file upload area
Always show ghost button "❓ Tenho uma dúvida" at bottom.
Completed cards have: strikethrough title + salmon checkmark + reduced opacity.
```
