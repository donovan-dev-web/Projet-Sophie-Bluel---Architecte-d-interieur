# Portfolio Architecte — Front-End

Projet réalisé dans le cadre de la formation Développeur Web chez **OpenClassrooms**.

---

## Contexte et objectifs

Vous rejoignez l’agence **ArchiWebos** afin d’améliorer le site portfolio d’une architecte d’intérieur.

Votre mission principale :

| Mission | Description |
|--------|-------------|
|  Page d’accueil | Affichage dynamique des travaux (API REST) |
|  Authentification admin | Accès sécurisé au mode édition |
|  Modale d’upload | Ajout / suppression de travaux en mode admin |

---

##  Fonctionnalités développées

✔ Récupération & affichage des projets via API  
✔ Filtres de catégories dynamiques et fonctionnels  
✔ Connexion administrateur + token localStorage  
✔ Mode édition : suppression + ajout de projets  
✔ Gestion des erreurs formulaires et retours API

---

## Structure du projet

```

js/
├─ core/
│   └─ auth.js
├─ services/
│   └─ projects.service.js
├─ features/
│   ├─ gallery.js
│   ├─ auth-interface.js
│   └─ modal/
│       ├─ modal.html
│       ├─ modal.css
│       ├─ modal.js
│       ├─ modal.gallery.js
│       ├─ modal.form.js
├─ page/
│   ├─ index.js
│   └─ login.js

````

---

##  Étapes du projet & fichiers liés

| Étape | Fonctionnalité | Fichiers principaux |
|------|----------------|-------------------|
| 2 | Galerie dynamique | `index.js`, `gallery.js`, `projects.service.js` |
| 3 | Filtres dynamiques | `gallery.js` |
| 4 | Filtres fonctionnels | `gallery.js` |
| 5.1 | Intégration Login | `login.js` |
| 5.2 | Authentification API | `auth.js`, `login.js` |
| 5.3 | Redirection + mode admin | `login.js`, `auth-interface.js` |
| 6 | Structure de la modale | `modal.js`, `modal.css` |
| 7 | Suppression d’un projet | `modal.gallery.js`, `projects.service.js` |
| 8.1 | Envoi formulaire ajout projet | `modal.form.js`, `projects.service.js` |
| 8.2 | Mise à jour dynamique UI | `gallery.js`, `modal.gallery.js` |
| 9 | Gestion des erreurs | Tous formulaires & appels API |

---

##  Authentification

- Stockage du token :
```js
localStorage.setItem("token", token);
````

* Contrôle d’accès activant l’UI édition (boutons / modale)

---

##  Schéma des échanges avec l’API

Voir plus bas dans ce document 

---

##  Technologies utilisées

| Tech               | Utilisation                     |
| ------------------ | ------------------------------- |
| HTML/CSS           | Base du site statique           |
| JavaScript ES6     | Dynamisation du front           |
| API REST (Node.js) | Gestion des projets & connexion |
| Fetch API          | Appels GET / POST / DELETE      |
| LocalStorage       | Authentification                |

---

##  Vérification & robustesse

* Validation des formulaires
* Gestion des retours API (401, 400…)
* UX claire : messages d’erreur visibles

---

##  Auteur & licence

Projet réalisé par **Donovan Chartrain**
Certification OpenClassrooms — Développeur Web
Code fourni librement dans un cadre d’apprentissage


## Diagramme — Fonctionnement de la Modale
````
┌───────────────┐
│ Bouton "modifier" (admin) │
└───────┬───────┘
        │ openModal()
        ▼
┌───────────────────────┐
│ Vue 1 : Galerie modale │
│ - Affiche miniatures   │
│ - Boutons supprimer    │
└───────┬─────┬─────────┘
        │     │ deleteProject()
        │     ▼
        │  Suppression API
        │  + remove() DOM
        │
        │ add-photo-btn
        ▼
┌───────────────────────┐
│ Vue 2 : Formulaire     │
│ - Ajout image preview  │
│ - Envoi POST API       │
└───────┬────────────────┘
        │ uploadProject()
        ▼
┌───────────────────────┐
│ Success API → push UI  │
│ -> Galerie modale      │
│ -> Galerie principale  │
└───────────────────────┘
````

➡ **Navigation fluide entre les vues**
➡ **Le DOM est mis à jour instantanément**

## Schéma — Communication Front ↔ Backend
````
               ┌──────────────┐
               │   Backend    │
               │   API REST   │
               └──────┬───────┘
                      ▲
         JSON         │
   ┌────────┐   fetch │  ┌─────────┐
   │ Front  │────────────│ Base de  │
   │ (JS)   │            │ données  │
   └────────┘◄──────────┘──────────┘
      ▲  ▲      réponses JSON
      │  │
      │  └── POST /login → token → localStorage
      │
      └── GET /works → affichage galerie
      └── DELETE /works/:id → suppression
      └── POST /works → ajout + retour image
````

