import { prisma } from '../../lib/prisma.js'
import { errors } from '../../lib/errors.js'
import { createNotification } from '../notifications/notifications.routes.js'

// Default anamnesis template — 5 sections, ~25 fields
const DEFAULT_TEMPLATE = [
  {
    title: 'Perfil Pessoal',
    description: 'Informações básicas sobre você e seu contexto de vida.',
    order: 1,
    fields: [
      { label: 'Data de nascimento', type: 'DATE', required: true, order: 1 },
      { label: 'Ocupação / Profissão', type: 'TEXT', required: true, order: 2 },
      { label: 'Estado civil', type: 'SELECT', required: true, order: 3, options: ['Solteiro(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Viúvo(a)'] },
      { label: 'Tem filhos ou dependentes?', type: 'BOOLEAN', required: true, order: 4 },
      { label: 'Quantos dependentes?', type: 'NUMBER', required: false, order: 5 },
    ],
  },
  {
    title: 'Situação Financeira Atual',
    description: 'Entender sua realidade financeira hoje.',
    order: 2,
    fields: [
      { label: 'Renda mensal líquida (aproximada)', type: 'CURRENCY', required: true, order: 1 },
      { label: 'Fontes de renda', type: 'MULTISELECT', required: true, order: 2, options: ['CLT', 'PJ/Autônomo', 'Aluguel', 'Investimentos', 'Pensão/Aposentadoria', 'Outro'] },
      { label: 'Possui dívidas?', type: 'BOOLEAN', required: true, order: 3 },
      { label: 'Descreva suas dívidas (tipo, valor, prazo)', type: 'TEXTAREA', required: false, order: 4 },
      { label: 'Possui reserva de emergência?', type: 'BOOLEAN', required: true, order: 5 },
      { label: 'Valor da reserva de emergência', type: 'CURRENCY', required: false, order: 6 },
    ],
  },
  {
    title: 'Hábitos e Comportamentos',
    description: 'Como você se relaciona com o dinheiro no dia a dia.',
    order: 3,
    fields: [
      { label: 'Como você descreveria sua relação com o dinheiro?', type: 'TEXTAREA', required: true, order: 1 },
      { label: 'Controla seus gastos mensais?', type: 'SELECT', required: true, order: 2, options: ['Sim, uso planilha/app', 'Parcialmente', 'Não controlo'] },
      { label: 'Com que frequência faz compras por impulso?', type: 'SELECT', required: true, order: 3, options: ['Raramente', 'Às vezes', 'Frequentemente', 'Sempre'] },
      { label: 'O que te impede de poupar mais?', type: 'TEXTAREA', required: false, order: 4 },
      { label: 'Já tentou se organizar financeiramente antes? Como foi?', type: 'TEXTAREA', required: false, order: 5 },
    ],
  },
  {
    title: 'Objetivos e Sonhos',
    description: 'O que você quer conquistar com seu dinheiro.',
    order: 4,
    fields: [
      { label: 'Qual é seu maior objetivo financeiro de curto prazo (até 1 ano)?', type: 'TEXTAREA', required: true, order: 1 },
      { label: 'Objetivo de médio prazo (1 a 5 anos)', type: 'TEXTAREA', required: true, order: 2 },
      { label: 'Objetivo de longo prazo (mais de 5 anos)', type: 'TEXTAREA', required: false, order: 3 },
      { label: 'O que o dinheiro representa para você?', type: 'TEXTAREA', required: true, order: 4 },
      { label: 'Qual estilo de vida você quer ter?', type: 'TEXTAREA', required: false, order: 5 },
    ],
  },
  {
    title: 'Investimentos e Patrimônio',
    description: 'Seu patrimônio atual e relação com investimentos.',
    order: 5,
    fields: [
      { label: 'Possui investimentos?', type: 'BOOLEAN', required: true, order: 1 },
      { label: 'Onde investe?', type: 'MULTISELECT', required: false, order: 2, options: ['Poupança', 'CDB/LCI/LCA', 'Tesouro Direto', 'Fundos', 'Ações/FIIs', 'Criptomoedas', 'Outro'] },
      { label: 'Qual seu perfil de risco?', type: 'SELECT', required: false, order: 3, options: ['Conservador', 'Moderado', 'Arrojado', 'Não sei'] },
      { label: 'Possui imóvel próprio?', type: 'BOOLEAN', required: true, order: 4 },
      { label: 'Outras informações que queira compartilhar', type: 'TEXTAREA', required: false, order: 5 },
    ],
  },
]

