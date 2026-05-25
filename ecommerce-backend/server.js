const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server backend cho hệ thống E-commerce đang chạy ngon lành!');
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
})
