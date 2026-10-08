import { notFound } from "next/navigation";
import { getCategoryData, isLocale, pick } from "@/lib/news";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getCategoryData(slug);
  if (!data) notFound();
  const name = locale === "or" ? data.category.nameOr : data.category.nameEn;
  return (
    <main className="listing-page">
      <header className="article-nav">
        <Link href={`/${locale}`} className="brand">
          <img src="/brand/logo.jpg" alt="Viral Bargarh" />
          <span>
            <b>VIRAL</b> BARGARH
          </span>
        </Link>
        <Link href={`/${locale}`}>Home</Link>
      </header>
      <div className="listing-head">
        <p className="kicker">VIRAL BARGARH</p>
        <h1>{name}</h1>
        <p>
          {locale === "or"
            ? "ସର୍ବଶେଷ ସତ୍ୟାପିତ ଖବର ଓ ଅପଡେଟ୍।"
            : "Latest verified stories and updates."}
        </p>
      </div>
      <section className="listing-grid">
        {data.articles.map((a: any) => (
          <article className="list-card" key={a.id}>
            <div
              className="list-thumb"
              style={
                a.featuredImage
                  ? { backgroundImage: `url(${a.featuredImage})` }
                  : undefined
              }
            />
            <div>
              <span className="pill">{name}</span>
              <h2>
                <Link href={`/${locale}/news/${a.slug}`}>
                  {pick(a, locale).title}
                </Link>
              </h2>
              <p>{pick(a, locale).excerpt}</p>
              <Link className="read-more" href={`/${locale}/news/${a.slug}`}>
                Read story <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
