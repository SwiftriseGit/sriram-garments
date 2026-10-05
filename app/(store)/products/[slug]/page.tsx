import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Banknote, ChevronDown, RotateCcw, Star, Truck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import RelatedProducts, { RelatedProductsSkeleton } from "@/components/product/RelatedProducts";
import { categoryLabel } from "@/lib/catalog/options";
import { discountPercent, formatPrice } from "@/lib/format";
import { getAllProductSlugs, getProductBySlug, getStyleVariants } from "@/lib/data/products";

/** Pre-render every product page at build time (catalog is public & cached). */
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  // Same cached call as the page below → no duplicate work
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found — SriRam Garments" };

  const title = `${product.name} — ${product.color.name} | SriRam Garments`;
  return {
    title,
    description: product.description,
    openGraph: { title, description: product.description, type: "website" },
  };
}

const PERKS = [
  { icon: Truck, title: "Free shipping", text: "On orders above ₹999" },
  { icon: RotateCcw, title: "Easy returns", text: "7-day hassle-free" },
  { icon: Banknote, title: "Cash on delivery", text: "Available across India" },
];

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Missing resource → 404 page (not an error boundary)
  if (!product) notFound();

  const variants = await getStyleVariants(product.styleId);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const category = categoryLabel(product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} — ${product.color.name}`,
    description: product.description,
    sku: product.id,
    color: product.color.name,
    category,
    brand: { "@type": "Brand", name: "SriRam Garments" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <section className="max-w-[1340px] mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop All", href: "/collections" },
          { label: category, href: `/collections?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        {/* key → reset gallery/purchase state when switching colourway */}
        <ProductGallery key={`gallery-${product.slug}`} product={product} discount={discount} />

        <div>
          {/* Title block */}
          <p className="text-[11px] sm:text-[12px] font-semibold text-orange-500 uppercase tracking-[0.14em] mb-2">
            {category}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 uppercase tracking-tight leading-tight">
            {product.name}
          </h1>

          <a href="#reviews" className="inline-flex items-center gap-2 mt-3 group">
            <span className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-zinc-200 text-zinc-200"
                  }`}
                />
              ))}
            </span>
            <span className="text-[12px] font-semibold text-zinc-900">{product.rating}</span>
            <span className="text-[12px] font-medium text-zinc-500 group-hover:text-orange-500 underline underline-offset-2 transition-colors">
              {product.reviewCount} reviews
            </span>
          </a>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <span className="text-2xl font-bold text-zinc-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-[15px] font-medium text-zinc-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] font-medium text-zinc-500 mt-1">Inclusive of all taxes</p>

          <div className="border-t border-zinc-100 my-6" />

          {/* Colourways */}
          <div className="mb-6">
            <p className="text-[13px] font-semibold text-zinc-900 mb-3">
              Colour: <span className="font-medium text-zinc-500">{product.color.name}</span>
            </p>
            <div className="flex gap-2.5">
              {variants.map((variant) => {
                const current = variant.slug === product.slug;
                return (
                  <Link
                    key={variant.slug}
                    href={`/products/${variant.slug}`}
                    scroll={false}
                    aria-label={variant.color.name}
                    aria-current={current ? "true" : undefined}
                    title={variant.color.name}
                    className={`w-9 h-9 rounded-full border border-black/10 transition-all ${
                      current
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2"
                    }`}
                    style={{ backgroundColor: variant.color.hex }}
                  />
                );
              })}
            </div>
          </div>

          <ProductPurchase
            key={`purchase-${product.slug}`}
            availableSizes={product.sizes}
            inStock={product.inStock}
          />

          {/* Perks */}
          <ul className="grid grid-cols-3 gap-2 mt-6 p-3 sm:p-4 rounded-2xl bg-zinc-50">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex flex-col items-center text-center gap-1.5 px-1">
                <Icon className="w-5 h-5 text-orange-500" aria-hidden />
                <span className="text-[11px] sm:text-[12px] font-semibold text-zinc-900 leading-tight">
                  {title}
                </span>
                <span className="text-[10px] sm:text-[11px] text-zinc-500 leading-tight">{text}</span>
              </li>
            ))}
          </ul>

          {/* Details — native <details> = accessible accordion, zero JS */}
          <div className="mt-6 border-t border-zinc-100">
            <Accordion title="Description" defaultOpen>
              <p>{product.description}</p>
              <ul className="mt-3 space-y-1.5">
                {product.highlights.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Fabric & Fit">
              <dl className="grid grid-cols-[90px_1fr] gap-y-2">
                <dt className="font-semibold text-zinc-900">Fabric</dt>
                <dd>{product.fabric}</dd>
                <dt className="font-semibold text-zinc-900">Fit</dt>
                <dd>{product.fit}</dd>
                <dt className="font-semibold text-zinc-900">Colour</dt>
                <dd>{product.color.name}</dd>
              </dl>
            </Accordion>
            <Accordion title="Wash Care">
              <ul className="space-y-1.5">
                <li>Machine wash cold with similar colours</li>
                <li>Do not bleach · Tumble dry low</li>
                <li>Warm iron on reverse · Do not iron on print</li>
              </ul>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>
                Orders ship within 24–48 hours and arrive in 3–7 business days. Free shipping on
                orders above ₹999. Not the right fit? Return or exchange within 7 days — see our{" "}
                <Link href="/pages/return-policy" className="text-orange-500 underline underline-offset-2">
                  return policy
                </Link>
                .
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Non-critical, below the fold → stream it in */}
      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts styleId={product.styleId} category={product.category} />
      </Suspense>
    </section>
  );
}

function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-zinc-100">
      <summary className="flex items-center justify-between py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="text-[13px] sm:text-[14px] font-semibold text-zinc-900">{title}</span>
        <ChevronDown className="w-4 h-4 text-zinc-500 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-[12px] sm:text-[13px] leading-relaxed text-zinc-600">{children}</div>
    </details>
  );
}
