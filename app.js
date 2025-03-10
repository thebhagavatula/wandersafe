// const express = require('express');  
// const connectDB = require('./config/db');  
// const postRoutes = require('./routes/postRoutes');  
// const userRoutes = require('./routes/userRoutes');  
// const mapRoutes = require('./routes/mapRoutes');  
// const errorHandler = require('./utils/errorHandler');  

// const app = express();  

// // Middleware  
// app.use(express.json());  

// // Routes  
// app.use('/api/posts', postRoutes);  
// app.use('/api/users', userRoutes);  
// app.use('/api/map', mapRoutes);  

// // Error handling  
// app.use(errorHandler);  

// // Connect to DB  
// connectDB();  

// module.exports = app;  

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res
    .status(200)
    .json({msg: 'Hello!', app: 'wandersafe'});
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening from ${port}`);
});

