const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f21lusd.mongodb.net/?retryWrites=true&w=majority`;
// console.log("uri is comming ", uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const shops = require("./shops.json");
    const shopsCollection = client.db("CameraShop").collection("Shops");
    // const newsCategory = require("./categories.json");
    const productsCollection = client.db("CameraShop").collection("Product");
    const userCollection = client.db("CameraShop").collection("users");
    const manyproductsCollection = client
      .db("CameraShop")
      .collection("Moreproducts");
    const cartCollection = client.db("CameraShop").collection("addcart");
    const cartTotallCollection = client
      .db("CameraShop")
      .collection("cartTotal");
    const confirmOrderCollection = client
      .db("CameraShop")
      .collection("confirmOrder");
    const reviewCollection = client.db("CameraShop").collection("reviews");

    app.get("/shops", async (req, res) => {
      const query = {};
      const options = await shopsCollection.find(query).toArray();
      // console.log("options : ", options);
      res.send(options);
    });

    app.get("/shop/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id : ", id);

      const selectedNews = await shops.find((n) => n.id === id);
      // console.log(selectedNews);
      res.send(selectedNews);
    });
    app.get("/especificprod/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/especificproduct/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await manyproductsCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const info = req.body;
      const result = await userCollection.insertOne(info);
      res.send(result);
    });
    app.post("/addtocart", async (req, res) => {
      const info = req.body;
      const result = await cartCollection.insertOne(info);
      res.send(result);
    });
    app.post("/cartTotal", async (req, res) => {
      const info = req.body;
      const result = await cartTotallCollection.insertOne(info);
      res.send(result);
    });
    app.post("/confirmorder", async (req, res) => {
      const info = req.body;
      const result = await confirmOrderCollection.insertOne(info);
      res.send(result);
    });
    app.post("/review", async (req, res) => {
      const info = req.body;
      console.log("info : ", info);
      const result = await reviewCollection.insertOne(info);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const product = req.query.product;

      const query = { product: product };

      const result = await reviewCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/confirmorder/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(filter);
      res.send(result);
    });

    app.get("/cartTotal", async (req, res) => {
      const query = {};
      const result = await cartTotallCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/addtocart", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };

      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/category", async (req, res) => {
      const shopName = req.query.name;

      const query = { shop_name: shopName };
      const options = await manyproductsCollection.find(query).toArray();

      // console.log(options);
      res.send(options);
    });

    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/manyproducts", async (req, res) => {
      const query = {};
      const result = await manyproductsCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`The port  is running on ${port}`);
});