export class AnamnesisService {
  async createForClient(clientId: string): Promise<any> {
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) throw errors.notFound('Cliente')

    // Check if there's already an anamnesis
    const existing = await prisma.anamnesis.findFirst({ where: { clientId } })
    if (existing) throw errors.conflict('Anamnese já existe para este cliente')

    return prisma.anamnesis.create({
      data: {
        clientId,
        title: 'Anamnese Financeira',
        sections: {
          create: DEFAULT_TEMPLATE.map((section) => ({
            title: section.title,
            description: section.description,
            order: section.order,
            fields: {
              create: section.fields.map((field) => ({
                label: field.label,
                type: field.type as any,
                required: field.required,
                order: field.order,
                options: field.options ?? undefined,
              })),
            },
          })),
        },
      },
      include: {
        sections: {
          include: { fields: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' },
        },
      },
    })
  }

  async findByClient(clientId: string): Promise<any> {
    const anamnesis = await prisma.anamnesis.findFirst({
      where: { clientId },
      include: {
        sections: {
          include: {
            fields: {
              include: {
                responses: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })
    if (!anamnesis) throw errors.notFound('Anamnese')
    return anamnesis
  }

  async saveResponses(anamnesisId: string, responses: { fieldId: string; value?: string; fileUrl?: string }[]) {
    const anamnesis = await prisma.anamnesis.findUnique({ where: { id: anamnesisId } })
    if (!anamnesis) throw errors.notFound('Anamnese')

    // Upsert each response
    await Promise.all(
      responses.map((r) =>
        prisma.anamnesisResponse.upsert({
          where: { anamnesisId_fieldId: { anamnesisId, fieldId: r.fieldId } },
          update: { value: r.value ?? null, fileUrl: r.fileUrl ?? null },
          create: { anamnesisId, fieldId: r.fieldId, value: r.value ?? null, fileUrl: r.fileUrl ?? null },
        })
      )
    )

    // Check completion — count required fields vs filled responses
    const allFields = await prisma.anamnesisField.findMany({
      where: { section: { anamnesisId } },
    })
    const requiredFields = allFields.filter((f) => f.required)
    const filledRequired = await prisma.anamnesisResponse.count({
      where: {
        anamnesisId,
        fieldId: { in: requiredFields.map((f) => f.id) },
        value: { not: null },
      },
    })

    const isComplete = filledRequired >= requiredFields.length

    const wasAlreadyComplete = anamnesis.status === 'COMPLETED'

    const updated = await prisma.anamnesis.update({
      where: { id: anamnesisId },
      data: {
        status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isComplete ? new Date() : null,
      },
      include: {
        client: {
          include: {
            collaborator: { include: { user: true } },
            user: true,
          },
        },
      },
    })

    // Notify the collaborator when anamnesis is newly completed
    if (isComplete && !wasAlreadyComplete && updated.client.collaborator?.userId) {
      createNotification({
        userId: updated.client.collaborator.userId,
        type: 'ANAMNESIS_COMPLETED',
        title: 'Anamnese concluída',
        body: `${updated.client.user.name} concluiu a anamnese financeira.`,
        data: { clientId: updated.client.id, anamnesisId } as Record<string, string>,
      }).catch(() => {})
    }

    return updated
  }

  async getProgress(anamnesisId: string) {
    const anamnesis = await prisma.anamnesis.findUnique({
      where: { id: anamnesisId },
      include: {
        sections: {
          include: {
            fields: {
              include: { responses: { where: { value: { not: null } } } },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })
    if (!anamnesis) throw errors.notFound('Anamnese')

    const sections = anamnesis.sections.map((section) => {
      const total = section.fields.length
      const filled = section.fields.filter((f) => f.responses.length > 0).length
      return { id: section.id, title: section.title, order: section.order, total, filled }
    })

    const totalFields = sections.reduce((s, sec) => s + sec.total, 0)
    const filledFields = sections.reduce((s, sec) => s + sec.filled, 0)

    return {
      id: anamnesis.id,
      status: anamnesis.status,
      completedAt: anamnesis.completedAt,
      sections,
      progress: totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0,
    }
  }
}
