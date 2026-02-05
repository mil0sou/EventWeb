# # Event Web App - installation et lancement

# vérif que tout est là 
node -v
npm -v
psql --version
git --version

# cloner le repo
git clone ...
cd EventWeb

# DB
cd event-backend\migration_db\migrations
dropdb -U postgres eventweb
createdb -U postgres eventweb
psql -U postgres -d eventweb < eventweb.sql

# backend
cd ..\..
cd event-backend
npm install
node src/server.js

# frontend
cd ..
cd event-frontend
npm install
npm run dev

# ouverture auto 
Start-Process http://localhost:5173/



TODO : 

 - Script de migration pour la db 

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



