import { PrismaClient } from '@prisma/client'
import { PasswordHasher } from '../src/utils/password-hasher'
const prisma = new PrismaClient()
async function main() {
  const status = [
    {
      name: 'Aberta',
      description: 'A ordem de serviço foi criada, mas ainda não foi iniciada',
    },
    {
      name: 'Em andamento',
      description: 'O trabalho já começou, e está em progresso',
    },
    {
      name: 'Aguardando aprovação',
      description:
        'Esperando pela aprovação do cliente ou de outro departamento antes de continuar',
    },
    {
      name: 'Pendente',
      description:
        'Alguma ação é necessária antes que o trabalho possa prosseguir',
    },
    {
      name: 'Concluída',
      description: 'O trabalho foi finalizado com sucesso',
    },
    {
      name: 'Cancelada',
      description:
        'A Ordem de serviço foi interrompida antes de ser concluída, por diversos motivos',
    },
    {
      name: 'Em espera',
      description:
        'O trabalho foi temporariamente interrompido e aguarda a resolução de um problema ou a disponibilidade de recurso',
    },
    {
      name: 'Em análise',
      description:
        'A ordem de serviço está sendo avaliada antes de ser atribuída',
    },
  ]

  for (const i in status) {
    await prisma.status.upsert({
      where: {
        name: status[i].name,
      },
      update: {},
      create: status[i],
    })
  }

  const profile = await prisma.profile.upsert({
    where: {
      name: 'master',
    },
    update: {},
    create: {
      name: 'master',
      description: 'Master',
    },
  })
  await prisma.profile.upsert({
    where: {
      name: 'admin',
    },
    update: {},
    create: {
      name: 'Admin',
      description: 'Admin',
    },
  })

  await prisma.profile.upsert({
    where: {
      name: 'common',
    },
    update: {},
    create: {
      name: 'common',
      description: 'Common',
    },
  })
  const passwordHash = await PasswordHasher.hashPassword(
    process.env.CREATE_USER_PASSWORD,
  )
  await prisma.user.upsert({
    where: {
      email: process.env.CREATE_USER_EMAIL,
    },
    update: {},
    create: {
      name: process.env.CREATE_USER_NAME,
      email: process.env.CREATE_USER_EMAIL,
      password: passwordHash,
      profile_id: profile.id,
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
