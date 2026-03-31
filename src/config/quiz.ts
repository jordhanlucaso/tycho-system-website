import { oneTimePackages, monthlyPlans } from './pricing'

export type QuizOption = {
  label: string
  value: string
  emoji: string
}

export type QuizQuestion = {
  id: string
  question: string
  hint?: string
  options: QuizOption[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'business_type',
    question: 'What best describes your business?',
    hint: 'This helps us match the right website structure for you.',
    options: [
      { label: 'Single-location service', value: 'single_service', emoji: '🔧' },
      { label: 'Restaurant or hospitality', value: 'restaurant', emoji: '🍽️' },
      { label: 'Multi-location or franchise', value: 'multi_location', emoji: '🏢' },
      { label: 'Professional services', value: 'professional', emoji: '💼' },
    ],
  },
  {
    id: 'booking',
    question: 'Do you need online booking or reservations?',
    hint: 'Think appointments, table reservations, or service scheduling.',
    options: [
      { label: 'Yes, it\'s essential', value: 'essential', emoji: '📅' },
      { label: 'Nice to have', value: 'nice', emoji: '✅' },
      { label: 'Not needed', value: 'no', emoji: '✗' },
    ],
  },
  {
    id: 'pages',
    question: 'How many pages do you need?',
    hint: 'A page = Home, About, Services, Contact, Gallery, etc.',
    options: [
      { label: 'Just 1 simple page', value: 'one', emoji: '📄' },
      { label: '3–5 pages', value: 'few', emoji: '📋' },
      { label: '8+ pages or blog/CMS', value: 'many', emoji: '📚' },
      { label: 'Multiple locations', value: 'multi', emoji: '🗺️' },
    ],
  },
  {
    id: 'goal',
    question: 'What\'s your primary goal for this website?',
    hint: 'Pick the one that matters most right now.',
    options: [
      { label: 'Get found on Google', value: 'seo', emoji: '🔍' },
      { label: 'Get calls and bookings', value: 'calls', emoji: '📞' },
      { label: 'Showcase my work', value: 'portfolio', emoji: '🎨' },
      { label: 'Replace my outdated site', value: 'refresh', emoji: '🔄' },
    ],
  },
  {
    id: 'support',
    question: 'Would you like ongoing support after launch?',
    hint: 'Monthly plans keep your site fast, secure, and improving.',
    options: [
      { label: 'Yes, keep improving it', value: 'growth', emoji: '📈' },
      { label: 'Just hosting & backups', value: 'care', emoji: '🛡️' },
      { label: 'Just the project for now', value: 'none', emoji: '🚀' },
    ],
  },
]

export type QuizAnswers = Record<string, string>

export type QuizRecommendation = {
  package: typeof oneTimePackages[number]
  plan?: typeof monthlyPlans[number]
  reason: string
  planReason?: string
}

export function getRecommendation(answers: QuizAnswers): QuizRecommendation {
  const { business_type, booking, pages, goal, support } = answers

  // Determine package
  let pkg = oneTimePackages[0] // default: Local Starter

  if (pages === 'many' || pages === 'multi' || business_type === 'multi_location') {
    pkg = oneTimePackages.find((p) => p.id === 'pro-website') ?? pkg
  } else if (pages === 'few' || business_type === 'professional' || booking === 'essential') {
    pkg = oneTimePackages.find((p) => p.id === 'business-website') ?? pkg
  }

  // Build reason
  const reasons: string[] = []
  if (pages === 'multi' || business_type === 'multi_location')
    reasons.push('handles multiple locations under one umbrella')
  else if (booking === 'essential')
    reasons.push('includes booking and scheduling integration')
  else if (pages === 'many')
    reasons.push('supports a full CMS and content-rich site')
  else if (pages === 'few')
    reasons.push('covers a complete multi-page professional site')
  else
    reasons.push('is the perfect starting point for a clean local presence')

  if (goal === 'seo') reasons.push('with built-in local SEO foundations')
  else if (goal === 'calls') reasons.push('optimized for calls-to-action and conversions')
  else if (goal === 'portfolio') reasons.push('with a gallery and showcase layout')

  // Determine monthly plan
  let plan: typeof monthlyPlans[number] | undefined
  let planReason: string | undefined

  if (support === 'growth') {
    if (goal === 'seo' || pkg.id === 'pro-website') {
      plan = monthlyPlans.find((p) => p.id === 'performance-plan')
      planReason = 'matches your growth goals with SEO improvements and expert monthly hours'
    } else {
      plan = monthlyPlans.find((p) => p.id === 'growth-plan')
      planReason = 'keeps your site continuously improving with regular updates'
    }
  } else if (support === 'care') {
    plan = monthlyPlans.find((p) => p.id === 'care-plan')
    planReason = 'covers hosting, backups, and 1 hour of edits per month'
  }

  return {
    package: pkg,
    plan,
    reason: reasons.join(', '),
    planReason,
  }
}
