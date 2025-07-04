import express from 'express';
import { connectToDatabase } from '../config/db.js';
import {
    getCaisse, insertCaisse
} from '../controllers/caisseController.js'

const router = express.Router();

router.get('/', getCaisse);
router.post('/', insertCaisse);




// route nw 

// GET - Récupérer tous les types de transactions
router.get('/types-transaction', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM types_transaction ORDER BY nom');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// DELETE /api/caisse/types/:id
router.delete('/types/:id', async (req, res) => {
  const { id } = req.params;
    const connection = await connectToDatabase();

  try {
    const sql = 'DELETE FROM types_transaction WHERE id = ?';
    const [result] = await connection.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Type non trouvé' });
    }

    res.json({ message: 'Type supprimé avec succès' });
  } catch (err) {
    console.error('Erreur suppression type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/caisse/types
router.post('/types', async (req, res) => {
  const { nom, description } = req.body;
  const connection = await connectToDatabase();

  if (!nom || nom.trim() === '') {
    return res.status(400).json({ error: 'Le nom est requis.' });
  }

  try {
    const sql = 'INSERT INTO types_transaction (nom, description) VALUES (?, ?)';
    const [result] = await connection.query(sql, [nom, description || null]);

    res.status(201).json({ message: 'Type ajouté avec succès', id: result.insertId });
  } catch (err) {
    console.error('Erreur ajout type:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.get('/types', async(req, res)=>{
    try{
        const connection = await connectToDatabase();
        const query = `SELECT * FROM types_transaction`;
        const [rows] = await connection.execute(query);
        res.status(200).json({
            success: true,
            data: rows,
        })
    } catch(error){
        console.error('Erreur lors de la récupération:', error);
        res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données'
      });
    }
});

// POST - Créer une nouvelle transaction
router.post('/transactions', async (req, res) => {
    try {
        const { type_operation, type_transaction_id, montant, motif, date_transaction } = req.body;
        
        // Validation des données
        if (!type_operation || !montant || !motif || !date_transaction) {
            return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
        }

        if (!['recette', 'depense'].includes(type_operation)) {
            return res.status(400).json({ error: 'Type d\'opération invalide' });
        }

        if (isNaN(montant) || parseFloat(montant) <= 0) {
            return res.status(400).json({ error: 'Le montant doit être un nombre positif' });
        }

        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'INSERT INTO transactions_caisse (type_operation, type_transaction_id, montant, motif, date_transaction) VALUES (?, ?, ?, ?, ?)',
            [type_operation, type_transaction_id || null, parseFloat(montant), motif, date_transaction]
        );
        await connection.end();

        res.status(201).json({ 
            message: 'Transaction créée avec succès',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Erreur lors de la création de la transaction:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET - Récupérer toutes les transactions avec filtrage
router.get('/transactions', async (req, res) => {
    try {
        const { 
            type_operation, 
            type_transaction_id, 
            date_debut, 
            date_fin, 
            montant_min, 
            montant_max,
            page = 1,
            limit = 20,
            sort = 'date_transaction',
            order = 'DESC'
        } = req.query;

        let query = `
            SELECT 
                tc.id,
                tc.type_operation,
                tc.montant,
                tc.motif,
                tc.date_transaction,
                tc.created_at,
                tt.nom as type_transaction_nom
            FROM transactions_caisse tc
            LEFT JOIN types_transaction tt ON tc.type_transaction_id = tt.id
            WHERE 1=1
        `;
        
        const params = [];

        // Filtres
        if (type_operation) {
            query += ' AND tc.type_operation = ?';
            params.push(type_operation);
        }

        if (type_transaction_id) {
            query += ' AND tc.type_transaction_id = ?';
            params.push(type_transaction_id);
        }

        if (date_debut) {
            query += ' AND tc.date_transaction >= ?';
            params.push(date_debut);
        }

        if (date_fin) {
            query += ' AND tc.date_transaction <= ?';
            params.push(date_fin);
        }

        if (montant_min) {
            query += ' AND tc.montant >= ?';
            params.push(parseFloat(montant_min));
        }

        if (montant_max) {
            query += ' AND tc.montant <= ?';
            params.push(parseFloat(montant_max));
        }

        // Tri
        const validSorts = ['date_transaction', 'montant', 'created_at'];
        const validOrders = ['ASC', 'DESC'];
        
        if (validSorts.includes(sort) && validOrders.includes(order.toUpperCase())) {
            query += ` ORDER BY tc.${sort} ${order.toUpperCase()}`;
        } else {
            query += ' ORDER BY tc.date_transaction DESC';
        }

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const connection = await connectToDatabase();
        const [rows] = await connection.execute(query, params);
        
        // Compter le total pour la pagination
        let countQuery = `
            SELECT COUNT(*) as total
            FROM transactions_caisse tc
            LEFT JOIN types_transaction tt ON tc.type_transaction_id = tt.id
            WHERE 1=1
        `;
        
        const countParams = params.slice(0, -2); // Enlever limit et offset
        
        if (type_operation) countQuery += ' AND tc.type_operation = ?';
        if (type_transaction_id) countQuery += ' AND tc.type_transaction_id = ?';
        if (date_debut) countQuery += ' AND tc.date_transaction >= ?';
        if (date_fin) countQuery += ' AND tc.date_transaction <= ?';
        if (montant_min) countQuery += ' AND tc.montant >= ?';
        if (montant_max) countQuery += ' AND tc.montant <= ?';

        const [countResult] = await connection.execute(countQuery, countParams);
        await connection.end();

        res.json({
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET - Statistiques de la caisse
router.get('/statistiques', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        
        // Solde total
        const [soldeResult] = await connection.execute(`
            SELECT 
                SUM(CASE WHEN type_operation = 'recette' THEN montant ELSE 0 END) as total_recettes,
                SUM(CASE WHEN type_operation = 'depense' THEN montant ELSE 0 END) as total_depenses,
                SUM(CASE WHEN type_operation = 'recette' THEN montant ELSE -montant END) as solde_net
            FROM transactions_caisse
        `);

        // Statistiques par mois
        const [monthlyStats] = await connection.execute(`
            SELECT 
                DATE_FORMAT(date_transaction, '%Y-%m') as mois,
                type_operation,
                SUM(montant) as total_montant,
                COUNT(*) as nombre_transactions
            FROM transactions_caisse
            WHERE date_transaction >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date_transaction, '%Y-%m'), type_operation
            ORDER BY mois DESC
        `);

        await connection.end();

        res.json({
            solde: soldeResult[0],
            statistiques_mensuelles: monthlyStats
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT - Modifier une transaction
router.put('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type_operation, type_transaction_id, montant, motif, date_transaction } = req.body;

        if (!type_operation || !montant || !motif || !date_transaction) {
            return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
        }

        const connection = await connectToDatabase();
        const [result] = await connection.execute(
            'UPDATE transactions_caisse SET type_operation = ?, type_transaction_id = ?, montant = ?, motif = ?, date_transaction = ? WHERE id = ?',
            [type_operation, type_transaction_id || null, parseFloat(montant), motif, date_transaction, id]
        );
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction non trouvée' });
        }

        res.json({ message: 'Transaction modifiée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE - Supprimer une transaction
router.delete('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await connectToDatabase();
        const [result] = await connection.execute('DELETE FROM transactions_caisse WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Transaction non trouvée' });
        }

        res.json({ message: 'Transaction supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
export default router;
