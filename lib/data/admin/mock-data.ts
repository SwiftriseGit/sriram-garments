// ──────────────────────────────────────────────
// Mock data for admin panel (no DB required)
// ──────────────────────────────────────────────

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  stockQuantity: number;
  inStock: boolean;
  isPublished: boolean;
  images: string[];
  color: { name: string; hex: string; tone: "dark" | "light" };
  sizes: string[];
  salesCount: number;
  createdAt: string;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  paymentMethod: string;
  createdAt: string;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

// ── Products ────────────────────────────────
export let MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "p1",
    name: "Premium Cotton Oxford Shirt",
    slug: "premium-cotton-oxford-shirt",
    category: "shirts",
    price: 1299,
    compareAtPrice: 1799,
    description: "Classic oxford shirt crafted from 100% premium cotton with a button-down collar.",
    stockQuantity: 45,
    inStock: true,
    isPublished: true,
    images: ["/images/products/shirt-1.jpg"],
    color: { name: "Sky Blue", hex: "#87CEEB", tone: "light" },
    sizes: ["S", "M", "L", "XL"],
    salesCount: 128,
    createdAt: "2026-09-15T10:00:00Z",
  },
  {
    id: "p2",
    name: "Slim Fit Stretch Jeans",
    slug: "slim-fit-stretch-jeans",
    category: "jeans",
    price: 1499,
    compareAtPrice: 2199,
    description: "Modern slim-fit jeans with 2% stretch for all-day comfort.",
    stockQuantity: 32,
    inStock: true,
    isPublished: true,
    images: ["/images/products/jeans-1.jpg"],
    color: { name: "Dark Indigo", hex: "#1A237E", tone: "dark" },
    sizes: ["M", "L", "XL", "XXL"],
    salesCount: 96,
    createdAt: "2026-09-16T10:00:00Z",
  },
  {
    id: "p3",
    name: "Classic Polo T-Shirt",
    slug: "classic-polo-tshirt",
    category: "t-shirts",
    price: 799,
    compareAtPrice: null,
    description: "Breathable cotton-piqué polo in a regular fit.",
    stockQuantity: 0,
    inStock: false,
    isPublished: true,
    images: ["/images/products/tshirt-1.jpg"],
    color: { name: "Navy", hex: "#0D1B2A", tone: "dark" },
    sizes: ["S", "M", "L"],
    salesCount: 210,
    createdAt: "2026-09-17T10:00:00Z",
  },
  {
    id: "p4",
    name: "Formal Pleated Trousers",
    slug: "formal-pleated-trousers",
    category: "trousers",
    price: 1099,
    compareAtPrice: 1599,
    description: "Tailored pleated trousers for the modern gentleman.",
    stockQuantity: 18,
    inStock: true,
    isPublished: true,
    images: ["/images/products/trouser-1.jpg"],
    color: { name: "Charcoal", hex: "#36454F", tone: "dark" },
    sizes: ["M", "L", "XL"],
    salesCount: 64,
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: "p5",
    name: "Linen Camp Collar Shirt",
    slug: "linen-camp-collar-shirt",
    category: "shirts",
    price: 1599,
    compareAtPrice: 2099,
    description: "Relaxed camp-collar shirt in pure linen for a resort feel.",
    stockQuantity: 8,
    inStock: true,
    isPublished: false,
    images: ["/images/products/shirt-2.jpg"],
    color: { name: "Sand Beige", hex: "#C2B280", tone: "light" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    salesCount: 22,
    createdAt: "2026-09-25T10:00:00Z",
  },
  {
    id: "p6",
    name: "Graphic Crew Neck Tee",
    slug: "graphic-crew-neck-tee",
    category: "t-shirts",
    price: 599,
    compareAtPrice: 899,
    description: "Eye-catching graphic tee with a relaxed fit.",
    stockQuantity: 72,
    inStock: true,
    isPublished: true,
    images: ["/images/products/tshirt-2.jpg"],
    color: { name: "Jet Black", hex: "#0A0A0A", tone: "dark" },
    sizes: ["S", "M", "L", "XL"],
    salesCount: 340,
    createdAt: "2026-09-28T10:00:00Z",
  },
  {
    id: "p7",
    name: "Relaxed Fit Cargo Jeans",
    slug: "relaxed-fit-cargo-jeans",
    category: "jeans",
    price: 1799,
    compareAtPrice: null,
    description: "Utility-inspired cargo jeans with oversized pockets.",
    stockQuantity: 3,
    inStock: true,
    isPublished: true,
    images: ["/images/products/jeans-2.jpg"],
    color: { name: "Washed Grey", hex: "#9E9E9E", tone: "light" },
    sizes: ["L", "XL", "XXL"],
    salesCount: 15,
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "p8",
    name: "Chino Slim Trousers",
    slug: "chino-slim-trousers",
    category: "trousers",
    price: 999,
    compareAtPrice: 1399,
    description: "Smart-casual chinos in a modern slim silhouette.",
    stockQuantity: 55,
    inStock: true,
    isPublished: true,
    images: ["/images/products/trouser-2.jpg"],
    color: { name: "Olive", hex: "#556B2F", tone: "dark" },
    sizes: ["S", "M", "L", "XL"],
    salesCount: 89,
    createdAt: "2026-10-02T10:00:00Z",
  },
];

