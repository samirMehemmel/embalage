import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, subject, message });
  };

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Contactez-nous</h1>
        <p>Une question ? Un besoin spécifique ? Notre équipe est à votre écoute.</p>
      </section>

      <section className="contact-content">
        <div className="contact-form">
          <h2>Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Votre adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <textarea placeholder="Votre message..." rows="6" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            <button type="submit">Envoyer</button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Nos coordonnées</h2>
          <p><strong>📍 Adresse :</strong> BBA, Bordj Bou Arréridj</p>
          <p><strong>📞 Téléphone :</strong> 0552 49 20 36</p>
          <p><strong>✉️ Email :</strong> contact@infini-pack.dz</p>
        </div>
      </section>
    </div>
  );
}

export default Contact;
