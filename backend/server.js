// const express = require("express");
const app = require('./app');

const PORT = process.env.PORT || 4000;

const { pool } = require('./config/auth/db_postgres')


app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}!`);
})