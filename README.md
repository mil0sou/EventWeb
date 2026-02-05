# EventWeb 

Une application web moderne et jolie de gestion d'événements construite avec React, Node.js et PostgreSQL

## Prérequis

- Node.js
- npm
- PostgreSQL

##  Installation super rapide

Copiez-collez ces commandes dans votre terminal :

```bash
# vérif que tout est là
node -v
npm -v
psql --version

# Cloner le projet
git clone https://github.com/mil0sou/EventWeb.git
cd EventWeb

# Configurer la base de données 
# password : mdp postgres de CE PC 

cd event-backend/migration_db/migrations
dropdb -U postgres dbname 2>$null
createdb -U postgres dbname
psql -U postgres -d dbname -f eventweb.sql


# Installer et lancer le backend
cd ../../..
cd event-backend
npm install dotenv
npm install
node src/server.js 

# FRONTEND (nouveau terminal, depuis la racine EventWeb)
cd event-frontend
npm install
npm run dev
```

L'application est dispo en navigateur à l'adresse : **http://localhost:5173**



TODO : 
 - Bloquer le bouton s'inscrire
 - voulez vous vrm supprimer ?  
 - toasts notif 
 - recherche d'event + filtre

 - 2e onglet evenemtent passé + futur + mes évenements
 - profil : mes events inscrits + créés 


 - FAIT faire marcher la migration avec des mdp de postgres différents avec un .env
 - FAIT Script de migration pour la db 
 - FAIT Login auto quand on créé un compte 
 - FAIT Empêcher de créer un event dans le passé
 - FAIT Créer un compte avec les mm crédentials : message d'erreur précis 
 - FAIT Enlever tous les styles de tous les tsx
 - FAIT Bloquer l'édit quand on veut réduire le nombre de places en dessous du nombre d'inscrits sinon on part en négatif 
 - FAIT Factoriser création event et modif --> mm formulaire  
 - FAIT Rendre stylé les champs de texte de création et modification d'event
 - FAIT Subdiviser Eventspage en composants
 - FAIT Bloquer la création de compte avec mdp ou username vide pour ensuite une connexion avec rien 
 - FAIT Boutons stylés dans modif d'event et dans nouvel event 
 - FAIT Supprimer boutons supprimer, inscrire et fermer dans la modale d'édition d'event








