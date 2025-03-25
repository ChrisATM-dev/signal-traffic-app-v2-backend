import { Router } from 'express';
const router = Router();
import pool from '../db.js';


router.get("/get-users", async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users");
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})


export default router;
