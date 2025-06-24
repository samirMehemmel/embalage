import React, { useEffect, useState } from 'react';
import './DevisAdmin.css';

function DevisAdmin() {
  const [devisList, setDevisList] = useState([]);

  // Simulation (tu remplaceras par un fetch API vers ton backend)
  useEffect(() => {
    const donnéesSimulées = [
      {
        id: 1,
        nom: 'Karim B.',
        email: 'karim@example.com',
        tel: '0555123456',
        produit: 'Sac kraft',
        quantite: 500,
        message: 'Besoin de sacs personnalisés avec logo.',
        date: '2025-06-16',
      },
      {
        id: 2,
        nom: 'Sonia M.',
        email: 'sonia@example.com',
        tel: '0555987654',
        produit: 'Boîte alimentaire',
        quantite: 200,
        message: 'Pour pâtisserie, 3 tailles différentes.',
        date: '2025-06-14',
      },
    ];

    setDevisList(donnéesSimulées);
  }, []);

  return (
    <div className="devis-admin">
      <h1>📥 Devis reçus</h1>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {devisList.map((devis) => (
            <tr key={devis.id}>
              <td>{devis.nom}</td>
              <td>{devis.email}</td>
              <td>{devis.tel}</td>
              <td>{devis.produit}</td>
              <td>{devis.quantite}</td>
              <td>{devis.message}</td>
              <td>{devis.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DevisAdmin;
