const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes')



const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json()); 

app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes)




app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
