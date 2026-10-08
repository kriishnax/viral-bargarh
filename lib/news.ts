import { prisma } from './prisma';

export type Locale = 'en' | 'or';
export const isLocale = (v: string): v is Locale => v === 'en' || v === 'or';

export function pick<T extends { titleEn: string; titleOr: string; excerptEn?: string | null; excerptOr?: string | null; contentEn?: string; contentOr?: string }>(item: T, locale: Locale) {
  return {
    title: locale === 'or' ? item.titleOr : item.titleEn,
    excerpt: locale === 'or' ? item.excerptOr : item.excerptEn,
    content: locale === 'or' ? item.contentOr : item.contentEn,
  };
}

export async function getHomeData() {
  try {
    const [featured, latest, trending, breaking, liveUpdates, videos, categories] = await Promise.all([
      prisma.article.findMany({ where: { status: 'PUBLISHED', isFeatured: true }, orderBy: { publishedAt: 'desc' }, take: 4, include: { category: true, author: true } }),
      prisma.article.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 12, include: { category: true, author: true } }),
      prisma.article.findMany({ where: { status: 'PUBLISHED', isTrending: true }, orderBy: { views: 'desc' }, take: 5, include: { category: true } }),
      prisma.article.findMany({ where: { status: 'PUBLISHED', isBreaking: true }, orderBy: { publishedAt: 'desc' }, take: 5, select: { id: true, titleEn: true, titleOr: true, slug: true } }),
      prisma.liveUpdate.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.video.findMany({ orderBy: { publishedAt: 'desc' }, take: 6 }),
      prisma.category.findMany({ orderBy: { nameEn: 'asc' } }),
    ]);
    return { featured, latest, trending, breaking, liveUpdates, videos, categories };
  } catch {
    return { featured: [], latest: [], trending: [], breaking: [], liveUpdates: [], videos: [], categories: [] };
  }
}

export async function getCategoryData(slug: string) {
  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return null;
    const articles = await prisma.article.findMany({ where: { categoryId: category.id, status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 30, include: { category: true, author: true } });
    return { category, articles };
  } catch { return null; }
}

export async function getArticle(slug: string) {
  try {
    return await prisma.article.findUnique({ where: { slug }, include: { category: true, author: true } });
  } catch { return null; }
}
