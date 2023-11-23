import express from "express";

const postsRoutes = express.Router();

// @route      GET  api/posts
// @desc       Test route
// @access     Public
postsRoutes.get('/', (req, res) => res.send('Posts route'));

export default postsRoutes;
