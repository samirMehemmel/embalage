import { sqlPool } from "../config/db.js";

export const getAllDevis = async (req, res) => {
    try{
        const request = sqlPool.request();
        const result = await request.query('SELECT * FROM DEVIS');

        res.status(200).json({
            devis: result.recordset,
        });
    } catch (err){
        console.error('Erreur lors de la récupération des devis',err.message);
        res.status(500).json({
            error: 'Erreur dans la requette sql',
        })
   }
};

export const getDetailsDevis = async (req, res)=>{
    try{
        const id_devis = req.query;
        const request = sqlPool.request();

        const result = await request.query(`SELECT * FROM DEVIS WHERE`);
        
        res.status(200).json({
            detailt: result.recordset,
        })
    } catch(err){
        console.error(err.message);
        res.status(500).json({
            error:'Erreur dans la requette sql'
        })
        
    }
}