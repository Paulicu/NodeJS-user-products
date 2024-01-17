const pool = require('../db');

const addReview = async (review) => {
    const { product_id, user_id, rating, comment } = review;
    const [result] = await pool.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [product_id, user_id, rating, comment]);
    return result.insertId;
};

const getReviewsByProductId = async (product_id) => {
    const [rows] = await pool.query('SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id WHERE product_id = ?', [product_id]);
    return rows;
};

module.exports = { addReview, getReviewsByProductId };