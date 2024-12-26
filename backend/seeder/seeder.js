const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const uri = 'mongodb://localhost:27017/pos_db_new2';
const client = new MongoClient(uri);

// Tags data
const tags = [
  { _id: "656c0eb807d3e9dbe63afa90", name: "Pedas" },
  { _id: "656c0eb807d3e9dbe63afa91", name: "Populer" },
  { _id: "656c0eb807d3e9dbe63afa93", name: "Dingin" },
  { _id: "656c0eb807d3e9dbe63afa94", name: "Vegetarian" },
  { _id: "656c0eb807d3e9dbe63afa95", name: "Halal" },
  { _id: "656c0eb807d3e9dbe63afa97", name: "Goreng" },
  { _id: "656c0eb807d3e9dbe63afa98", name: "Berkuah" },
  { _id: "656c0eb807d3e9dbe63afa99", name: "Bakar" },
  { _id: "656c0eb807d3e9dbe63afa9a", name: "Seafood" }
];

// Categories data
const categories = [
  {
    _id: "656c0eb807d3e9dbe63afa89",
    name: "Makanan",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa95", 
           "656c0eb807d3e9dbe63afa97", "656c0eb807d3e9dbe63afa98", "656c0eb807d3e9dbe63afa99", "656c0eb807d3e9dbe63afa9a"]
  },
  {
    _id: "656c0eb807d3e9dbe63afa92",
    name: "Minuman",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  },
  {
    _id: "656c0eb807d3e9dbe63afa96",
    name: "Dessert",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  }
];

// Admin user data
const adminUser = {
  _id: "admin_" + new Date().getTime(),
  full_name: "Super Admin",
  email: "superadmin@pos.com",
  password: bcrypt.hashSync("admin123", 10),
  role: "admin",
  token: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Users data
const users = [
  {
    full_name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
    token: []
  },
  {
    full_name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
    token: []
  }
];

// Products data
const products = [
  // Kategori Makanan
  {
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, udang, dan sayuran segar",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa97", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Mie Goreng Seafood",
    description: "Mie goreng dengan udang, cumi, dan sayuran",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa97", "656c0eb807d3e9dbe63afa9a", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Sop Buntut",
    description: "Sop buntut sapi dengan kuah bening dan sayuran segar",
    price: 45000,
    image_url: "/images/products/sop-buntut.png",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa98", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ikan Bakar Kecap",
    description: "Ikan gurame bakar dengan bumbu kecap special",
    price: 65000,
    image_url: "/images/products/ikan-bakar.png",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa99", "656c0eb807d3e9dbe63afa9a", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ayam Goreng Crispy",
    description: "Ayam goreng crispy dengan tepung special",
    price: 30000,
    image_url: "/images/products/ayam-crispy.png",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa97", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ayam Bakar",
    description: "Ayam bakar bumbu special dengan sambal dan lalapan",
    price: 45000,
    image_url: "https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa99", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Gado-gado",
    description: "Sayuran segar dengan bumbu kacang dan kerupuk",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1512058533999-59d3c490ddb3?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Sate Ayam",
    description: "Sate ayam dengan bumbu kacang special",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa99", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Rendang Daging",
    description: "Daging sapi dimasak dengan rempah-rempah khas Padang",
    price: 50000,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Soto Ayam",
    description: "Soto ayam dengan kuah bening dan ayam suwir",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa98", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Bakso Spesial",
    description: "Bakso daging sapi dengan mie dan pangsit",
    price: 30000,
    image_url: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa98", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Capcay Seafood",
    description: "Tumis sayuran campur dengan seafood segar",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1512058533999-a3d718f1768f?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa9a", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ayam Geprek",
    description: "Ayam goreng tepung yang digeprek dengan sambal pedas",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Nasi Uduk Komplit",
    description: "Nasi uduk dengan ayam goreng, tempe, dan sambal",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1512058533999-a3d718f1768f?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Nasi Campur Bali",
    description: "Nasi dengan berbagai lauk khas Bali",
    price: 38000,
    image_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa95"]
  },

  // Kategori Minuman
  {
    name: "Es Teh Manis",
    description: "Teh manis dingin yang menyegarkan",
    price: 8000,
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Thai Tea",
    description: "Thai tea dengan susu segar",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Es Jeruk",
    description: "Jeruk segar yang menyegarkan",
    price: 10000,
    image_url: "https://images.unsplash.com/photo-1587015566802-5dc157c901cf?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Es Kopi Susu",
    description: "Kopi susu dengan gula aren",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu",
    price: 15000,
    image_url: "/images/products/jus-alpukat.png",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Es Campur",
    description: "Campuran buah-buahan, cincau, dan sirup dengan susu",
    price: 18000,
    image_url: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Lemon Tea",
    description: "Teh dengan perasan lemon segar dan es",
    price: 12000,
    image_url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Smoothie Buah",
    description: "Smoothie dari campuran buah-buahan segar",
    price: 20000,
    image_url: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },

  // Kategori Dessert
  {
    name: "Classic Chocolate Pudding",
    description: "Pudding coklat lembut dengan saus vanilla",
    price: 20000,
    image_url: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=500",
    category: "656c0eb807d3e9dbe63afa96",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Vanilla Ice Cream",
    description: "Es krim vanilla lembut dengan topping",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=500",
    category: "656c0eb807d3e9dbe63afa96",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Strawberry Ice Cream",
    description: "Fresh strawberry ice cream made with real fruit",
    price: 22000,
    image_url: "/images/products/ice-cream-strawberry.png",
    category: "656c0eb807d3e9dbe63afa96",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Caramel Pudding",
    description: "Classic caramel pudding with smooth texture",
    price: 23000,
    image_url: "/images/products/pudding-caramel.png",
    category: "656c0eb807d3e9dbe63afa96",
    tags: ["656c0eb807d3e9dbe63afa91"]
  }
];  

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('pos_db_new2');

    // Clear existing data
    await database.collection('tags').deleteMany({});
    await database.collection('categories').deleteMany({});
    await database.collection('users').deleteMany({});
    await database.collection('products').deleteMany({});
    console.log('Existing data cleared');

    // Insert tags
    const tagsResult = await database.collection('tags').insertMany(tags);
    console.log(`${tagsResult.insertedCount} tags inserted`);

    // Insert categories
    const categoriesResult = await database.collection('categories').insertMany(categories);
    console.log(`${categoriesResult.insertedCount} categories inserted`);

    // Insert admin user
    await database.collection('users').insertOne(adminUser);
    console.log('Admin user seeded');

    // Insert users
    const usersResult = await database.collection('users').insertMany(users);
    console.log(`${usersResult.insertedCount} users inserted`);

    // Insert products
    const productsResult = await database.collection('products').insertMany(products);
    console.log(`${productsResult.insertedCount} products inserted`);

    console.log('Database seeding completed successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
seedDatabase().catch(console.error);