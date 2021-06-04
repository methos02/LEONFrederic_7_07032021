# OpenClassrooms P7 - Réseau social d'entreprise
7ème projet de la formation de [développeur web de OpenClassrooms](https://openclassrooms.com/fr/paths/185-developpeur-web)

## Scénario
Développement (Frontend et Backend) d'un réseau social d'entreprise pour une société fictive Groupomania.  
Une grande liberté est donnée pour développer ce projet: il faut simplement respecter la charte graphique fournie.

## Fonctionnalités implémentées
- Création d'utilisateurs (CRUD)
- Les utilisateurs pourront
  - Voir les derniers posts de tous les utilisateurs
  - Publier des images
  - Publier des articles
  - Modifier leur profil
  - Rechercher un utilisateur
  - Accéder au profil public d'un autre utilisateur
  - Voir les derniers posts publiés par cet utilisateur
- Sur chaque posts, les utilisateurs pourront
  - Liker / disliker
  - Commenter
  - Supprimer leur propre post, commentaire et like
- L'administrateur pourra:
  - Donner/enlever les droits de moderation à un autre utilisateur
- Les modérateurs pourront    
  - Supprimer les posts ou les commentaires qu'ils jugent inappropriés.
  - Bannir un utilisateur en précisant la raison
- Autres
  - Session persistante au rechargement de la page
  - Panneau d'administration avec l'ensemble des commentaires et des utilisateurs
  - Crop et Resize des images à la volée, avant publication
  
## Technologies utilisées
- Backend
  - Serveur **Node.js** avec Framework **Express** et l'ORM **Sequelize**
  - Base de Données **MySQL**
  - **API REST**
- Frontend
  - Framework **VueJs**
  - La Library Vuetify 
  - **SCSS**
  
## Installation
### Mise en production avec Docker
1. **Cloner le dépot Github**
```bash
git clone https://github.com/methos02/LEONFrederic_7_07032021.git
```
2. **Lancer les différents éléments avec docker-compose**
```bash
cd LEONFrederic_7_07032021
docker-compose up --build -d
```
3. **Essayer l'application**
- Pour avoir les droits d'admin, enregistrez-vous avec l'adresse email admin@groupomania.com.
- Le réseau social est normalement accessible à l'adresse : http://127.0.0.1:8080/
- Pour tester plus en détail le backend (avec postman par exemple), ce dernier devrait répondre à l'adresse : http://127.0.0.1:3000/

### Installation avec seeder
1. **Cloner ce dépot Github**
```bash
git clone https://github.com/methos02/LEONFrederic_7_07032021.git
```
2. **Backend**
```bash
cd LEONFrederic_7_07032021/backend # Aller dans le dossier "backend"
npm install # Installer les dépendances
npm run seed # crée la basse de données et l'hydrate
npm start # lancer le backend
```
3. **Frontend**
- Ouvrir un nouveau terminal
```bash
cd LEONFrederic_7_07032021/frontend # Aller dans le dossier "frontend"
npm install # Installer les dépendances
npm run serve # lancer le frontend
```
4. **Essayer l'application**
- Le réseau social est accessible à l'adresse : localhost:8080
- Pour tester plus en détail le backend (avec postman par exemple), ce dernier est disponible à l'adresse : localhost:3000

### Contenu du seeder
- 25 utilisateurs
- 30 articles et 30 images
- 100 commentaires réparti aléatoirement parmi les posts
- jusqu'à 3 réponses par commentaire
- jusqu'à 10 likes par post réparti aléatoirement entre les likes et les dislikes
- Tous les utilisateurs sont utilisables avec le login: "user + { id de l'utilisateur }@gropomania.com" / mot de passe: "123123"
- Un compte avec les droits d'administration est disponible pour tester les fonctions d'administration: login "admin@groupomania" / mot de passe "123123"
- Un compte banni est disponible pour controller la fonction: login "ban-user@groupomania.com" / mot de passe "123123"

### Commande Backend disponible:
- "start": Démarre le serveur
- "test": Reset la base de donnée et lance une série de test
- "migrate": Réinitialise la base de donnée sans seeder
- "seed": Réinitialise la base de donnée avec seeder
