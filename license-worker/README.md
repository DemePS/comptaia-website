# Service de licence ComptaIA

Un petit Worker Cloudflare avec deux routes :

- `GET /claim?session_id=...` — appelé une fois par la page de confirmation du site, juste après
  le paiement. Il récupère la session Stripe, crée une clé de licence et la relie au client Stripe.
- `GET /verify?key=...` — appelé par le logiciel ComptaIA pour savoir si l'abonnement derrière
  cette clé est toujours actif. Vérifié en direct auprès de Stripe à chaque appel : une annulation
  dans Stripe est visible dès l'appel suivant, sans webhook.

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

4. **Mettre votre clé secrète Stripe** (Dashboard Stripe → Developers → API keys → clé qui commence
   par `sk_live_...`) comme secret Cloudflare — elle n'est jamais écrite dans un fichier :
   ```
   npx wrangler secret put STRIPE_SECRET_KEY
   ```
   Collez la clé quand demandé.

5. **Ajuster `ALLOWED_ORIGIN`** dans `wrangler.toml` avec le vrai domaine du site (pour l'instant
   un placeholder `https://comptaia.fr`).

6. **Déployer** :
   ```
   npx wrangler deploy
   ```
   La commande affiche l'URL du Worker (du genre `https://comptaia-license.VOTRE-COMPTE.workers.dev`).
   C'est cette URL qu'il faut donner à Claude pour la suite (page de confirmation + logiciel).

## Mises à jour suivantes

Après toute modification de `src/index.js` : `npx wrangler deploy`. Pas besoin de refaire les
étapes 1 à 5.
