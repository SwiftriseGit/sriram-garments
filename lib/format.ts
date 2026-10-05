const priceFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1350 → "Rs. 1,350.00" (matches the site's existing price style) */
export function formatPrice(amount: number) {
  return `Rs. ${priceFormatter.format(amount)}`;
}

export function discountPercent(price: number, compareAtPrice: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
