import Intro from '@/app/components/Intro';
import Home from '@/app/components/Home';
import { getHomeData, isLocale } from '@/lib/news';
import { notFound } from 'next/navigation';

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getHomeData();
  return <><Intro locale={locale} /><Home locale={locale} data={data} /></>;
}
