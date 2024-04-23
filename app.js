const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sparepartRoutes = require('./routes/sparepartRoutes');
const restockRoutes = require('./routes/restockRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/sparepart', sparepartRoutes);
app.use('/restock', restockRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
