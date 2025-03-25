import { Router } from 'express';
const router = Router();
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwtGenerator from '../utils/jwtGenerator.js';
import authorization from '../middleware/authorization.js';
import normalizeEmail from '../middleware/normalizeEmail.js';

//registering
router.post("/register", normalizeEmail, async (req, res) => {
    try{
        //1. desestructure the req.body (name, email, password)
        const { email, password } = req.body;

        //2. check if user exist (if user exist then throw error)
        const user = await pool.query("Select * from users where email = $1",[email]);
        

        //res.json(user.rows) se usa para ver lo que retorna ??????????

        if(user.rows.length !== 0){
            return res.status(401).json({error_msg: "User already exist"});
        }

        //3. bcrypt the user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //4. enter the new user inside our database
        const newUser = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2) returning *", [email, bcryptPassword]);
        //res.status(201).send("Successfully registered user");, solo me muestra el mensaje pero no pueden haber mas de un status?
        
        //5. genrating our jwt token
        const token = jwtGenerator(newUser.rows[0].id);

        res.json({ token });


    }catch (err){
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

//login route
router.post("/login", normalizeEmail, async (req, res) => {
    try {
        //1. destructure the req.body
        const {email, password} = req.body;

        //2. check if user doesn't exist (if not then we throw error)
        const user = await pool.query("select * from users where email = $1", [email]);

        if (user.rows.length === 0){
            return res.status(401).json({error_msg: "Password or Email is incorrect"});

        }

        //3. check if incomming password is the same the database passwonrd
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if(!validPassword){
            return res.status(401).json({error_msg: "Password or Email is incorrect"});
        }
 
        //4. give hen the jwt token
        const token = jwtGenerator(user.rows[0].id);
        // creo que es peligroso que devuelva el id
        // const id = user.rows[0].id;
        res.json({ token});


    }catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})


router.get("/is-verify", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT is_complete FROM users WHERE id = $1", [req.user]);
        res.json({ verify: true, is_Complete: user.rows[0].is_complete });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

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
