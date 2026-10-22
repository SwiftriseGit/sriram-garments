import { requireAdmin } from "@/lib/auth/dal";
import connectDB from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { deleteProductAction } from "@/actions/products";
export const instant = false;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const q = (params.q || "").toLowerCase();

  // Direct DB call in Server Component — no fetch('/api/...') needed
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  const products = await ProductModel.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Products</h1>
          <p className="text-sm text-zinc-500 mt-1 font-medium">
            Manage your store's inventory and catalog. ({products.length} products)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm hover:shadow shadow-indigo-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            <form>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm transition-all shadow-sm"
              />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-zinc-500 font-semibold uppercase tracking-wider bg-white border-b border-zinc-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-400">
                      <Package className="w-12 h-12 mb-3 text-zinc-300" />
                      <p className="text-sm font-medium">
                        {q ? "No products found matching your search." : "No products added yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const effectivePrice =
                    product.isSale && product.salePrice != null
                      ? product.salePrice
                      : product.originalPrice;

                  return (
                    <tr key={product._id.toString()} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex-shrink-0 border border-zinc-200/60 overflow-hidden shadow-sm">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-sm font-bold"
                                style={{
                                  backgroundColor: product.color.hex + "15",
                                  color: product.color.hex,
                                }}
                              >
                                {product.category.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-xs text-zinc-500 capitalize mt-0.5">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.isPublished ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 shadow-sm">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-50 text-zinc-700 border border-zinc-200/50 shadow-sm">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.stockQuantity === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/50 shadow-sm">Out of stock</span>
                        ) : product.stockQuantity <= 10 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/50 shadow-sm">{product.stockQuantity} left</span>
                        ) : (
                          <span className="text-zinc-900 font-medium">{product.stockQuantity} in stock</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900">{formatPrice(effectivePrice)}</div>
                        {product.isSale && product.salePrice != null && (
                          <div className="text-xs text-zinc-400 line-through mt-0.5">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="p-2 text-zinc-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={product._id.toString()} />
                            <button
                              type="submit"
                              className="p-2 text-zinc-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
