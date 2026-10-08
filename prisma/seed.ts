import { PrismaClient, Role, ArticleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  ['Bargarh', 'ବରଗଡ଼', 'bargarh'],
  ['Odisha', 'ଓଡ଼ିଶା', 'odisha'],
  ['India', 'ଭାରତ', 'india'],
  ['World', 'ବିଶ୍ୱ', 'world'],
  ['Politics', 'ରାଜନୀତି', 'politics'],
  ['Business', 'ବ୍ୟବସାୟ', 'business'],
  ['Sports', 'କ୍ରୀଡ଼ା', 'sports'],
  ['Entertainment', 'ମନୋରଞ୍ଜନ', 'entertainment'],
  ['Education', 'ଶିକ୍ଷା', 'education'],
  ['Technology', 'ଟେକ୍ନୋଲୋଜି', 'technology'],
];

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@viralbargarh.com' },
    update: {},
    create: { name: 'Viral Bargarh Admin', email: 'admin@viralbargarh.com', passwordHash, role: Role.ADMIN },
  });

  const categoryMap: Record<string, string> = {};
  for (const [nameEn, nameOr, slug] of categories) {
    const c = await prisma.category.upsert({ where: { slug }, update: { nameEn, nameOr }, create: { nameEn, nameOr, slug } });
    categoryMap[slug] = c.id;
  }

  const author = await prisma.author.upsert({
    where: { id: 'seed-author' },
    update: {},
    create: { id: 'seed-author', name: 'Viral Bargarh Desk', bio: 'Editorial desk of Viral Bargarh.' },
  });

  const demo = [
    { slug: 'viral-bargarh-launches-new-digital-newsroom', cat: 'bargarh', en: 'Viral Bargarh launches a new digital newsroom for fast, local reporting', or: 'ଦ୍ରୁତ ଓ ସ୍ଥାନୀୟ ଖବର ପାଇଁ ଭାଇରାଲ ବରଗଡ଼ର ନୂଆ ଡିଜିଟାଲ ନ୍ୟୁଜରୁମ', excerptEn: 'A new digital-first home for verified ground reports from Bargarh and Odisha.', excerptOr: 'ବରଗଡ଼ ଓ ଓଡ଼ିଶାରୁ ସତ୍ୟାପିତ ଖବର ପାଇଁ ନୂଆ ଡିଜିଟାଲ ମଞ୍ଚ।' },
    { slug: 'odisha-latest-ground-report', cat: 'odisha', en: 'Odisha ground report: the stories shaping communities today', or: 'ଓଡ଼ିଶା ଗ୍ରାଉଣ୍ଡ ରିପୋର୍ଟ: ଆଜି ସମୁଦାୟକୁ ପ୍ରଭାବିତ କରୁଥିବା ଖବର', excerptEn: 'Verified local updates, public voices and context from across the state.', excerptOr: 'ରାଜ୍ୟର ବିଭିନ୍ନ ସ୍ଥାନରୁ ସତ୍ୟାପିତ ଅପଡେଟ୍ ଓ ଜନସ୍ୱର।' },
    { slug: 'bargarh-community-voices', cat: 'bargarh', en: 'Bargarh community voices: what people want to see next', or: 'ବରଗଡ଼ର ଜନସ୍ୱର: ଆଗାମୀ ଦିନରେ ଲୋକେ କଣ ଚାହୁଁଛନ୍ତି', excerptEn: 'A closer look at local priorities and everyday civic concerns.', excerptOr: 'ସ୍ଥାନୀୟ ପ୍ରାଥମିକତା ଓ ଦୈନନ୍ଦିନ ନାଗରିକ ସମସ୍ୟା ଉପରେ ଏକ ନଜର।' },
  ];

  for (const item of demo) {
    await prisma.article.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        titleEn: item.en,
        titleOr: item.or,
        excerptEn: item.excerptEn,
        excerptOr: item.excerptOr,
        contentEn: `<p>${item.excerptEn}</p><p>Viral Bargarh is committed to responsible, ground-level reporting. This demo article is included so the newsroom is ready to preview immediately after setup.</p>`,
        contentOr: `<p>${item.excerptOr}</p><p>ଭାଇରାଲ ବରଗଡ଼ ଦାୟିତ୍ୱଶୀଳ ଓ ଗ୍ରାଉଣ୍ଡ-ଲେଭେଲ ରିପୋର୍ଟିଂ ପାଇଁ ପ୍ରତିବଦ୍ଧ। ଏହି ଡେମୋ ଖବର ଆରମ୍ଭିକ ସେଟଅପ୍ ପାଇଁ ରହିଛି।</p>`,
        status: ArticleStatus.PUBLISHED,
        isFeatured: item.cat === 'bargarh',
        isTrending: true,
        isBreaking: false,
        publishedAt: new Date(),
        categoryId: categoryMap[item.cat],
        authorId: author.id,
        createdById: admin.id,
      },
    });
  }

  await prisma.liveUpdate.createMany({ data: [
    { textEn: 'Viral Bargarh digital newsroom is live.', textOr: 'ଭାଇରାଲ ବରଗଡ଼ ଡିଜିଟାଲ ନ୍ୟୁଜରୁମ ଲାଇଭ୍ ହୋଇଛି।' },
    { textEn: 'Follow the latest verified local updates.', textOr: 'ସତ୍ୟାପିତ ସ୍ଥାନୀୟ ଅପଡେଟ୍ ପାଇଁ ଆମକୁ ଅନୁସରଣ କରନ୍ତୁ।' },
  ] });

  console.log('Seed complete. Admin: admin@viralbargarh.com / ChangeMe123!');
}

main().finally(() => prisma.$disconnect());
