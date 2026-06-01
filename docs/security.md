# Sécurité multi-tenant

## Règles obligatoires

- Toute donnée métier est liée à une organisation.
- Toute requête métier filtre explicitement par `organizationId`.
- Toute route métier tenant-scoped utilise `@TenantScoped()`.
- Le tenant demandé est validé côté serveur à partir de `Membership`.
- Les actions sensibles doivent produire un `AuditLog`.
- Aucun secret ne doit être versionné.

## Rôles

| Rôle          | Portée prévue                                      |
| ------------- | -------------------------------------------------- |
| `SUPER_ADMIN` | Administration de la plateforme                    |
| `ORG_ADMIN`   | Administration d'une organisation                  |
| `TECHNICIAN`  | Traitement des incidents et gestion opérationnelle |
| `END_USER`    | Création et suivi de ses demandes                  |

`SUPER_ADMIN` doit rester exceptionnel et audité. Pour les autres rôles, les droits sont évalués dans le tenant courant.

## Défense en profondeur

Les guards empêchent l'accès aux routes, mais les services doivent aussi filtrer leurs requêtes Prisma. Un test d'intégration tenant A / tenant B devra accompagner chaque nouveau domaine exposé par l'API.

À terme, envisagez PostgreSQL Row-Level Security comme protection supplémentaire après stabilisation du modèle d'accès. Elle ne remplace pas les contrôles applicatifs.
