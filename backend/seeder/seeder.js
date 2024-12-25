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
  { _id: "656c0eb807d3e9dbe63afa95", name: "Halal" }
];

// Categories data
const categories = [
  {
    _id: "656c0eb807d3e9dbe63afa89",
    name: "Makanan",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa95"]
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

// Users data
const users = [
  {
    full_name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    token: []
  },
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
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa90"]
  },
  {
    name: "Mie Goreng Seafood",
    description: "Mie goreng dengan udang, cumi, dan sayuran",
    price: 28000,
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa90"]
  },
  {
    name: "Sop Buntut",
    description: "Sop buntut sapi dengan kuah bening dan sayuran segar",
    price: 45000,
    image_url: "/images/products/sop-buntut.png",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ikan Bakar Kecap",
    description: "Ikan gurame bakar dengan bumbu kecap special",
    price: 65000,
    image_url: "/images/products/ikan-bakar.png",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ayam Goreng Crispy",
    description: "Ayam goreng crispy dengan tepung special",
    price: 30000,
    image_url: "/images/products/ayam-crispy.png",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Ayam Bakar",
    description: "Ayam bakar bumbu special dengan sambal dan lalapan",
    price: 45000,
    image_url: "https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
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
    description: "Sate ayam dengan bumbu kacang dan lontong",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Rendang Daging",
    description: "Daging sapi dimasak dengan rempah-rempah khas Padang",
    price: 50000,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Soto Ayam",
    description: "Sup ayam tradisional dengan bumbu kuning dan pelengkap",
    price: 30000,
    image_url: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Bakso Spesial",
    description: "Bakso daging sapi dengan mie dan kuah kaldu",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa95"]
  },
  {
    name: "Capcay Seafood",
    description: "Tumis sayuran campur dengan seafood segar",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1512058533999-a3d718f1768f?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa94"]
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
    description: "Teh manis segar dengan es batu",
    price: 5000,
    image_url: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Thai Tea",
    description: "Thai tea autentik dengan susu",
    price: 15000,
    image_url: "/images/products/thai-tea.png",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa91", "656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Es Jeruk",
    description: "Jeruk segar diperas langsung",
    price: 8000,
    image_url: "/images/products/es-jeruk.png",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Es Kopi Susu",
    description: "Kopi susu dengan gula aren",
    price: 18000,
    image_url: "/images/products/es-kopi.png",
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
    description: "Smooth and creamy chocolate pudding topped with whipped cream",
    price: 25000,
    image_url: "/images/products/pudding-chocolate.png",
    category: "656c0eb807d3e9dbe63afa96",
    tags: ["656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Vanilla Ice Cream",
    description: "Creamy vanilla ice cream with natural Madagascar vanilla",
    price: 20000,
    image_url: "/images/products/ice-cream-vanilla.png",
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
