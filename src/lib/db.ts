import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

const isProduction = (import.meta as any)?.env?.MODE === 'production'

if (!isProduction) {
  globalForPrisma.prisma = prisma
}

export async function savePhotoSession(data: {
  filename: string
  imageData: string
  filter?: string
  frame?: string
}) {
  return prisma.photoSession.create({
    data: {
      filename: data.filename,
      imageData: data.imageData,
      filter: data.filter || null,
      frame: data.frame || null,
    },
  })
}

export async function getPhotoSessions() {
  return prisma.photoSession.findMany({
    orderBy: { capturedAt: 'desc' },
  })
}

export async function deletePhotoSession(id: string) {
  return prisma.photoSession.delete({
    where: { id },
  })
}

export async function getPhotoSession(id: string) {
  return prisma.photoSession.findUnique({
    where: { id },
  })
}