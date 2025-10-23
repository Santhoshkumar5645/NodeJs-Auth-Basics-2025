require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const app = express();
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require('./routes/image-routes')
// connect to database
connectToDB();

// middleware ==> express.json()
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/image', uploadImageRoutes)
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
