# Teeket

Teeket est une base de SaaS B2B de support informatique pour PME, consultants IT, MSP et équipes internes. Ce dépôt prépare un MVP multi-tenant autour des tickets, de l'inventaire machine, de la connaissance, de l'IA et des playbooks d'AutoFix.

Cette première version fournit l'architecture et les garde-fous essentiels. L'authentification réelle, les parcours métier complets et l'agent poste de travail restent à implémenter.

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

Le seed crée une organisation `acme-demo`, un administrateur de démonstration, une machine et un ticket. Aucun mot de passe n'est créé tant que l'authentification n'est pas implémentée.

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

Les endpoints `GET /api/tickets` et `GET /api/machines` illustrent ce filtrage. Le futur mécanisme JWT devra hydrater `request.user`; il ne devra jamais accepter un tenant fourni par le client sans validation serveur.

## Variables d'environnement

Copiez `.env.example` en `.env`. La configuration de l'API valide au démarrage :

- `DATABASE_URL`
- `API_PORT`
- `API_PREFIX`
- `NODE_ENV`

Les secrets de production ne doivent jamais être committés. Utilisez les secrets de votre hébergeur ou un gestionnaire de secrets.

## Prochaines étapes

1. Implémenter l'authentification avec hash de mot de passe, JWT court, refresh token rotatif et récupération de mot de passe.
2. Ajouter les CRUD tickets et machines avec DTO validés et tests d'isolation tenant.
3. Ajouter l'audit des mutations sensibles.
4. Définir le protocole sécurisé de l'agent machine.
5. Brancher les suggestions IA avec journalisation, contrôle des coûts et validation humaine.
6. Exécuter les AutoFix dans un worker isolé avec actions autorisées explicitement.

Consultez [docs/architecture.md](docs/architecture.md) et [docs/security.md](docs/security.md) avant d'ajouter des fonctionnalités métier.
