import { connectToDatabase } from "../config/db"




export const getAdmin = async (req, res) =>{
    try{
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM admin');
        res.status(200).json({
            admins : rows
        })

    } catch(err){
        console.error('erreur');
        res.status(500).json({
            error: 'Erreur serveur'
        });
    }
};


