const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MSME DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    category: { type: String, required: true },
    mainProduct: { type: String, required: true },
    orderHistory: [{
        orderId: String,
        productName: String,
        orderDate: Date,
        expectedDate: Date,
        actualDate: Date, 
        status: { type: String, default: 'Pending' }, 
        price: Number
    }],
    risk: { type: String, default: 'Low' },
    score: { type: Number, default: 100 }
}, { timestamps: true });

// Risk Calculation Logic - Using async to avoid next() issues
supplierSchema.pre('save', async function () {
    const supplier = this;
    if (supplier.orderHistory.length > 0) {
        let delayedCount = 0;
        supplier.orderHistory.forEach(order => {
            if (order.actualDate && order.expectedDate) {
                if (new Date(order.actualDate) > new Date(order.expectedDate)) {
                    order.status = 'Delayed';
                    delayedCount++;
                } else {
                    order.status = 'On-Time';
                }
            }
        });
        const delayRate = (delayedCount / supplier.orderHistory.length) * 100;
        supplier.risk = delayRate > 25 ? 'High' : (delayRate > 10 ? 'Medium' : 'Low');
        supplier.score = Math.max(0, 100 - (delayRate * 1.5));
    }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

// --- API Routes ---
app.get('/api/suppliers', async (req, res) => {
    try {
        const data = await Supplier.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/suppliers', async (req, res) => {
    try {
        const { name, contact, category, mainProduct, orderDate, expectedDate, price } = req.body;
        const newSupplier = new Supplier({
            name, contact, category, mainProduct,
            orderHistory: [{
                orderId: "INV-" + Math.floor(Math.random() * 9000),
                productName: mainProduct,
                orderDate, expectedDate, price, status: 'Pending'
            }]
        });
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/suppliers/:id/complete-order/:orderId', async (req, res) => {
    try {
        const { actualDate } = req.body;
        const s = await Supplier.findById(req.params.id);
        const order = s.orderHistory.id(req.params.orderId);
        order.actualDate = actualDate;
        await s.save();
        res.json(s);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/suppliers/:id/new-order', async (req, res) => {
    try {
        const { productName, orderDate, expectedDate, price } = req.body;
        const s = await Supplier.findById(req.params.id);
        s.orderHistory.push({
            orderId: "INV-" + Math.floor(Math.random() * 9000),
            productName, orderDate, expectedDate, price, status: 'Pending'
        });
        await s.save();
        res.json(s);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- Deployment Logic ---
const PORT = process.env.PORT || 5000; // 👈 Fixed: Define PORT properly

// Serve Static Files from React
app.use(express.static(path.join(__dirname, "../client/build"))); 

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});