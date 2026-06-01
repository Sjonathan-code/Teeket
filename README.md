# Teeket

Teeket est une base de SaaS B2B de support informatique pour PME, consultants IT, MSP et équipes internes. Ce dépôt prépare un MVP multi-tenant autour des tickets, de l'inventaire machine, de la connaissance, de l'IA et des playbooks d'AutoFix.

Cette première version fournit l'architecture, les garde-fous essentiels, la gestion des tickets et l'authentification utilisateur. L'agent poste de travail reste à implémenter.

## Prérequis

- Node.js 20 ou supérieur
- pnpm 9 ou supérieur
- Docker et Docker Compose

Si `pnpm` n'est pas encore disponible, activez-le avec Corepack :

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
```

## Installation

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Sous PowerShell, utilisez `Copy-Item .env.example .env` à la place de `cp`.

Services locaux :

- Web : http://localhost:3000
- API : http://localhost:3001/api
- Health check : http://localhost:3001/api/health
- PostgreSQL : `localhost:5432`

Le seed crée une organisation `acme-demo`, un administrateur de démonstration, une machine et un ticket.

Pour tester les écrans, créez `apps/web/.env.local` :

```dotenv
NEXT_PUBLIC_API_URL=/api
```

Si le navigateur Windows accède à Next.js via l'adresse IP WSL, ajoutez aussi `DEV_ORIGIN=<adresse-ip-wsl>`. Obtenez cette adresse avec `hostname -I`.

Connectez-vous avec `admin@acme-demo.test` et le mot de passe affiché par `pnpm db:seed`. Le JWT identifie l'utilisateur, puis `TenantGuard` contrôle toujours l'accès à l'organisation courante.

## Commandes utiles

| Commande           | Description                                     |
| ------------------ | ----------------------------------------------- |
| `pnpm dev`         | Démarre les applications en mode développement  |
| `pnpm build`       | Compile tous les workspaces                     |
| `pnpm lint`        | Lance ESLint                                    |
| `pnpm typecheck`   | Vérifie les types TypeScript                    |
| `pnpm test`        | Lance les tests                                 |
| `pnpm format`      | Formate les fichiers avec Prettier              |
| `pnpm db:generate` | Génère le client Prisma                         |
| `pnpm db:migrate`  | Crée ou applique une migration de développement |
| `pnpm db:seed`     | Charge les données de démonstration             |
| `pnpm db:studio`   | Ouvre Prisma Studio                             |

## Structure du projet

```text
.
├── apps
│   ├── api                 # API NestJS modulaire
│   └── web                 # Frontend Next.js App Router
├── packages
│   ├── database            # Schéma Prisma, client et seed
│   └── shared              # Types, enums et DTO simples partagés
├── docs                    # Notes d'architecture et de sécurité
├── .github/workflows       # Intégration continue
└── docker-compose.yml      # PostgreSQL local
```

Modules API préparés :

- `auth`
- `organizations`
- `users`
- `tickets`
- `machines`
- `knowledge-base`
- `ai`
- `playbooks`
- `audit-logs`

## Philosophie multi-tenant

`Organization` est la frontière d'isolation. Les entités métier portent un `organizationId`, et les requêtes métier doivent toujours inclure ce filtre. La table `Membership` relie un utilisateur global à une organisation et à un rôle.

L'API applique trois guards globaux :

1. `AuthGuard` exige un utilisateur authentifié, sauf sur les routes publiques comme le health check.
2. `TenantGuard` exige `x-organization-id` sur les routes marquées `@TenantScoped()` et vérifie l'appartenance en base.
3. `RolesGuard` vérifie les rôles lorsqu'une route déclare `@Roles(...)`.

Les endpoints tickets et `GET /api/machines` appliquent ce filtrage. Le JWT hydrate `request.user`, mais le tenant fourni par le client reste validé côté serveur.

## API tickets

| Méthode | Route                             | Description                         |
| ------- | --------------------------------- | ----------------------------------- |
| `POST`  | `/api/tickets`                    | Crée un ticket                      |
| `GET`   | `/api/tickets`                    | Liste les tickets du tenant         |
| `GET`   | `/api/tickets/:ticketId`          | Affiche le détail d'un ticket       |
| `PATCH` | `/api/tickets/:ticketId/status`   | Modifie le statut                   |
| `PATCH` | `/api/tickets/:ticketId/priority` | Modifie la priorité                 |
| `PATCH` | `/api/tickets/:ticketId/assignee` | Assigne ou désassigne un technicien |
| `POST`  | `/api/tickets/:ticketId/comments` | Ajoute un commentaire               |

## Variables d'environnement

Copiez `.env.example` en `.env`. La configuration de l'API valide au démarrage :

- `DATABASE_URL`
- `API_PORT`
- `API_PREFIX`
- `NODE_ENV`
- `JWT_SECRET`

Les secrets de production ne doivent jamais être committés. Utilisez les secrets de votre hébergeur ou un gestionnaire de secrets.

## Prochaines étapes

La checklist de développement est maintenue dans [docs/roadmap.md](docs/roadmap.md). Le prochain jalon est de publier et fusionner la verticale tickets, puis d'implémenter l'authentification réelle.

Consultez également [docs/architecture.md](docs/architecture.md), [docs/security.md](docs/security.md) et [docs/github-workflow.md](docs/github-workflow.md) avant d'ajouter une fonctionnalité métier.
