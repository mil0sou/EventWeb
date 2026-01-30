# recréer la database
dropdb -U postgres dbname & createdb -U postgres dbname & psql "postgresql://postgres:milo@localhost:5432/dbname" -f migrations\001_init.sql

# frontend
cd C:\Users\soula\Documents\SEC3\PW\EventWeb\event-frontend
npm run dev
# http://localhost:5173/

# backend
cd C:\Users\soula\Documents\SEC3\PW\EventWeb\event-backend
node src/server.js
# http://localhost:5000


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



