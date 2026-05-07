import { FastifyError } from 'fastify'

export class AppError extends Error implements FastifyError {
  statusCode: number
  code: string

  constructor(statusCode: number, message: string, code = 'APP_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'AppError'
  }
}

export const errors = {
  unauthorized: () => new AppError(401, 'Nao autorizado'),
  forbidden: () => new AppError(403, 'Acesso negado'),
  notFound: (resource = 'Recurso') => new AppError(404, `${resource} nao encontrado`),
  conflict: (message: string) => new AppError(409, message),
  badRequest: (message: string) => new AppError(400, message),
}
