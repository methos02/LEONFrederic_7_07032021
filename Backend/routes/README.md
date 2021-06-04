# BACKEND du réseau social de Groupomania
7ème projet de la formation de développeur web de OpenClassrooms

Le repository de l'appli complète est sur Github à cette adresse: https://github.com/methos02/LEONFrederic_7_07032021

URL de base: http://localhost:3000/api/

L'authentification est assurée par un JWT crypté, et stocké coté client dans le localStorage.
## Authentification des requêtes 
Toutes les requêtes sauf l'inscription et le login nécessite une authentification. Pour ce faire, un token barer devra être présent dans l'entête de la requète.

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMjc0NTIxNywiZXhwIjoxNjIyODMxNjE3fQ.e6ULh8HTWvJIqMIQ8H3u2XOZm6ZsTCW2p8NuJJurv4c

## Erreurs
Les erreurs sont formatées de mannière identique sur l'application.

### Status 400
Les erreurs liées aux paramètres invalides sont formatées de la façon suivante:

    { 
        "nom de l'input" : "L'erreur"
    }

### Les autres
Les autres erreurs sont formatées de la façon suivante:

    { 
        error : "L'erreur"
    }

## Authentification

### Inscription

Permet d'enregistrer un utilisateur
#### Request

`POST /auth/signup`

Authentification nécessaire: NON

Body : JSON

Field | Type |
|---|---|
| lastname | String | 
| firstname | String | 
| email | String | 
| password | String | 
| confirm | String | 

#### Réponse

Status: 201

Body : JSON

    { 
        message: "Utilisateur créé !"
        user: {
            avatar: "default_avatar.png"
            avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
            createdAt: "2021-06-03T18:26:36.399Z"
            email: "email@groupomania"
            firstname: "John"
            id: 1
            lastname: "DOE"
            likes: []
            name: "DOE John"
            nbBan: 0
            roles: []
            slug: "doe-john"
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4LCJpYXQiOjE2MjI3NDQ3OTYsImV4cCI6MTYyMjgzMTE5Nn0.OanF6At8Qh9LHAkWD5TYqa2fBLDTkvwXeC0XJnyiEcg"
            updatedAt: "2021-06-03T18:26:36.399Z"
        }
    }

### Login

Permet d'authentifier un utilisateur
#### Request

`POST /auth/login`

Authentification nécessaire: NON

Body : JSON

Field | Type |
|---|---|
| email | String | 
| password | String |

#### Réponse

Status: 200

Body : JSON

    { 
        avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
        email: "admin@groupomania.com"
        firstname: "John"
        id: 1
        lastname: "DOE"
        likes: []
        name: "DOE John"
        roles: [
            0: "admin"
            1: "modo"
        ]
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMjc0NTIxNywiZXhwIjoxNjIyODMxNjE3fQ.e6ULh8HTWvJIqMIQ8H3u2XOZm6ZsTCW2p8NuJJurv4c"
    }

### Utilisateur courant
Permet de récupérer l'utilisateur connecté correspondant au token présent dans l'entête de la requéte.

#### Request

`GET /auth/current_user`

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
        email: "admin@groupomania.com"
        firstname: "John"
        id: 1
        lastname: "DOE"
        likes: []
        name: "DOE John"
        roles: [
            0: "admin"
            1: "modo"
        ]
    }

## Profil Utilisateur

### Profil

Permet de récupéré le profil d'un utilisateur ainsi qu'une partie de ses posts
#### Request

`GET /profil/:slug`

