const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const articleRouter = require('./routes/article');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/v1/article', articleRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
