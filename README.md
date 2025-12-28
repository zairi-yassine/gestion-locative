## Cahier des charges simplifié – Application de Gestion Locative (Mobile)

### Objectif
Proposer une application mobile simple pour gérer quelques biens immobiliers, suivre les locataires, enregistrer les paiements des loyers et éditer les contrats. L'interface doit être facile à prendre en main et éviter la complexité inutile.

### Technologies principales
- **Frontend** :  Expo (React Native)
- **Backend** : Express.js (API REST)
- **Base de données** : MongoDB
- **Plateformes** : Android & iOS

### Fonctionnalités principales
- Inscription et connexion de base pour le gestionnaire
- CRUD propriété : ajouter/modifier/supprimer/listes des biens
- CRUD locataires : ajouter/modifier/supprimer/listes des locataires
- Gestion des paiements : enregistrer paiement d'un loyer, voir historique
- Visualisation rapide de l'état des loyers payés/non payés
- Génération d'un document "quittance de loyer" simple
- Contrat de location (upload/fichier PDF)

### Expérience utilisateur souhaitée
- Interface mobile native 
- Navigation simple 
- Affichage synthétique adapté aux petits écrans
- Design responsive pour smartphones et tablettes

### Sécurité & Données
- Authentification simple par email et mot de passe
- Protection basique des données personnelles des locataires
- Stockage sécurisé avec MongoDB
