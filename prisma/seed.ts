import { PrismaClient, type User } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const demoUsers = [
  {
    name: "Ana Criadora",
    username: "ana",
    email: "ana@nexus.app",
    role: "CREATOR" as const,
    bio: "Criadora de conteúdo sobre design e tecnologia. ✨",
    location: "São Paulo, BR",
    websiteUrl: "https://nexus.app",
  },
  {
    name: "Bruno Dev",
    username: "bruno",
    email: "bruno@nexus.app",
    role: "USER" as const,
    bio: "Full stack dev. Construindo coisas legais.",
  },
  {
    name: "Carla Music",
    username: "carla",
    email: "carla@nexus.app",
    role: "CREATOR" as const,
    bio: "Música independente 🎵 | Novos lançamentos toda semana",
  },
];

const demoPosts = [
  "Acabei de chegar no NEXUS! Animada para criar e conectar por aqui. 🚀",
  "Dica do dia: consistência vence intensidade. Publique sempre. 💡",
  "Trabalhando em um novo projeto que vou compartilhar em breve com vocês. 👀",
  "Qual conteúdo vocês querem ver mais por aqui? Me contem nos comentários!",
];

async function main() {
  console.log("🌱 Seeding NEXUS...");
  const passwordHash = await bcrypt.hash("nexus1234", 12);

  const users: User[] = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
    users.push(user);
    console.log(`  ✓ usuário @${user.username}`);
  }

  // Publicações
  for (let i = 0; i < demoPosts.length; i++) {
    const author = users[i % users.length];
    await prisma.post.create({
      data: {
        authorId: author.id,
        content: demoPosts[i],
      },
    });
  }
  await Promise.all(
    users.map((u) =>
      prisma.user.update({
        where: { id: u.id },
        data: {
          postsCount: demoPosts.filter(
            (_, i) => users[i % users.length].id === u.id,
          ).length,
        },
      }),
    ),
  );
  console.log(`  ✓ ${demoPosts.length} publicações`);

  // Relações de follow (ana <-> bruno <-> carla)
  const [ana, bruno, carla] = users;
  const follows = [
    [bruno.id, ana.id],
    [carla.id, ana.id],
    [ana.id, carla.id],
  ];
  for (const [followerId, followingId] of follows) {
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: { followerId, followingId },
    });
  }
  // Atualiza contadores de follow
  for (const u of users) {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: u.id } }),
      prisma.follow.count({ where: { followerId: u.id } }),
    ]);
    await prisma.user.update({
      where: { id: u.id },
      data: { followersCount, followingCount },
    });
  }
  console.log(`  ✓ relações de seguidores`);

  console.log("✅ Seed concluído. Login de teste: ana@nexus.app / nexus1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
