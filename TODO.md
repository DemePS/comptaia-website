# À faire pour activer les paiements et la licence

## 1. ✅ Déployer le Worker Cloudflare (vérification de licence)
Fait. URL : `https://comptaia-license.demeps.workers.dev`

## 2. ✅ URL du Worker renseignée
- `confirmation.html` (ce repo)
- `license.py` (repo `comptaia`, `COMPTAIA_LICENSE_SERVICE`)

## 3. ✅ Redirection post-paiement Stripe configurée

## 4. ✅ Domaine confirmé
`https://demeps.github.io/comptaia-website/` — `ALLOWED_ORIGIN` et `SUBSCRIBE_URL` mis à jour en conséquence.

## 5. Publier une release du logiciel sur GitHub (reste à faire)
- Repo `comptaia` : pousser un tag `v...` (ex. `v0.1.3`) pour déclencher le build Windows et publier
  automatiquement `ComptaIA-windows.zip` comme GitHub Release.
- Une fois publiée, vérifier que le lien "Télécharger ComptaIA" de `confirmation.html` (actuellement
  `releases/latest`) fonctionne bien.

## Pour vérifier que tout marche
1. Payer avec un Payment Link Stripe (ou en mode test).
2. Arriver sur `confirmation.html` → une clé de licence `CPTA-...` doit s'afficher.
3. Lancer ComptaIA, entrer la clé dans "My license" → doit passer à "active".
4. Annuler l'abonnement dans Stripe, puis cliquer "Check my license" dans l'app → doit passer à "not active".
