# Workflow GitHub

Ce workflow garde `main` stable et permet de revenir facilement en arrière.

## Première publication du dépôt

Le dépôt local n'a pas encore de remote GitHub configuré.

1. Créer un dépôt GitHub vide nommé `teeket`.
2. Ne pas initialiser de README, `.gitignore` ou licence côté GitHub.
3. Ajouter le remote depuis le terminal :

```bash
git remote add origin git@github.com:<votre-compte>/teeket.git
git push -u origin main
git push -u origin feat/tickets-core
```

Utilisez une URL HTTPS à la place de SSH si votre clé SSH GitHub n'est pas configurée.

## Pull request tickets

Avant de publier la première verticale :

```bash
git status
pnpm lint
pnpm typecheck
pnpm test
pnpm build
git add .env.example README.md docs apps packages pnpm-lock.yaml
git status
git commit -m "feat: add tenant-scoped ticket management"
git push -u origin feat/tickets-core
```

Sur GitHub :

1. Ouvrir une pull request de `feat/tickets-core` vers `main`.
2. Vérifier l'onglet **Files changed**.
3. Attendre la CI verte.
4. Utiliser **Squash and merge** pour garder un historique lisible.
5. Supprimer la branche distante après fusion.

## Protection de `main`

Dans **Settings > Branches > Add branch protection rule**, cibler `main` :

- [ ] Exiger une pull request avant fusion
- [ ] Exiger le passage du check CI `verify`
- [ ] Exiger que la branche soit à jour avant fusion
- [ ] Empêcher les force-push
- [ ] Empêcher la suppression de `main`

Si vous travaillez seul, l'approbation obligatoire par une autre personne peut rester désactivée.

## Routine pour chaque verticale

Créer une branche depuis un `main` propre et à jour :

```bash
git switch main
git pull --ff-only
git switch -c feat/<nom-court>
```

Avant chaque commit :

```bash
git status
git diff --check
git diff --cached --check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Publier ensuite la branche et ouvrir une pull request :

```bash
git push -u origin feat/<nom-court>
```

## Secrets

- [ ] Ne jamais committer `.env` ou `.env.local`
- [ ] Vérifier `git status` avant chaque commit
- [ ] Utiliser **Settings > Secrets and variables > Actions** pour les futurs secrets CI
- [ ] Révoquer immédiatement tout secret committé accidentellement
