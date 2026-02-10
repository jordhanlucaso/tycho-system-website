import { supabase } from './supabase.js'

type SiteRow = {
  id: string
  domain: string
  status: string
}

async function checkSite(site: SiteRow): Promise<{ statusCode: number; responseTimeMs: number }> {
  const start = Date.now()
  try {
    const url = site.domain.startsWith('http') ? site.domain : `https://${site.domain}`
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) })
    return { statusCode: res.status, responseTimeMs: Date.now() - start }
  } catch {
    return { statusCode: 0, responseTimeMs: Date.now() - start }
  }
}

export async function runHealthChecks() {
  const { data: sites, error } = await supabase
    .from('sites')
    .select('id, domain, status')
    .eq('status', 'active')

  if (error || !sites?.length) {
    console.log('Health check: no active sites to check')
    return
  }

  console.log(`Health check: checking ${sites.length} sites...`)

  for (const site of sites) {
    const result = await checkSite(site)
    const isUp = result.statusCode >= 200 && result.statusCode < 400

    await supabase.from('health_checks').insert({
      site_id: site.id,
      status_code: result.statusCode,
      response_time_ms: result.responseTimeMs,
      is_up: isUp
    })

    console.log(`  ${site.domain}: ${isUp ? 'UP' : 'DOWN'} (${result.statusCode}, ${result.responseTimeMs}ms)`)
  }
}

export function startHealthCheckCron(intervalMs = 5 * 60 * 1000) {
  console.log(`Health check cron started (every ${intervalMs / 1000}s)`)
  const timer = setInterval(runHealthChecks, intervalMs)
  // Run immediately on start
  runHealthChecks()
  return timer
}
