import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const mongodb_uri ="mongodb+srv://hijolopolo834:tSOGJpFVXImJRTbU@cluster0.nkuhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const uri = mongodb_uri;

const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("FinanceManagement");
    return db.collection("FinanceModal");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

export default connectToDB