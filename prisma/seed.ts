import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test Testerson',
      password: hashedPassword,
      image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      streakCount: 14,
      xpTotal: 4200,
      level: 5,
    },
  });

  const friendUser = await prisma.user.upsert({
    where: { email: 'friend@example.com' },
    update: {},
    create: {
      email: 'friend@example.com',
      name: 'Amélie Dupont',
      password: hashedPassword,
      image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
      streakCount: 45,
      xpTotal: 12500,
      level: 12,
    },
  });

  console.log('Created users', testUser.id, friendUser.id);

  // Follow relation
  await prisma.user.update({
    where: { id: testUser.id },
    data: {
      following: {
        connect: [{ id: friendUser.id }]
      }
    }
  });

  // 2. Create Vocab entries
  const words = [
    { wordOriginal: 'Bonjour', translation: 'Hello/Good morning', contextSentence: 'Bonjour, comment allez-vous?', masteryLevel: 3 },
    { wordOriginal: 'Merci', translation: 'Thank you', contextSentence: 'Merci beaucoup!', masteryLevel: 5 },
    { wordOriginal: 'S\'il vous plaît', translation: 'Please', contextSentence: 'Une bière, s\'il vous plaît.', masteryLevel: 4 },
    { wordOriginal: 'Au revoir', translation: 'Goodbye', contextSentence: 'Au revoir et à demain.', masteryLevel: 2 },
    { wordOriginal: 'Chat', translation: 'Cat', contextSentence: 'Le chat aime le poisson.', masteryLevel: 1 },
  ];

  for (const w of words) {
    await prisma.vocab.create({
      data: {
        userId: testUser.id,
        wordOriginal: w.wordOriginal,
        translation: w.translation,
        contextSentence: w.contextSentence,
        masteryLevel: w.masteryLevel,
      }
    });
  }
  console.log('Created vocabs');

  // 3. Create LessonProgress
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: testUser.id,
        lessonId: 'unit1-lesson1'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      lessonId: 'unit1-lesson1',
      completed: true,
      score: 100,
    }
  });

  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: testUser.id,
        lessonId: 'unit1-lesson2'
      }
    },
    update: {},
    create: {
      userId: testUser.id,
      lessonId: 'unit1-lesson2',
      completed: false,
      score: 40,
    }
  });
  console.log('Created lesson progress');

  // 4. Create Awards
  await prisma.award.create({
    data: {
      userId: testUser.id,
      badgeName: '7 Day Streak'
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
