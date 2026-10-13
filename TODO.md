# À faire pour activer les paiements et la licence

## 1. ✅ Déployer le Worker Cloudflare (vérification de licence)
Fait. URL : `https://comptaia-license.demeps.workers.dev`

## 2. ✅ URL du Worker renseignée
- `confirmation.html` (ce repo)
- `license.py` (repo `comptaia`, `COMPTAIA_LICENSE_SERVICE`)

## 3. ✅ Redirection post-paiement Stripe configurée

## 4. ✅ Domaine confirmé
`https://demeps.github.io/comptaia-website/` — `ALLOWED_ORIGIN` et `SUBSCRIBE_URL` mis à jour en conséquence.

## 5. ✅ Release du logiciel publiée sur GitHub
`v0.1.3`, avec `ComptaIA-windows.zip` attaché.

## 6. Rendre le téléchargement accessible aux clients (reste à faire)
Le repo `comptaia` est **privé** : le lien direct vers `releases/latest/download/...` renvoie une
404 pour un client non connecté à GitHub. Le téléchargement passe maintenant par un bucket R2
(`/download` sur le Worker), mais il faut encore, côté Cloudflare + GitHub (voir
`license-worker/README.md`, section "Mettre le logiciel dans le bucket") :
- Créer le bucket R2 : `npx wrangler r2 bucket create comptaia-releases`
- Créer un jeton d'API R2 (Cloudflare Dashboard → R2 → Manage R2 API Tokens, Object Read & Write)
- Ajouter 3 secrets au repo **comptaia** (Settings → Secrets and variables → Actions) :
  `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- Redéployer le Worker (`npx wrangler deploy` dans `license-worker/`)
- Relancer le build (Actions → Build Windows app → Run workflow) pour que le zip soit poussé vers R2

## Pour vérifier que tout marche
1. Payer avec un Payment Link Stripe (ou en mode test).
2. Arriver sur `confirmation.html` → une clé de licence `CPTA-...` doit s'afficher.
3. Lancer ComptaIA, entrer la clé dans "My license" → doit passer à "active".
4. Annuler l'abonnement dans Stripe, puis cliquer "Check my license" dans l'app → doit passer à "not active".
