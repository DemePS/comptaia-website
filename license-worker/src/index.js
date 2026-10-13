/**
 * ComptaIA license service.
 *
 * GET /claim?session_id=cs_...
 *   Called once by the website's confirmation page right after a Stripe Payment Link redirect.
 *   Looks up the Checkout Session, mints a license key for its customer (idempotent: the same
 *   session always returns the same key), and returns it.
 *
 * GET /verify?key=...
 *   Called by the desktop app at startup and periodically. Looks up the customer behind the key
 *   and asks Stripe, live, whether they have an active (or trialing) subscription. There is no
 *   webhook and nothing is cached here: a cancellation in Stripe is reflected on the very next
 *   call, with no extra plumbing.
 */

const STRIPE_API = "https://api.stripe.com/v1"

function licenseKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const b32 = [...bytes].map((b) => b.toString(36).padStart(2, "0")).join("").toUpperCase().slice(0, 20)
  return `CPTA-${b32.slice(0, 5)}-${b32.slice(5, 10)}-${b32.slice(10, 15)}-${b32.slice(15, 20)}`
}

async function stripe(env, path) {
  const res = await fetch(`${STRIPE_API}${path}`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body?.error?.message || `Stripe ${res.status}`)
  return body
}

function cors(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  })
}

async function handleClaim(url, env) {
  const sessionId = url.searchParams.get("session_id")
  if (!sessionId) return { error: "missing session_id", status: 400 }

  const existing = await env.LICENSES.get(`session:${sessionId}`)
  if (existing) return { license_key: existing, status: 200 }

  const session = await stripe(env, `/checkout/sessions/${sessionId}`)
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { error: "payment not completed", status: 402 }
  }
  const customerId = session.customer
  if (!customerId) return { error: "no customer on this session", status: 500 }

  const key = licenseKey()
  await env.LICENSES.put(`license:${key}`, customerId)
  await env.LICENSES.put(`session:${sessionId}`, key)
  return { license_key: key, status: 200 }
}

async function handleVerify(url, env) {
  const key = (url.searchParams.get("key") || "").trim().toUpperCase()
  if (!key) return { active: false, reason: "missing_key", status: 400 }

  const customerId = await env.LICENSES.get(`license:${key}`)
  if (!customerId) return { active: false, reason: "unknown_key", status: 404 }

  const subs = await stripe(env, `/subscriptions?customer=${customerId}&status=all&limit=10`)
  const active = (subs.data || []).some((s) => s.status === "active" || s.status === "trialing")
  return { active, status: 200 }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const headers = cors(env)

    if (request.method === "OPTIONS") return new Response(null, { headers })

    try {
      let result
      if (url.pathname === "/claim") result = await handleClaim(url, env)
      else if (url.pathname === "/verify") result = await handleVerify(url, env)
      else return json({ error: "not found" }, 404, headers)

      const { status, ...data } = result
      return json(data, status, headers)
    } catch (e) {
      return json({ error: e.message || "internal error" }, 502, headers)
    }
  },
}
