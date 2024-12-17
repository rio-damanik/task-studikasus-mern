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
  {
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, udang, dan sayuran segar",
    price: 35000,
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90", "656c0eb807d3e9dbe63afa91"]
  },
  {
    name: "Mie Goreng Seafood",
    description: "Mie goreng dengan campuran seafood segar dan sayuran",
    price: 40000,
    image_url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa90"]
  },
  {
    name: "Es Teh Manis",
    description: "Teh manis segar dengan es batu",
    price: 8000,
    image_url: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
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
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu dan sirup coklat",
    price: 15000,
    image_url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500",
    category: "656c0eb807d3e9dbe63afa92",
    tags: ["656c0eb807d3e9dbe63afa93"]
  },
  {
    name: "Gado-gado",
    description: "Sayuran segar dengan bumbu kacang dan kerupuk",
    price: 25000,
    image_url: "https://images.unsplash.com/photo-1512058533999-59d3c490ddb3?w=500",
    category: "656c0eb807d3e9dbe63afa89",
    tags: ["656c0eb807d3e9dbe63afa94", "656c0eb807d3e9dbe63afa95"]
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