Paramètre: slug - string

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        paginate: {
            current_page: 1
            last_page: 1
        }
        rows: [
            0: {
                Comments: []
                User: {
                    avatar: "default_avatar.png"
                    avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                    firstname: "AMARYLLIS"
                    id: 12
                    lastname: "Dupuis"
                    name: "Dupuis AMARYLLIS"
                    slug: "dupuis-amaryllis"
                }
                UserId: 12
                content: "aliquam modi porro quas rem aliquam consequuntur consequatur pariatur est"
                createdAt: "2021-06-03T15:56:46.000Z"
                dislikes: 2
                formatCreatedAt: "3/6/2021"
                id: 59
                image: "post_3.webp"
                imagePath: "http://localhost:3000/images/post/post_3.webp"
                likes: 6
                slug: null
                title: null
                type: 2
                updatedAt: "2021-06-03T15:56:46.000Z"
            }
            ...
        ]
        user: {
            firstname: "AMARYLLIS"
            id: 12
            lastname: "Dupuis"
            name: "Dupuis AMARYLLIS"
            roles: []
            slug: "dupuis-amaryllis"
        }
    }

### Recherche d'un utilisateur

Permet de rechercher un utilisateur avec son nom ou son prénom
#### Request

`GET /search/:slug`

Paramètre: slug - string

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        users: [
            0: {
                avatar: "default_avatar.png"
                avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                firstname: "AMARYLLIS"
                id: 12
                lastname: "Dupuis"
                name: "Dupuis AMARYLLIS"
                roles: []
                slug: "dupuis-amaryllis"
            }
            ...
        ]
    }

### Mise à jour du profil

Permet de modifier le profil de l'utilisateur connecté
#### Request

`PUT /profil`

Authentification nécessaire: OUI

Body : FormData

Field | Type |
|---|---|
| user[lastname] | String | 
| user[firstname] | String |
| user[email] | String |
| avatar | binary |

#### Réponse

Status: 200

Body : JSON

    { 
        data: {
            avatar: "3e98c434-7a01-42a2-b1ee-8bdc1c90f5ce-1622747651103.png"
            avatarPath: "http://localhost:3000/images/avatar/3e98c434-7a01-42a2-b1ee-8bdc1c90f5ce-1622747651103.png"
            email: "admin@groupomania.com"
            firstname: "John"
            lastname: "DOE"
            name: "DOE John"
        }
        message: "Profil modifié."
    }

### Mise à jour du mot de passe

Permet de modifier le mot de passe de l'utilisateur connecté

#### Request

`PUT /profil/password`

Authentification nécessaire: OUI

Body : Json

Field | Type |
|---|---|
| old | String | 
| password | String |
| confirm | String |

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Mot de passe modifié."
    }

### Changer les roles d'un utilisateur

Permet de modifier le mot de passe de l'utilisateur connecté, uniquement utilisable par un administrateur

#### Request

`PUT /roles/:id`

Paramètre: id - numb

Authentification nécessaire: OUI

Body : Json

Field | Type |
|---|---|
| roles | Array |

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Droits modifiés.
    }

### Supprimer un compte

Permet de supprimer le compte de l'utilisateur connecté

#### Request

`DELETE /`

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Votre profil a été supprimé."
    }

## Posts
### Récupérer les derniers posts

Permet de récupérer les derniers posts postés sur le site avec la possibilité de préciser un type précis.

#### Request

`GET /posts/:type((articles|images)?)(?page=*)`

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    {
        paginate: {
            current_page: 1
            last_page: 10
        }
        row: [
            0: {
                Comments: [
                    0: {
                        ParentId: null
                        PostId: 57
                        RefId: null
                        User: {
                            avatar: "default_avatar.png"
                            avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                            firstname: "ALDEGONDE"
                            id: 11
                            lastname: "Rey"
                            name: "Rey ALDEGONDE"
                            slug: "rey-aldegonde"
                        }
                        UserId: 11
                        content: "et id aut illum vel consequuntur saepe odio aliquam molestiae"
                        createdAt: "2021-06-03T15:56:47.000Z"
                        formatCreatedAt: "3/6/2021"
                        id: 16
                        updatedAt: "2021-06-03T15:56:47.000Z"
                    }
                    ...
                ]
                User: {
                    avatar: "default_avatar.png"
                    avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                    firstname: "CHRISTIANE"
                    id: 9
                    lastname: "Marchal"
                    name: "Marchal CHRISTIANE"
                    slug: "marchal-christiane"
                }
                UserId: 9
                content: "quaerat autem asperiores quisquam ut iure quos corporis ut rerum"
                createdAt: "2021-06-03T15:56:46.000Z"
                dislikes: 4
                formatCreatedAt: "3/6/2021"
                id: 57
                image: "post_3.webp"
                imagePath: "http://localhost:3000/images/post/post_3.webp"
                likes: 5
                slug: null
                title: null
                type: 2
                updatedAt: "2021-06-03T15:56:46.000Z"
            }
            ...
        ]
    }

