export type Service = {
  title: string
  desc: string
  icon: string
}

export const services: Service[] = [
  {
    title: 'Mobile-first design',
    desc: 'Every site is built for phones first — where most of your customers are looking.',
    icon: 'device',
  },
  {
    title: 'Modern, fast-loading build',
    desc: 'Clean code and optimized assets so your site loads fast and works reliably.',
    icon: 'star',
  },
  {
    title: 'Contact form setup',
    desc: 'Click-to-call, email forms, and maps so customers can reach you easily.',
    icon: 'phone',
  },
  {
    title: 'Basic SEO foundations',
    desc: 'Proper page structure, meta tags, and Google-ready setup out of the box.',
    icon: 'search',
  },
  {
    title: 'Domain & DNS guidance',
    desc: 'We walk you through domain registration, DNS setup, and hosting — no tech knowledge needed.',
    icon: 'edit',
  },
  {
    title: 'Launch support',
    desc: 'We handle the go-live process and make sure everything works before handing it over.',
    icon: 'shield',
  },
  {
    title: 'Optional monthly care',
    desc: 'Ongoing hosting, updates, and small edits so your site stays current after launch.',
    icon: 'shield',
  },
]
