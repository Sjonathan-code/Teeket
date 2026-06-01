# Architecture

## Principes

Teeket démarre comme un monorepo TypeScript simple. Turborepo orchestre les tâches, pnpm gère les workspaces, Prisma centralise le modèle PostgreSQL et NestJS expose l'API.

Le MVP reste un monolithe modulaire : il est plus facile à faire évoluer seul et conserve des frontières explicites entre domaines. Les workers, files de messages ou services séparés ne seront ajoutés que lorsque les usages le justifieront.

## Composants

| Composant           | Responsabilité                                           |
| ------------------- | -------------------------------------------------------- |
| `apps/web`          | Interface Next.js pour les utilisateurs et techniciens   |
| `apps/api`          | API NestJS, sécurité, règles métier et accès aux données |
| `packages/database` | Schéma Prisma, migrations et seed                        |
| `packages/shared`   | Contrats TypeScript simples réutilisables                |

## Modules API

Chaque domaine possède son module NestJS. `tickets` et `machines` servent d'exemples fonctionnels minimaux. Les autres modules sont volontairement des squelettes afin de laisser les besoins métier guider leur implémentation.

## Données

`User` est global. Une personne peut rejoindre plusieurs organisations grâce à `Membership`. Les données opérationnelles restent isolées par `organizationId`.

Les snapshots machine et journaux d'audit sont append-oriented : ils sont conçus pour conserver l'historique utile sans surcharger les modèles principaux.