### Récupérer un article

Permet de récupérer un article grace à son slug

#### Request

`GET /posts/:slug`

Paramètre: slug - string

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    {
        Comments: [
            0: {
                ParentId: null
                PostId: 57
                RefId: null
                User: {
                    avatar: "default_avatar.png"
                    avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                    firstname: "ALDEGONDE"
                    id: 11
                    lastname: "Rey"
                    name: "Rey ALDEGONDE"
                    slug: "rey-aldegonde"
                }
                UserId: 11
                content: "et id aut illum vel consequuntur saepe odio aliquam molestiae"
                createdAt: "2021-06-03T15:56:47.000Z"
                formatCreatedAt: "3/6/2021"
                id: 16
                updatedAt: "2021-06-03T15:56:47.000Z"
            }
            ...
        ]
        User: {
            avatar: "default_avatar.png"
            avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
            firstname: "CHRISTIANE"
            id: 9
            lastname: "Marchal"
            name: "Marchal CHRISTIANE"
            slug: "marchal-christiane"
        }
        UserId: 9
        content: "quaerat autem asperiores quisquam ut iure quos corporis ut rerum"
        createdAt: "2021-06-03T15:56:46.000Z"
        dislikes: 4
        formatCreatedAt: "3/6/2021"
        id: 57
        image: "post_3.webp"
        imagePath: "http://localhost:3000/images/post/post_3.webp"
        likes: 5
        slug: null
        title: null
        type: 2
        updatedAt: "2021-06-03T15:56:46.000Z"
    }

### Créer un post

Permet d'enregistrer un post

#### Request

`POST /posts/`

Authentification nécessaire: OUI

Body : FormData

Field | Type |
|---|---|
| post[title] | String |
| post[content] | String |
| post[type] | Numb |
| image | binary |

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Post enregistré !"
    }

### Modifier un post

Permet de mettre à jour un post, réalisable que par l'auteur du post ou un modérateur.

#### Request

`PUT /posts/:id`

Paramètre: id - numb

Authentification nécessaire: OUI

Body : FormData

Field | Type |
|---|---|
| post[title] | String |
| post[content] | String |
| post[type] | Numb |
| image | binary |

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Post modifié !"
    }

### Supprimer un post

Permet de supprimer un post, réalisable que par l'auteur du post ou un modérateur.

#### Request

`DELETE /posts/:id`

Paramètre: id - numb

Authentification nécessaire: OUI


#### Réponse

Status: 200

Body : JSON

    { 
        message: "Post supprimé !"
    }

### Liker ou disliker un post

Permet de liker ou disliker un post.

#### Request

`POST /posts/:id/like`

Paramètre: id - numb

Authentification nécessaire: OUI

#### Réponse

Retourne le nombre de likes/dislikes du post

Status: 200 si modification d'un like/ 201 si création d'un like

Body : JSON

    { 
        likes: {
            dislikes: 0
            likes: 1
        }
        message: "Like enregistré !" / "Like update !"
    }

## Commantaires

### Créer un commentaire

Permet de poster un commentaire
#### Request

`POST /comments`

Authentification nécessaire: OUI

Body : JSON

Field | Type |
|---|---|
| ParentId | Numb |
| PostId | Numb |
| UserId | Numb |
| content | String |

#### Réponse

Status: 201

