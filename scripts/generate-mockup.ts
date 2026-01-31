import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function main() {
  const args = process.argv.slice(2)
  const get = (key: string) => {
    const i = args.indexOf(`--${key}`)
    return i >= 0 ? args[i + 1] : undefined
  }

  const name = get('name')
  const category = get('category')
  const city = get('city')
  const tagline = get('tagline') ?? 'Modern website mockup preview.'

  if (!name || !category || !city) {
    console.log(`Usage:\n  bun run gen:mockup --name "Bright Salon" --category "Hair Salon" --city "Birmingham, AL" --tagline "..."`)
    process.exit(1)
  }

  const slug = slugify(`${name}-${city}`)

  const filePath = join(process.cwd(), 'src', 'config', 'mockups.ts')
  if (!existsSync(filePath)) {
    console.error('Cannot find src/config/mockups.ts')
    process.exit(1)
  }

  const content = readFileSync(filePath, 'utf-8')

  if (content.includes(`slug: "${slug}"`)) {
    console.log(`Mockup already exists: ${slug}`)
    process.exit(0)
  }

  const insertBefore = '];'
  const idx = content.lastIndexOf(insertBefore)
  if (idx === -1) {
    console.error("Could not find end of mockups array ('];').")
    process.exit(1)
  }

  const entry = `  {\n    slug: "${slug}",\n    name: "${name}",\n    category: "${category}",\n    city: "${city}",\n    tagline: "${tagline}",\n  },\n`

  const updated = content.slice(0, idx) + entry + content.slice(idx)
  writeFileSync(filePath, updated, 'utf-8')

  console.log('Added mockup:')
  console.log({ slug, name, category, city, tagline })
  console.log(`Preview URL: /m/${slug}`)
}

main()