// ── Orders ──────────────────────────────────
export let MOCK_ORDERS: MockOrder[] = [
  {
    id: "o1",
    orderNumber: "SRG-001001",
    customer: { name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98765 43210" },
    shippingAddress: { line1: "42 MG Road", city: "Bangalore", state: "Karnataka", pincode: "560001" },
    items: [
      { name: "Premium Cotton Oxford Shirt", price: 1299, quantity: 2, size: "L", color: "Sky Blue", image: "/images/products/shirt-1.jpg" },
      { name: "Slim Fit Stretch Jeans", price: 1499, quantity: 1, size: "M", color: "Dark Indigo", image: "/images/products/jeans-1.jpg" },
    ],
    subtotal: 4097,
    shipping: 0,
    discount: 200,
    total: 3897,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    createdAt: "2026-10-01T14:30:00Z",
  },
  {
    id: "o2",
    orderNumber: "SRG-001002",
    customer: { name: "Priya Patel", email: "priya.p@gmail.com", phone: "+91 87654 32109" },
    shippingAddress: { line1: "15 Nehru Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380015" },
    items: [
      { name: "Classic Polo T-Shirt", price: 799, quantity: 3, size: "M", color: "Navy", image: "/images/products/tshirt-1.jpg" },
    ],
    subtotal: 2397,
    shipping: 99,
    discount: 0,
    total: 2496,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Razorpay",
    createdAt: "2026-10-02T09:15:00Z",
  },
  {
    id: "o3",
    orderNumber: "SRG-001003",
    customer: { name: "Amit Kumar", email: "amit.k@outlook.com", phone: "+91 76543 21098" },
    shippingAddress: { line1: "8B Sector 22", city: "Noida", state: "Uttar Pradesh", pincode: "201301" },
    items: [
      { name: "Formal Pleated Trousers", price: 1099, quantity: 1, size: "XL", color: "Charcoal", image: "/images/products/trouser-1.jpg" },
      { name: "Graphic Crew Neck Tee", price: 599, quantity: 2, size: "L", color: "Jet Black", image: "/images/products/tshirt-2.jpg" },
    ],
    subtotal: 2297,
    shipping: 0,
    discount: 100,
    total: 2197,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "COD",
    createdAt: "2026-10-03T16:45:00Z",
  },
  {
    id: "o4",
    orderNumber: "SRG-001004",
    customer: { name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "+91 65432 10987" },
    shippingAddress: { line1: "23 Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033" },
    items: [
      { name: "Linen Camp Collar Shirt", price: 1599, quantity: 1, size: "S", color: "Sand Beige", image: "/images/products/shirt-2.jpg" },
    ],
    subtotal: 1599,
    shipping: 99,
    discount: 0,
    total: 1698,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    createdAt: "2026-10-04T11:20:00Z",
  },
  {
    id: "o5",
    orderNumber: "SRG-001005",
    customer: { name: "Vikram Singh", email: "vikram.s@yahoo.com", phone: "+91 54321 09876" },
    shippingAddress: { line1: "101 Civil Lines", city: "Jaipur", state: "Rajasthan", pincode: "302006" },
    items: [
      { name: "Relaxed Fit Cargo Jeans", price: 1799, quantity: 1, size: "XL", color: "Washed Grey", image: "/images/products/jeans-2.jpg" },
      { name: "Chino Slim Trousers", price: 999, quantity: 1, size: "L", color: "Olive", image: "/images/products/trouser-2.jpg" },
    ],
    subtotal: 2798,
    shipping: 0,
    discount: 0,
    total: 2798,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "COD",
    createdAt: "2026-10-05T08:00:00Z",
  },
  {
    id: "o6",
    orderNumber: "SRG-001006",
    customer: { name: "Deepa Nair", email: "deepa.n@gmail.com", phone: "+91 43210 98765" },
    shippingAddress: { line1: "7 Marine Drive", city: "Kochi", state: "Kerala", pincode: "682001" },
    items: [
      { name: "Premium Cotton Oxford Shirt", price: 1299, quantity: 1, size: "M", color: "Sky Blue", image: "/images/products/shirt-1.jpg" },
    ],
    subtotal: 1299,
    shipping: 99,
    discount: 50,
    total: 1348,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Razorpay",
    createdAt: "2026-10-05T12:30:00Z",
  },
];

// ── Customers ───────────────────────────────
export let MOCK_CUSTOMERS: MockCustomer[] = [
  { id: "c1", name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 98765 43210", totalOrders: 5, totalSpent: 12450, createdAt: "2026-08-10T10:00:00Z" },
  { id: "c2", name: "Priya Patel", email: "priya.p@gmail.com", phone: "+91 87654 32109", totalOrders: 3, totalSpent: 7890, createdAt: "2026-08-22T10:00:00Z" },
  { id: "c3", name: "Amit Kumar", email: "amit.k@outlook.com", phone: "+91 76543 21098", totalOrders: 2, totalSpent: 4394, createdAt: "2026-09-05T10:00:00Z" },
  { id: "c4", name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "+91 65432 10987", totalOrders: 1, totalSpent: 1698, createdAt: "2026-09-18T10:00:00Z" },
  { id: "c5", name: "Vikram Singh", email: "vikram.s@yahoo.com", phone: "+91 54321 09876", totalOrders: 4, totalSpent: 9560, createdAt: "2026-09-01T10:00:00Z" },
  { id: "c6", name: "Deepa Nair", email: "deepa.n@gmail.com", phone: "+91 43210 98765", totalOrders: 1, totalSpent: 1348, createdAt: "2026-10-01T10:00:00Z" },
  { id: "c7", name: "Karan Mehta", email: "karan.m@gmail.com", phone: "+91 99887 76655", totalOrders: 7, totalSpent: 18200, createdAt: "2026-07-15T10:00:00Z" },
  { id: "c8", name: "Ananya Iyer", email: "ananya@gmail.com", phone: "+91 88776 65544", totalOrders: 2, totalSpent: 3598, createdAt: "2026-09-28T10:00:00Z" },
];

// ── Dashboard Stats ─────────────────────────
export function getDashboardStats() {
  const totalRevenue = MOCK_ORDERS
    .filter((o) => o.status === "delivered" || o.status === "shipped")
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = MOCK_ORDERS.length;
  const totalProducts = MOCK_PRODUCTS.length;
  const totalCustomers = MOCK_CUSTOMERS.length;

  const lowStockProducts = MOCK_PRODUCTS.filter(
    (p) => p.inStock && p.stockQuantity <= 10
  );

  const topProducts = [...MOCK_PRODUCTS]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders: MOCK_ORDERS.slice(0, 5),
    lowStockProducts,
    topProducts,
  };
}