Body : JSON

    { 
        comment: {
            PostId: 57
            ParentId: 191
            User: {
                avatar: "default_avatar.png"
                avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                firstname: "ALDEGONDE"
                id: 11
                lastname: "Rey"
                name: "Rey ALDEGONDE"
                slug: "rey-aldegonde"
            }
            UserId: 11
            content: "et id aut illum vel consequuntur saepe odio aliquam molestiae"
            createdAt: "2021-06-03T15:56:47.000Z"
            formatCreatedAt: "3/6/2021"
            id: 16
            updatedAt: "2021-06-03T15:56:47.000Z"
        }
        message: "Commentaire posté."
    }

### Modification d'un commentaire

Permet de modifier un commentaire, réalisable uniquement par l'auteur du commentaire ou un modérateur.
#### Request

`PUT /comments/:id`

Paramètre: id - numb

Authentification nécessaire: OUI

Body : JSON

Field | Type |
|---|---|
| content | String |

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Commentaire modifié."
    }

### Suppression d'un commentaire

Permet de supprimer un commentaire, réalisable uniquement par l'auteur du commentaire ou un modérateur.
#### Request

`DELETE /comments/:id`

Paramètre: id - numb

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        message: "Commentaire supprimé."
    }

## Administration

### Récupération des utilisateurs

Permet de récupérer une partie des utilisateurs.
#### Request

`GET /admin/users(?page=*)`

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        paginate: {
            current_page: 1
            last_page: 4
        }
        rows: [
            0: {
                avatar: "default_avatar.png"
                avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                banUntil: null
                email: "user24@groupomania.com"
                firstname: "JULES"
                formatBanUntil: null
                id: 25
                lastname: "Richard"
                name: "Richard JULES"
                nbBan: 0
            }
            ...
        ]
    }

### Récupération des commentaires

Permet de récupérer une partie des commentaires.
#### Request

`GET /admin/comments(?page=*)`

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        paginate: {
            current_page: 1
            last_page: 30
        }
        rows: [
            0: {
                ParentId: null
                PostId: 62
                RefId: null
                User: {
                    avatar: "default_avatar.png"
                    avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                    firstname: "MARTINE"
                    id: 6
                    lastname: "Simon"
                    name: "Simon MARTINE"
                    slug: "simon-martine"
                }
                UserId: 1
                content: "iusto ipsam incidunt nemo et amet molestiae qui quia ipsa"
                createdAt: "2021-06-03T20:04:26.000Z"
                formatCreatedAt: "3/6/2021"
                id: 191
                updatedAt: "2021-06-03T20:04:26.000Z"
            }
            ...
        }
    }

### Rechercher des utilisateurs

Permet de rechercher un utilisateur.
#### Request

`GET /admin/search/:slug`

Paramètre: slug - string

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        users: [
            0: {
                avatar: "default_avatar.png"
                avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                banUntil: null
                createdAt: "2021-06-03T15:56:46.000Z"
                email: "user5@groupomania.com"
                firstname: "MARTINE"
                formatBanUntil: null
                id: 6
                lastname: "Simon"
                messageBan: null
                name: "Simon MARTINE"
                nbBan: 0
                password: "$2b$10$5xahNvms1WubdXcx6VAYUO2zrXB68x/YUKO4bLTAqNS.6zB.dKiRK"
                roles: []
                slug: "simon-martine"
                updatedAt: "2021-06-03T15:56:46.000Z"
            }
            ...
        ]
    }

### Bannir un utilisateur

Permet à un modérateur de bannir un utilisateur.
#### Request

`GET /admin/users/:id/ban`

Paramètre: id - numb

Authentification nécessaire: OUI

#### Réponse

Status: 200

Body : JSON

    { 
        paginate: {
            current_page: 1
            last_page: 4
        }
        rows: [
            0: {
                avatar: "default_avatar.png"
                avatarPath: "http://localhost:3000/images/avatar/default_avatar.png"
                banUntil: null
                email: "user24@groupomania.com"
                firstname: "JULES"
                formatBanUntil: null
                id: 25
                lastname: "Richard"
                name: "Richard JULES"
                nbBan: 0
            }
            ...
        ]
    }

