require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
const User = require("../db/models/User");
const Invoice = require("../db/models/Invoice");
const cors = require("@fastify/cors");

fastify.register(cors, {
  origin: "*", // for dev, allow all. In prod, replace with frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});


// Connect to MongoDB
async function connectDB() {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    fastify.log.info("Connected to MongoDB");
  } catch (err) {
    fastify.log.error("connection failed:", err);
    console.log(err)
    process.exit(1);
  }
}


//config

fastify.get("/config", async(request, reply) => {
    try {
        const Fee = process.env.Fee;
        reply.send({message: "Fee", Fee});
    } catch (err) {
        fastify.log.error(`Error getting Fee: ${err.message}`);
        reply.status(500).send({ error: err.message });
    }
});

// Routes

// Add a new user
fastify.post("/user", async (request, reply) => {
  try {
    const { wallet, kyc_status } = request.body;
    const user = new User({ wallet, kyc_status });
    await user.save();
    reply.send({ message: "User added", user });
    fastify.log.info(`User added: ${wallet}`);
  } catch (err) {
    fastify.log.error(`Error adding user: ${err.message}`);
    reply.status(500).send({ error: err.message });
  }
});

// Add a new invoice
fastify.post("/invoice", async (request, reply) => {
  try {
    const { id, wallet, amount, status } = request.body;
    const invoice = new Invoice({ id, wallet, amount, status });
    await invoice.save();
    reply.send({ message: "Invoice added", invoice });
    fastify.log.info(`Invoice added: id=${id}, wallet=${wallet}`);
  } catch (err) {
    fastify.log.error(`Error adding invoice: ${err.message}`);
    reply.status(500).send({ error: err.message });
  }
});

// Add a new invoice
fastify.put("/kyc/request", async (request, reply) => {
  try {
    const { wallet } = request.body;
    let user = await User.find({ wallet });
    user = await User.findOneAndUpdate({wallet: wallet},{kyc_status:true},{});
    reply.send({ message: "KYC Updated", user });
    fastify.log.info(`KYC Updated: ${user}`);
  } catch (err) {
    fastify.log.error(`Error updating KYC: ${err.message}`);
    reply.status(500).send({ error: err.message });
  }
});

// Query user + invoices by wallet
fastify.get("/wallet/:wallet", async (request, reply) => {
  try {
    const {wallet}  = request.params;
    const user = await User.find({ wallet });
    const invoices = await Invoice.find({ wallet });

    reply.send({ user, invoices });
    fastify.log.info(`Queried wallet: ${wallet}`);
  } catch (err) {
    fastify.log.error(`Error querying wallet: ${err.message}`);
    reply.status(500).send({ error: err.message });
  }
});

// Start server after DB connection
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server running at ${address}`);
  });
});
