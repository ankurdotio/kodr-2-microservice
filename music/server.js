import app from './src/app.js';
import connectDB from './src/db/db.js';

connectDB();

app.listen(3002, () => {
    console.log('Server is running on port 3002');
})