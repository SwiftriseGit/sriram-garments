import mongoose from "mongoose";
import connectDB from "../lib/db";
import UserModel from "../lib/models/User";
import ProductModel from "../lib/models/Product";
import OrderModel from "../lib/models/Order";

const SAMPLE_PRODUCTS = [
  {
    name: "Wide Leg Stan Collar Tee",
    slug: "wide-leg-stan-collar-tee",
    styleId: "STYLE-STAN-COLLAR",
    category: "t-shirts",
    originalPrice: 1499,
    salePrice: 1299,
    isSale: true,
    discountPercent: 13,
    couponCode: "SWIFT10",
    couponDiscount: 150,
    description: "A heavyweight tee with a structured stand collar that sits clean around the neck. Built for everyday wear with a relaxed silhouette that drapes well.",
    highlights: ["Stand collar with clean stitch", "Dropped shoulders", "Pre-shrunk 240 GSM cotton"],
    fabric: "100% combed cotton, 240 GSM",
    fit: "Relaxed boxy fit",
    color: { name: "Jet Black", hex: "#1c1c1f", tone: "dark" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 45,
    rating: 4.8,
    reviewCount: 42,
    salesCount: 0,
    addedRank: 1,
    isPublished: true,
  },
  {
    name: "Crop Boxy Drop-Shoulder Tee",
    slug: "crop-boxy-drop-shoulder-tee",
    styleId: "STYLE-BOXY-CROP",
    category: "t-shirts",
    originalPrice: 1099,
    salePrice: 899,
    isSale: true,
    discountPercent: 18,
    couponCode: "SUMMER15",
    couponDiscount: 100,
    description: "Short, square, and effortless. Hits right above the hip line to pair perfectly with high-waist trousers and wide-leg denim.",
    highlights: ["Cropped boxy length", "Ribbed crew neck", "Bio-washed for cloud-soft handfeel"],
    fabric: "100% cotton jersey, 220 GSM",
    fit: "Boxy cropped fit",
    color: { name: "Sand Beige", hex: "#e6dac6", tone: "light" },
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 60,
    rating: 4.7,
    reviewCount: 38,
    salesCount: 0,
    addedRank: 2,
    isPublished: true,
  },
  {
    name: "Heavyweight Oversized Tee",
    slug: "heavyweight-oversized-tee",
    styleId: "STYLE-HEAVY-OVERSIZED",
    category: "t-shirts",
    originalPrice: 1299,
    salePrice: 999,
    isSale: true,
    discountPercent: 23,
    couponCode: "FIRST50",
    couponDiscount: 50,
    description: "Streetwear aesthetic engineered for durability. Features double-needle cover-stitched hems and high-grade 260 GSM fabric.",
    highlights: ["260 GSM Ultra Heavy Cotton", "Ribbed anti-sag collar", "Fade-resistant dye"],
    fabric: "100% Combed Compact Cotton",
    fit: "True Oversized Fit",
    color: { name: "Olive Green", hex: "#4d5b3a", tone: "dark" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 80,
    rating: 4.9,
    reviewCount: 84,
    salesCount: 0,
    addedRank: 3,
    isPublished: true,
  },
  {
    name: "Check Casual Oxford Shirt",
    slug: "check-casual-oxford-shirt",
    styleId: "STYLE-CHECK-OXFORD",
    category: "shirts",
    originalPrice: 1899,
    salePrice: 1499,
    isSale: true,
    discountPercent: 21,
    couponCode: "SAVE20",
    couponDiscount: 200,
    description: "Yarn-dyed cotton check shirt crafted with modern button-down collar and tailored sleeves. Perfect for smart-casual weekends.",
    highlights: ["Yarn-dyed pattern", "Curved split hem", "Reinforced chest pocket"],
    fabric: "100% Breathable Cotton",
    fit: "Regular tailored fit",
    color: { name: "Stone Check", hex: "#e2dfdc", tone: "light" },
    sizes: ["M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 35,
    rating: 4.6,
    reviewCount: 29,
    salesCount: 0,
    addedRank: 4,
    isPublished: true,
  },
  {
    name: "Premium Linen Mandarin Shirt",
    slug: "premium-linen-mandarin-shirt",
    styleId: "STYLE-LINEN-MANDARIN",
    category: "shirts",
    originalPrice: 2299,
    salePrice: 1799,
    isSale: true,
    discountPercent: 22,
    couponCode: "LUXE10",
    couponDiscount: 250,
    description: "Pure French flax linen shirt with an open mandarin collar. Ultra-breathable, cooling, and gracefully crinkles for resort-ready elegance.",
    highlights: ["100% French Linen", "Mandarin band collar", "Mother of pearl finish buttons"],
    fabric: "100% Pure Linen",
    fit: "Relaxed Resort Fit",
    color: { name: "Off White", hex: "#ececee", tone: "light" },
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 28,
    rating: 4.9,
    reviewCount: 52,
    salesCount: 0,
    addedRank: 5,
    isPublished: true,
  },
  {
    name: "Loose Fit Baggy Denim Jeans",
    slug: "loose-fit-baggy-denim-jeans",
    styleId: "STYLE-BAGGY-JEANS",
    category: "jeans",
    originalPrice: 2499,
    salePrice: 1999,
    isSale: true,
    discountPercent: 20,
    couponCode: "DENIM200",
    couponDiscount: 200,
    description: "Nineties throwback skate denim featuring relaxed seat and wide straight leg drape that pools cleanly over sneakers.",
    highlights: ["13.5 oz Rigid Denim", "Deep five-pocket styling", "Custom branded rivets"],
    fabric: "100% Cotton Denim",
    fit: "Baggy Wide Straight Fit",
    color: { name: "Light Wash", hex: "#a9bcd4", tone: "light" },
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 40,
    rating: 4.8,
    reviewCount: 65,
    salesCount: 0,
    addedRank: 6,
    isPublished: true,
  },
  {
    name: "Slim Tapered Stretch Denim",
    slug: "slim-tapered-stretch-denim",
    styleId: "STYLE-SLIM-TAPERED",
    category: "jeans",
    originalPrice: 2199,
    salePrice: 1699,
    isSale: true,
    discountPercent: 23,
    couponCode: "JEANS100",
    couponDiscount: 100,
    description: "Slim through the thigh with a clean taper down to the ankle. 2% elastane woven into raw indigo yarn allows all-day flexibility.",
    highlights: ["Flex stretch weave", "YKK brass zip fly", "Fade whiskering"],
    fabric: "98% Cotton, 2% Elastane",
    fit: "Slim Tapered",
    color: { name: "Deep Indigo", hex: "#2b3a67", tone: "dark" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.7,
    reviewCount: 44,
    salesCount: 0,
    addedRank: 7,
    isPublished: true,
  },
  {
    name: "Pleated Korean Wide Trouser",
    slug: "pleated-korean-wide-trouser",
    styleId: "STYLE-KOREAN-TROUSER",
    category: "trousers",
    originalPrice: 1999,
    salePrice: 1599,
    isSale: true,
    discountPercent: 20,
    couponCode: "SAVE10",
    couponDiscount: 150,
    description: "Double front pleats with elastic-inset waistband tabs. Flowing poly-viscose drape tailored for minimalist Seoul streetstyle.",
    highlights: ["Double forward pleats", "Side waist adjusters", "Wrinkle-resistant twill"],
    fabric: "65% Polyester, 35% Viscose",
    fit: "Wide Leg Pleated",
    color: { name: "Charcoal Grey", hex: "#3f3f46", tone: "dark" },
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 32,
    rating: 4.8,
    reviewCount: 31,
    salesCount: 0,
    addedRank: 8,
    isPublished: true,
  },
  {
    name: "Utility Cargo Parachute Pants",
    slug: "utility-cargo-parachute-pants",
    styleId: "STYLE-PARACHUTE-CARGO",
    category: "trousers",
    originalPrice: 2299,
    salePrice: 1849,
    isSale: true,
    discountPercent: 19,
    couponCode: "CARGO150",
    couponDiscount: 150,
    description: "Ripstop nylon cargo pants equipped with 6 utility pockets and drawstring bungee cuffs to adjust between wide-leg and jogger taper.",
    highlights: ["Adjustable ankle bungees", "Six deep functional pockets", "Water-repellent finish"],
    fabric: "100% Nylon Ripstop",
    fit: "Loose Adjustable Fit",
    color: { name: "Military Olive", hex: "#4d5b3a", tone: "dark" },
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80",
    ],
    inStock: true,
    stockQuantity: 48,
    rating: 4.7,
    reviewCount: 27,
    salesCount: 0,
    addedRank: 9,
    isPublished: true,
  },
];

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await connectDB();

  console.log("Checking existing data...");
  const existingProductCount = await ProductModel.countDocuments();
  console.log(`Found ${existingProductCount} existing products.`);

  // 1. Seed Admin User
  let admin = await UserModel.findOne({ email: "admin@swiftrise.com" });
  if (!admin) {
    admin = await UserModel.create({
      firstName: "Sunil",
      lastName: "Maharana",
      email: "admin@swiftrise.com",
      phone: "+91 9876543210",
      password: "AdminPassword123!",
      role: "admin",
      isActive: true,
    });
    console.log("✅ Admin user created: admin@swiftrise.com / AdminPassword123!");
  } else {
    admin.role = "admin";
    await admin.save();
    console.log("✅ Admin user verified: admin@swiftrise.com (role: admin)");
  }

  // 2. Seed Customer User
  let customer = await UserModel.findOne({ email: "customer@example.com" });
  if (!customer) {
    customer = await UserModel.create({
      firstName: "Rahul",
      lastName: "Sharma",
      email: "customer@example.com",
      phone: "+91 9123456789",
      password: "CustomerPassword123!",
      role: "customer",
      isActive: true,
    });
    console.log("✅ Sample customer user created: customer@example.com / CustomerPassword123!");
  }

  // 3. Seed Products if empty
  if (existingProductCount === 0) {
    console.log("Seeding initial products into MongoDB...");
    for (const p of SAMPLE_PRODUCTS) {
      await ProductModel.create(p as any);
    }
    console.log(`✅ ${SAMPLE_PRODUCTS.length} products seeded successfully!`);
  } else {
    console.log(`Products already present (${existingProductCount} items), skipping product insertion.`);
  }

  // 4. Seed a sample order if orders empty
  const orderCount = await OrderModel.countDocuments();
  if (orderCount === 0) {
    const firstProduct = await ProductModel.findOne().lean();
    if (firstProduct && customer) {
      await OrderModel.create({
        orderNumber: "SRG-001001",
        userId: customer._id,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },
        shippingAddress: {
          label: "Home",
          line1: "Flat 402, Green Valley Apartments",
          line2: "Near Metro Station, Sector 62",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201309",
        },
        items: [
          {
            productId: firstProduct._id.toString(),
            name: firstProduct.name,
            slug: firstProduct.slug,
            price: firstProduct.isSale && firstProduct.salePrice ? firstProduct.salePrice : firstProduct.originalPrice,
            originalPrice: firstProduct.originalPrice,
            quantity: 1,
            size: "L",
            color: firstProduct.color?.name || "Standard",
            image: firstProduct.images?.[0] || "",
          },
        ],
        subtotal: firstProduct.isSale && firstProduct.salePrice ? firstProduct.salePrice : firstProduct.originalPrice,
        shipping: 0,
        discount: 100,
        couponCode: "WELCOME100",
        couponDiscount: 100,
        total: (firstProduct.isSale && firstProduct.salePrice ? firstProduct.salePrice : firstProduct.originalPrice) - 100,
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "UPI",
      });
      console.log("✅ Sample order seeded: SRG-001001");
    }
  }

  console.log("🎉 Seeding complete! Database is fully connected and ready.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
