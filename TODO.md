# À faire pour activer les paiements et la licence

## 1. Déployer le Worker Cloudflare (vérification de licence)
- Dossier `license-worker/` de ce repo, instructions complètes dans `license-worker/README.md`.
- Créer un compte Cloudflare (gratuit) si besoin.
- `npm install`, `npx wrangler login`.
- Créer le namespace KV : `npx wrangler kv namespace create LICENSES`, coller l'id dans `wrangler.toml`.
- Mettre la clé secrète Stripe (`sk_live_...`) comme secret Cloudflare : `npx wrangler secret put STRIPE_SECRET_KEY`.
- Ajuster `ALLOWED_ORIGIN` dans `wrangler.toml` avec le vrai domaine du site.
- Déployer : `npx wrangler deploy`.
- Récupérer l'URL du Worker (ex. `https://comptaia-license.VOTRE-COMPTE.workers.dev`).

## 2. Donner l'URL du Worker à Claude
Pour la mettre à jour dans :
- `confirmation.html` (ce repo) — actuellement `REPLACE_WITH_WORKER_URL`
- `license.py` (repo `comptaia`) — variable `COMPTAIA_LICENSE_SERVICE`

## 3. Configurer la redirection post-paiement dans Stripe
Pour chaque Payment Link (Étudiant et Professionnel), dans le Dashboard Stripe :
- Paramètres du Payment Link → "After payment" → rediriger vers :
  `https://VOTRE-DOMAINE/confirmation.html?session_id={CHECKOUT_SESSION_ID}`

## 4. Confirmer le vrai nom de domaine du site
Des placeholders (`comptaia.fr`) sont utilisés à plusieurs endroits à corriger :
- `license-worker/wrangler.toml` (`ALLOWED_ORIGIN`)
- `excel_filler/desktop/license.py` (`SUBSCRIBE_URL`, repo `comptaia`)

## 5. Publier une release du logiciel sur GitHub
- Repo `comptaia` : pousser un tag `v...` (ex. `v0.1.3`) pour déclencher le build Windows et publier
  automatiquement `ComptaIA-windows.zip` comme GitHub Release.
- Une fois publiée, vérifier que le lien "Télécharger ComptaIA" de `confirmation.html` (actuellement
  `releases/latest`) fonctionne bien.

## Pour vérifier que tout marche
1. Payer avec un Payment Link Stripe (ou en mode test).
2. Arriver sur `confirmation.html` → une clé de licence `CPTA-...` doit s'afficher.
3. Lancer ComptaIA, entrer la clé dans "My license" → doit passer à "active".
4. Annuler l'abonnement dans Stripe, puis cliquer "Check my license" dans l'app → doit passer à "not active".
