/* Este middlewere se ejecuta para verificar que el token no haya expirado
Para que funcione requiere que le manden el token mediante el header
Al usar la funcion jwt.verify decodifica el token y retorna informacion:
- fecha de creacion del token
- fecha de expiracion del token
- informacion que se haya metido dentro del token en el archivo jwtGenerator.js en este caso el id ( const payload = {user: user_id} )
*/
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default async (req, res, next) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
            return res.status(403).json("not Authorized")
        }
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;
        next();

    } catch (err) { 
        console.error(err.message);
        return res.status(403).json("not Authorized")
    }
}
