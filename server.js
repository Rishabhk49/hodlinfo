const path = require('path');
const express = require('express');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

// Define a model
const Ticker = sequelize.define('Ticker', {
  base_unit: DataTypes.STRING,
  quote_unit: DataTypes.STRING,
  low: DataTypes.FLOAT,
  high: DataTypes.FLOAT,
  last: DataTypes.FLOAT,
  open: DataTypes.FLOAT,
  volume: DataTypes.FLOAT,
  sell: DataTypes.FLOAT,
  buy: DataTypes.FLOAT,
  at: DataTypes.INTEGER,
  name: DataTypes.STRING
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connection to PostgreSQL has been established successfully.'))
  .catch(err => console.error('Unable to connect to PostgreSQL:', err));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Fetch and store data route
app.get('/fetch-data', async (req, res) => {
  try {
    console.log('Fetching data from API...');
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10);

    console.log('Synchronizing database...');
    await sequelize.sync({ force: true });

    console.log('Storing fetched data into database...');
    for (let ticker of tickers) {
      await Ticker.create(ticker);
    }

    console.log('Data fetched and stored successfully.');
    res.send('Data fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching or storing data:', error.message);
    res.status(500).send(error.message);
  }
});

// Retrieve stored data route
app.get('/tickers', async (req, res) => {
  try {
    console.log('Retrieving stored data from database...');
    const tickers = await Ticker.findAll();
    const tickerData = tickers.map((ticker, index) => {
      return {
        sr_no: index + 1,
        ...ticker.toJSON()
      };
    });

    console.log('Data retrieved successfully.');
    res.json(tickerData);
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    res.status(500).send(error.message);
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
