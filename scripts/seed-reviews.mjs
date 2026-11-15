import mongoose from "mongoose";

const INITIAL_REVIEWS_BY_SLUG = {
  "loose-fit-baggy-denim-jeans": [
    {
      name: "Sunil Maharana",
      email: "sunil.m@example.com",
      rating: 5,
      review:
        "Top tier denim! The baggy fit sits naturally over my sneakers without dragging on the floor. Heavyweight authentic denim that softens after first wash.",
      isVerifiedPurchase: true,
    },
    {
      name: "Amit Pattnaik",
      email: "amit.pattnaik@gmail.com",
      rating: 5,
      review:
        "Finding true 90s baggy jeans in India is so hard, but SriRam Garments nailed this silhouette. Waist is true to size and thigh room is unmatched.",
      isVerifiedPurchase: true,
    },
    {
      name: "Rahul Sharma",
      email: "rahul.s@outlook.com",
      rating: 4,
      review:
        "Really good quality denim and stitching. Pocket depth is great. Just took 4 days to arrive in Bangalore, otherwise 5 stars.",
      isVerifiedPurchase: true,
    },
    {
      name: "Deepak Sahoo",
      email: "deepak.sahoo@yahoo.com",
      rating: 5,
      review:
        "The wash and color tone look even better in person than photos. Very comfortable for all-day streetwear.",
      isVerifiedPurchase: false,
    },
  ],
  "wide-leg-stan-collar-tee": [
    {
      name: "Vikramaditya Rao",
      email: "vikram.rao@gmail.com",
      rating: 5,
      review:
        "The stand collar is structured and doesn't bacon or roll after washing. 240 GSM weight feels substantial and luxurious.",
      isVerifiedPurchase: true,
    },
    {
      name: "Priya Verma",
      email: "priya.verma@hotmail.com",
      rating: 5,
      review:
        "Bought this oversized for a relaxed boxy look. Love the clean neckline and deep jet black shade.",
      isVerifiedPurchase: true,
    },
    {
      name: "Karan Joshi",
      email: "karan.j@gmail.com",
      rating: 4,
      review:
        "Very premium cotton drape. Breathable despite the heavyweight cloth. Definitely getting the other colors too.",
      isVerifiedPurchase: true,
    },
  ],
  "crop-boxy-drop-shoulder-tee": [
    {
      name: "Ananya Sen",
      email: "ananya.sen@gmail.com",
      rating: 5,
      review:
        "Hits right above high-waisted jeans. Boxy cut gives that effortless aesthetic. Cotton is bio-washed and super soft.",
      isVerifiedPurchase: true,
    },
    {
      name: "Meera Nair",
      email: "meera.nair@outlook.com",
      rating: 4,
      review:
        "Very chic silhouette. Sand beige color is versatile and aesthetic for daily wear.",
      isVerifiedPurchase: true,
    },
  ],
  "heavyweight-oversized-tee": [
    {
      name: "Rohan Gupta",
      email: "rohan.g@gmail.com",
      rating: 5,
      review:
        "Legit streetwear quality! The collar ribbing is thick and stays sharp. Dropped shoulders are tailored just right.",
      isVerifiedPurchase: true,
    },
    {
      name: "Manish Paul",
      email: "manish.p@gmail.com",
      rating: 5,
      review:
        "Best oversized tee under ₹1000 in India. Fabric feels like international heavyweight blanks.",
      isVerifiedPurchase: true,
    },
  ],
  "premium-linen-mandarin-shirt": [
    {
      name: "Arjun Reddy",
      email: "arjun.r@gmail.com",
      rating: 5,
      review:
        "Pure linen perfection. Keeps me cool during humid afternoons. The mandarin collar gives an elevated classic vibe.",
      isVerifiedPurchase: true,
    },
    {
      name: "Suresh Kumar",
      email: "suresh.kumar@yahoo.com",
      rating: 5,
      review:
        "Finishing and seams are immaculate. Fits great across shoulders and chest. Highly recommend!",
      isVerifiedPurchase: true,
    },
  ],
  "slim-tapered-stretch-denim": [
    {
      name: "Naveen Patnaik",
      email: "naveen.p@gmail.com",
      rating: 5,
      review:
        "The stretch is subtle and doesn't lose shape after wearing all day. Ankle taper looks very sharp with leather boots.",
      isVerifiedPurchase: true,
    },
    {
      name: "Gaurav Malhotra",
      email: "gaurav.m@gmail.com",
      rating: 4,
      review:
        "Deep indigo dye with nice whiskering. Material is durable and comfortable for motorcycle rides.",
      isVerifiedPurchase: true,
    },
  ],
  "pleated-korean-wide-trouser": [
    {
      name: "Aditya Roy",
      email: "aditya.roy@gmail.com",
      rating: 5,
      review:
        "The drape on these trousers is out of this world! Front pleats fall cleanly and look amazing with chunky loafers.",
      isVerifiedPurchase: true,
    },
  ],
  "check-casual-oxford-shirt": [
    {
      name: "Harish Chandra",
      email: "harish.c@gmail.com",
      rating: 5,
      review:
        "Great shirt for both casual workdays and weekends. Cotton is durable and breathable.",
      isVerifiedPurchase: true,
    },
  ],
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in environment!");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB!");

  const db = mongoose.connection.db;

  // Drop or clear reviews collection
  await db.collection("reviews").deleteMany({});
  console.log("Cleared existing reviews collection.");

  const products = await db.collection("products").find({}).toArray();
  console.log(`Found ${products.length} products in DB.`);

  let totalSeeded = 0;

  for (const product of products) {
    const list = INITIAL_REVIEWS_BY_SLUG[product.slug] || [
      {
        name: "Abhishek Das",
        email: "abhishek.d@gmail.com",
        rating: 5,
        review: `Excellent build quality for ${product.name}. Stitching, color retention, and fabric feel are top-notch.`,
        isVerifiedPurchase: true,
      },
    ];

    const insertedDocs = [];
    for (const item of list) {
      const doc = {
        productId: product._id,
        name: item.name,
        email: item.email,
        rating: item.rating,
        review: item.review,
        isVerifiedPurchase: item.isVerifiedPurchase,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const res = await db.collection("reviews").insertOne(doc);
      insertedDocs.push({ ...doc, _id: res.insertedId });
      totalSeeded++;
    }

    // Exact fraction rating calculation
    const sum = insertedDocs.reduce((acc, curr) => acc + curr.rating, 0);
    const count = insertedDocs.length;
    const avgRating = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;

    await db.collection("products").updateOne(
      { _id: product._id },
      { $set: { rating: avgRating, reviewCount: count } }
    );

    console.log(
      `✓ [${product.slug}] Seeded ${count} reviews. Exact Rating: ${avgRating.toFixed(1)} / 5 (${count} reviews)`
    );
  }

  console.log(`\nSuccessfully seeded ${totalSeeded} reviews into MongoDB!`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});

