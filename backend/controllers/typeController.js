import { connectToDatabase } from "../config/db";




export const getType = async (req, res)=>{
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM TYPE');

        res.status(200).json({
            type : rows,
        });
    } catch(err){
        
        console.error(' Erreur lors de la récupération des devis :', err.message);
        res.status(500).json({
        error: 'Erreur lors de la requête SQL',
    });
    }
}