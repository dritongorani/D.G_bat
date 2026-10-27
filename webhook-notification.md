# 🔗 Système de suivi automatisé des devis (Form.io Webhook)

## Principe

À chaque soumission du formulaire Form.io, un webhook est déclenché pour :

1. Notifier l'artisan KoSBoS Bat par email (nouveau lead)
2. Envoyer une confirmation automatique au client (accusé de réception)
3. Enregistrer le lead dans le tracker de commissions (30%)

---

## Exemple de payload Form.io (webhook)

```json
{
  "data": {
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "0600000000",
    "email": "jean.dupont@email.com",
    "adresseChantier": "12 Rue de la Paix, 75002 Paris",
    "typesTravaux": ["electricite", "plomberie", "carrelage"],
    "surfaceEstimee": 80,
    "budgetApproximatif": "15k30k",
    "descriptionProjet": "Rénovation complète appartement T2",
    "photosChantier": [...],
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "created": "2026-10-27T10:00:00.000Z"
  },
  "submission": { "_id": "..." },
  "form": { "title": "Devis Gratuit - KoSBoS Bat" }
}
```

---

## Exemple de récepteur webhook (Node.js / Express)

Fichier suggéré : `webhook-devis.js` (à déployer sur un serveur ou fonction serverless)

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'contact@kosbosbat.fr', pass: 'APP_PASSWORD' }
});

app.post('/webhook/formio-devis', async (req, res) => {
  const { data } = req.body;

  // 1. Email notification à l'artisan
  await transporter.sendMail({
    from: 'contact@kosbosbat.fr',
    to: 'artisan@kosbosbat.fr',
    subject: `🆕 Nouveau lead devis - ${data.prenom} ${data.nom}`,
    text: `
Nouvelle demande de devis KoSBoS Bat

Client : ${data.prenom} ${data.nom}
Téléphone : ${data.telephone}
Email : ${data.email}
Chantier : ${data.adresseChantier}
Travaux : ${data.typesTravaux.join(', ')}
Surface : ${data.surfaceEstimee} m²
Budget : ${data.budgetApproximatif}
Description : ${data.descriptionProjet}
Date : ${new Date().toLocaleString('fr-FR')}

Commission 30% à suivre sur ce lead.
    `
  });

  // 2. Email de confirmation au client
  await transporter.sendMail({
    from: 'contact@kosbosbat.fr',
    to: data.email,
    subject: 'Votre demande de devis KoSBoS Bat est bien enregistrée',
    text: `
Bonjour ${data.prenom},

Nous avons bien reçu votre demande de devis pour vos travaux à ${data.adresseChantier}.

Un de nos conseillers vous contacte sous 24h par téléphone ou email pour convenir d'une visite et vous transmettre un devis gratuit et sans engagement.

Cordialement,
L'équipe KoSBoS Bat
    `
  });

  // 3. Log pour suivi commission (30%)
  console.log(`[COMMISSION TRACK] Lead ${data._id} - ${data.prenom} ${data.nom} - En attente de signature`);

  res.status(200).json({ status: 'ok' });
});

app.listen(3000, () => console.log('Webhook KoSBoS Bat sur le port 3000'));
```

---

## Configuration dans Form.io

1. Allez dans votre projet Form.io → Forme "Devis Gratuit - KoSBoS Bat"
2. Onglet **Webhooks** → Ajouter un webhook
3. URL : `https://votre-serveur.com/webhook/formio-devis`
4. Événements : `submission.create`
5. Enregistrez.

---

## Suivi de la commission 30%

Chaque lead entrant doit être reporté dans le fichier `suivi-commissions.csv` (voir modèle dans `contrat-apporteur-affaires.md`) avec les colonnes :

| Date lead | Client | Chantier | Montant devis HT | Signé (Oui/Non) | Commission 30% HT | Statut paiement |