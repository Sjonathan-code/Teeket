# Feuille de route MVP

Cette roadmap est la checklist de livraison de Teeket. Une case fonctionnelle est cochée lorsque le code est implémenté et vérifié localement. Les cases de publication indiquent séparément si la pull request est intégrée dans `main`.

## État actuel

- Branche de travail : `feat/tickets-core`
- Prochain jalon : publier et fusionner la verticale tickets
- Prochaine verticale métier : authentification réelle

## Phase 1 - Fondation

- [x] Initialiser le monorepo TypeScript avec pnpm et Turborepo
- [x] Ajouter PostgreSQL, Prisma, migration initiale et seed de démonstration
- [x] Ajouter les modules NestJS et les pages Next.js de départ
- [x] Poser les guards globaux d'authentification, de tenant et de rôles
- [x] Documenter l'architecture et les règles multi-tenant
- [x] Ajouter la CI GitHub Actions : lint, typecheck, tests et build

## Phase 2 - Support essentiel

### Tickets

- [x] Créer un ticket avec DTO validé
- [x] Lister les tickets de l'organisation courante
- [x] Afficher le détail d'un ticket
- [x] Modifier le statut et la priorité
- [x] Assigner ou désassigner un technicien membre de l'organisation
- [x] Ajouter un commentaire
- [x] Auditer la création, le changement de statut et l'ajout de commentaire
- [x] Tester l'isolation tenant et les mutations principales
- [x] Ajouter les pages web liste, création et détail
- [x] Publier la pull request `feat/tickets-core`
- [x] Faire passer la CI GitHub
- [x] Fusionner la pull request dans `main`

### Authentification

- [ ] Ajouter le hash de mot de passe
- [ ] Ajouter la connexion avec JWT court
- [ ] Ajouter le refresh token rotatif
- [ ] Ajouter la déconnexion et la récupération de mot de passe
- [ ] Remplacer le middleware local `x-demo-user-id`
- [ ] Tester l'authentification et les refus d'accès

### Organisations et utilisateurs

- [ ] Gérer les organisations
- [ ] Gérer les utilisateurs
- [ ] Gérer les memberships et les rôles
- [ ] Tester les changements de rôle et l'isolation tenant

### Machines

- [x] Ajouter le modèle Prisma et le seed machine
- [x] Lister les machines de l'organisation courante dans l'API et le web
- [ ] Ajouter le détail machine
- [ ] Ajouter les DTO et tests unitaires machines
- [ ] Définir le protocole sécurisé du futur agent PC

### Qualité MVP

- [ ] Ajouter des tests d'intégration tenant A / tenant B
- [ ] Ajouter des tests frontend sur les parcours tickets
- [ ] Remplacer les statistiques statiques du tableau de bord
- [ ] Documenter les erreurs API et les états vides

## Phase 3 - Assistance intelligente

Ne pas commencer cette phase avant la stabilisation de la phase 2.

- [ ] Ajouter la base de connaissance
- [ ] Ajouter le résumé et la qualification IA avec validation humaine
- [ ] Journaliser les appels IA, les coûts et les validations
- [ ] Ajouter le premier agent machine sécurisé
- [ ] Ajouter les playbooks de diagnostic en lecture seule

## Phase 4 - AutoFix encadré

- [ ] Ajouter un worker d'exécution isolé
- [ ] Définir un catalogue d'actions explicitement autorisées
- [ ] Ajouter l'approbation humaine avant exécution
- [ ] Ajouter l'observabilité et le rollback lorsque possible

## Règles de validation

Avant de cocher une fonctionnalité comme terminée :

- [ ] Le filtrage `organizationId` est explicite dans chaque requête métier
- [ ] Les DTO valident les entrées exposées par l'API
- [ ] Les actions sensibles produisent un `AuditLog`
- [ ] Les tests ciblés sont ajoutés
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` passent
- [ ] La CI GitHub est verte avant fusion

## Suivi GitHub

Le workflow recommandé est détaillé dans [github-workflow.md](github-workflow.md).
