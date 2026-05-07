import { Resend } from 'resend'

const resend = process.env['RESEND_API_KEY']
  ? new Resend(process.env['RESEND_API_KEY'])
  : null

const FROM = process.env['EMAIL_FROM'] ?? 'Marcelle Breciani <noreply@marcellebreciani.com.br>'

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    // Dev fallback: log to console
    console.log(`[email] To: ${to} | Subject: ${subject}`)
    return
  }
  await resend.emails.send({ from: FROM, to, subject, html })
}

export const email = {
  async welcomeCollaborator(opts: { name: string; email: string; tempPassword: string }) {
    await send(
      opts.email,
      'Bem-vinda à equipe Marcelle Breciani 🌿',
      `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h2 style="color:#1a7a6e;margin-bottom:8px">Olá, ${opts.name}!</h2>
        <p>Você foi adicionada como colaboradora da plataforma <strong>Marcelle Breciani</strong>.</p>
        <p>Use as credenciais abaixo para acessar o sistema:</p>
        <div style="background:#f4f1ec;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0 0 6px"><strong>E-mail:</strong> ${opts.email}</p>
          <p style="margin:0"><strong>Senha temporária:</strong> <code style="background:#e8e4db;padding:2px 6px;border-radius:4px">${opts.tempPassword}</code></p>
        </div>
        <p style="color:#666;font-size:14px">Altere sua senha no primeiro acesso.</p>
        <a href="${process.env['WEB_URL'] ?? 'http://localhost:3000'}/login"
           style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1a7a6e;color:#fff;border-radius:8px;text-decoration:none;font-size:14px">
          Acessar plataforma →
        </a>
      </div>
      `,
    )
  },

  async welcomeClient(opts: { name: string; email: string; tempPassword: string }) {
    await send(
      opts.email,
      'Bem-vinda ao seu espaço financeiro 🌿',
      `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <h2 style="color:#1a7a6e;margin-bottom:8px">Olá, ${opts.name}!</h2>
        <p>Seu espaço de planejamento financeiro com <strong>Marcelle Breciani</strong> está pronto.</p>
        <p>Use as credenciais abaixo para acessar:</p>
        <div style="background:#f4f1ec;border-radius:12px;padding:16px 20px;margin:20px 0">
          <p style="margin:0 0 6px"><strong>E-mail:</strong> ${opts.email}</p>
          <p style="margin:0"><strong>Senha temporária:</strong> <code style="background:#e8e4db;padding:2px 6px;border-radius:4px">${opts.tempPassword}</code></p>
        </div>
        <p style="color:#666;font-size:14px">Altere sua senha no primeiro acesso.</p>
        <a href="${process.env['WEB_URL'] ?? 'http://localhost:3000'}/login"
           style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1a7a6e;color:#fff;border-radius:8px;text-decoration:none;font-size:14px">
          Acessar meu espaço →
        </a>
      </div>
      `,
    )
  },
}
