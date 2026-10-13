# Service de licence ComptaIA

Un petit Worker Cloudflare avec trois routes :

- `GET /claim?session_id=...` — appelé une fois par la page de confirmation du site, juste après
  le paiement. Il récupère la session Stripe, crée une clé de licence et la relie au client Stripe.
- `GET /verify?key=...` — appelé par le logiciel ComptaIA pour savoir si l'abonnement derrière
  cette clé est toujours actif. Vérifié en direct auprès de Stripe à chaque appel : une annulation
  dans Stripe est visible dès l'appel suivant, sans webhook.
- `GET /download` — sert `ComptaIA-windows.zip` depuis un bucket R2. Le repo `comptaia` (code source
  + GitHub Releases) reste privé ; c'est le seul chemin public pour récupérer le fichier.

La clé secrète Stripe reste uniquement dans Cloudflare — jamais dans ce dépôt, jamais dans le chat.

## Déploiement (une seule fois)

1. **Créer un compte Cloudflare** (gratuit) sur https://dash.cloudflare.com/sign-up si vous n'en avez pas.

2. **Installer les dépendances et se connecter** :
   ```
   cd license-worker
   npm install
   npx wrangler login
   ```
   Une fenêtre de navigateur s'ouvre pour autoriser l'accès.

3. **Créer l'espace de stockage (KV)** qui associera les clés de licence aux clients Stripe :
   ```
   npx wrangler kv namespace create LICENSES
   ```
   La commande affiche un `id`. Collez-le dans `wrangler.toml`, à la place de
   `REPLACE_WITH_KV_NAMESPACE_ID`.

4. **Créer le bucket R2** qui contiendra le `.zip` à télécharger :
   ```
   npx wrangler r2 bucket create comptaia-releases
   ```
   (`wrangler.toml` y fait déjà référence sous le nom `comptaia-releases` — rien à modifier ici
   sauf si vous changez ce nom.)

5. **Mettre votre clé secrète Stripe** (Dashboard Stripe → Developers → API keys → clé qui commence
   par `sk_live_...`) comme secret Cloudflare — elle n'est jamais écrite dans un fichier :
   ```
   npx wrangler secret put STRIPE_SECRET_KEY
   ```
   Collez la clé quand demandé.

6. **Ajuster `ALLOWED_ORIGIN`** dans `wrangler.toml` avec le vrai domaine du site si besoin
   (déjà réglé sur `https://demeps.github.io`).

7. **Déployer** :
   ```
   npx wrangler deploy
   ```
   La commande affiche l'URL du Worker (du genre `https://comptaia-license.VOTRE-COMPTE.workers.dev`).

## Mettre le logiciel dans le bucket (pour le workflow CI)

Le workflow `build-windows.yml` du repo `comptaia` pousse automatiquement le zip vers R2 à chaque
build. Pour que ça marche, il lui faut un jeton d'API R2 (différent du login `wrangler`) :

1. Dans le Dashboard Cloudflare → **R2** → **Manage R2 API Tokens** → **Create API Token**.
   - Permissions : **Object Read & Write**.
   - Limitez-le au bucket `comptaia-releases` si l'option est proposée.
2. Cloudflare affiche trois valeurs à copier : l'**Account ID**, l'**Access Key ID** et la
   **Secret Access Key**.
3. Dans le repo **comptaia** (pas celui-ci) sur GitHub : **Settings → Secrets and variables →
   Actions → New repository secret**, créez-en trois :
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`

Une fois ces secrets en place, chaque run du workflow "Build Windows app" envoie
`ComptaIA-windows.zip` à la fois sur GitHub Releases (interne, repo privé) et sur R2 (via
`/download` du Worker, public).

## Mises à jour suivantes

Après toute modification de `src/index.js` ou `wrangler.toml` : `npx wrangler deploy`. Pas besoin
de refaire les étapes 1 à 6.
