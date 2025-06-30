import { connectToDatabase } from "../config/db";




export const getCaisse = async (req, res) =>{
    try{

        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM CAISSE');

        res.status(200).json({
            caisse : rows,
        });

    } catch(err){
        console.error('Erreur lors de la récupération des devis :', err.message);
        res.status(500).json({
            error: 'Erreur lors de la requete SQL'
        });
    }};

    export const insertCaisse = async (req, res) => {
        try{
            const { montant, type, motif, } = req.body;


            const connection = await connectToDatabase();
            const sql = `
                INSERT INTO CAISSE ()
            `;
            

        } catch(err){

        }
    }