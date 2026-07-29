import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  CONSENT_TEXT_VERSION,
  aiExperienceOptions,
  businessPainOptions,
  businessRoleOptions,
  consentCopy,
  currentGoalOptions,
  dictionaryRoleOptions,
  hoursLostOptions,
  primaryInterestOptions,
  teamSizeOptions,
} from '../../../config/leadMagnets'
import type { ResourceSlug, RoleCategory, SelectOption } from '../../../config/leadMagnets'
import { track } from '../../lib/analytics'
import { getAttribution } from '../../lib/attribution'
import {
  LEAD_MAGNET_RESULT_KEY,
  submitLeadMagnetRequest,
} from '../../lib/leadMagnetApi'
import type { StoredLeadMagnetResult } from '../../lib/leadMagnetApi'

type LeadMagnetFormProps = {
  resource: ResourceSlug
  submitCta: string
}

type FormValues = {
  firstName: string
  lastName: string
  email: string
  companyName: string
  role: string
  teamSize: string
  primaryBusinessPain: string
  hoursLostPerWeek: string
  existingTools: string
  aiExperience: string
  primaryInterest: string
  currentGoal: string
  marketingConsent: boolean
  website: string // honeypot
}

const emptyValues: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  companyName: '',
  role: '',
  teamSize: '',
  primaryBusinessPain: '',
  hoursLostPerWeek: '',
  existingTools: '',
  aiExperience: '',
  primaryInterest: '',
  currentGoal: '',
  marketingConsent: false,
  website: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const inputClasses =
  'w-full rounded-[10px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-4 py-[11px] text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-fainter)] focus:outline-none focus:ring-2 focus:ring-[var(--azure)] aria-[invalid=true]:border-red-400/70'

const labelClasses = 'mb-[6px] block text-[13.5px] font-medium text-[var(--text-secondary)]'

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-[var(--azure)]">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-[var(--text-fainter)]">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mb-0 mt-[6px] text-[12.5px] leading-[1.5] text-[var(--text-faint)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mb-0 mt-[6px] text-[13px] font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectField({
  id,
  value,
  onChange,
  options,
  error,
  placeholder,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  error?: string
  placeholder: string
}) {
  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputClasses} appearance-none ${value ? '' : 'text-[var(--text-fainter)]'}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[var(--surface-solid)] text-[var(--text-primary)]">
          {o.label}
        </option>
      ))}
    </select>
  )
}

/**
 * Shared two-step lead-magnet form. Step 1 asks who the person is; step 2 asks
 * about their operation (Pain Map) or their learning goal (AI Dictionary).
 * Resource delivery never depends on the optional marketing checkbox.
 */
export function LeadMagnetForm({ resource, submitCta }: LeadMagnetFormProps) {
  const navigate = useNavigate()
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [step, setStep] = useState<1 | 2>(1)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [serverError, setServerError] = useState<string | null>(null)
  const startedRef = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  const isBusiness = resource === 'ai_operations_pain_map'
  const roleOptions: SelectOption[] = isBusiness ? businessRoleOptions : dictionaryRoleOptions

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    if (!startedRef.current) {
      startedRef.current = true
      track('lead_magnet_form_started', { resource })
    }
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  const stepOneErrors = useMemo(() => {
    const e: Partial<Record<keyof FormValues, string>> = {}
    if (!values.firstName.trim()) e.firstName = 'Please enter your first name.'
    if (!values.email.trim()) e.email = 'Please enter your email address.'
    else if (!EMAIL_RE.test(values.email.trim())) e.email = 'Please enter a valid email address.'
    if (!values.role) e.role = 'Please select the role that fits you best.'
    return e
  }, [values.firstName, values.email, values.role])

  const stepTwoErrors = useMemo(() => {
    const e: Partial<Record<keyof FormValues, string>> = {}
    if (isBusiness) {
      if (!values.teamSize) e.teamSize = 'Please select your team size.'
      if (!values.primaryBusinessPain)
        e.primaryBusinessPain = 'Please select your primary bottleneck.'
      if (!values.hoursLostPerWeek)
        e.hoursLostPerWeek = 'Please estimate the hours lost per week.'
    } else {
      if (!values.aiExperience) e.aiExperience = 'Please select your AI experience.'
      if (!values.primaryInterest) e.primaryInterest = 'Please select your primary interest.'
      if (!values.currentGoal) e.currentGoal = 'Please select your current goal.'
    }
    return e
  }, [isBusiness, values])

  const focusFirstInvalid = (invalid: Partial<Record<keyof FormValues, string>>) => {
    const first = Object.keys(invalid).find((k) => invalid[k as keyof FormValues])
    if (first) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>(`#${first}`)
          ?.focus()
      })
    }
  }

  const goToStepTwo = () => {
    if (Object.values(stepOneErrors).some(Boolean)) {
      setErrors(stepOneErrors)
      focusFirstInvalid(stepOneErrors)
      return
    }
    setErrors({})
    setStep(2)
    track('lead_magnet_step_completed', { resource, step: 1 })
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('h2, select')?.focus())
  }

  const roleCategory = (): RoleCategory => {
    if (isBusiness) return values.role as RoleCategory
    const match = dictionaryRoleOptions.find((o) => o.value === values.role)
    return match?.roleCategory ?? 'other'
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (step === 1) {
      goToStepTwo()
      return
    }
    if (Object.values(stepTwoErrors).some(Boolean)) {
      setErrors(stepTwoErrors)
      focusFirstInvalid(stepTwoErrors)
      return
    }

    setStatus('submitting')
    setServerError(null)
    track('lead_magnet_step_completed', { resource, step: 2 })
    track(values.marketingConsent ? 'marketing_consent_given' : 'marketing_consent_declined', {
      resource,
    })

    try {
      const response = await submitLeadMagnetRequest({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim() || undefined,
        email: values.email.trim(),
        companyName: values.companyName.trim() || undefined,
        roleCategory: roleCategory(),
        teamSize: values.teamSize || undefined,
        primaryBusinessPain: values.primaryBusinessPain || undefined,
        hoursLostPerWeek: values.hoursLostPerWeek || undefined,
        existingTools: values.existingTools.trim() || undefined,
        aiExperience: values.aiExperience || undefined,
        primaryInterest: values.primaryInterest || undefined,
        currentGoal: values.currentGoal || undefined,
        requestedResource: resource,
        marketingConsent: values.marketingConsent,
        consentTextVersion: CONSENT_TEXT_VERSION,
        website: values.website,
        source: getAttribution(),
      })

      track('lead_magnet_form_submitted', { resource })
      track('audience_classified', {
        resource,
        segment: response.audienceSegment,
        delivered: response.deliveredResource.slug,
      })
      track('lead_magnet_delivered', { resource: response.deliveredResource.slug })

      const stored: StoredLeadMagnetResult = {
        ...response,
        requestedResource: resource,
        firstName: values.firstName.trim(),
        primaryBusinessPain: values.primaryBusinessPain || undefined,
      }
      try {
        sessionStorage.setItem(LEAD_MAGNET_RESULT_KEY, JSON.stringify(stored))
      } catch {
        // Thank-you page falls back to generic copy without stored state.
      }

      navigate(response.redirectUrl, { state: stored })
    } catch (err) {
      setStatus('error')
      setServerError(
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong sending your request. Please try again.'
      )
      track('lead_magnet_form_failed', { resource })
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label={submitCta}>
      {/* Accessible progress indicator */}
      <p
        className="mb-5 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--text-faint)]"
        aria-live="polite"
      >
        Step {step} of 2 · {step === 1 ? 'About you' : isBusiness ? 'About the operation' : 'Your learning goal'}
      </p>

      {/* Honeypot: hidden from real users, tempting for bots. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
        />
      </div>

      {step === 1 && (
        <fieldset className="m-0 space-y-5 border-0 p-0">
          <legend className="sr-only">About you</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="firstName" label="First name" required error={errors.firstName}>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                aria-invalid={errors.firstName ? true : undefined}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                className={inputClasses}
              />
            </Field>
            <Field id="lastName" label="Last name" error={errors.lastName}>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={values.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                className={inputClasses}
              />
            </Field>
          </div>

          <Field
            id="email"
            label={isBusiness ? 'Work email' : 'Email'}
            required
            error={errors.email}
            hint={consentCopy.deliveryNotice}
          >
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : 'email-hint'}
              className={inputClasses}
            />
          </Field>

          <Field
            id="role"
            label={isBusiness ? 'Role category' : 'Current role'}
            required
            error={errors.role}
          >
            <SelectField
              id="role"
              value={values.role}
              onChange={(v) => set('role', v)}
              options={roleOptions}
              error={errors.role}
              placeholder="Select your role…"
            />
          </Field>

          <Field
            id="companyName"
            label={isBusiness ? 'Company name' : 'Company or organisation'}
            error={errors.companyName}
          >
            <input
              id="companyName"
              name="companyName"
              type="text"
              autoComplete="organization"
              value={values.companyName}
              onChange={(e) => set('companyName', e.target.value)}
              className={inputClasses}
            />
          </Field>

          <button
            type="button"
            onClick={goToStepTwo}
            className="inline-flex items-center gap-2 rounded-[11px] bg-[var(--azure)] px-[24px] py-[13px] text-[15px] font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--azure-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
          >
            Continue
            <span aria-hidden="true" className="font-mono">
              →
            </span>
          </button>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="m-0 space-y-5 border-0 p-0">
          <legend className="sr-only">
            {isBusiness ? 'About the operation' : 'Your learning goal'}
          </legend>

          {isBusiness ? (
            <>
              <Field id="teamSize" label="Team size" required error={errors.teamSize}>
                <SelectField
                  id="teamSize"
                  value={values.teamSize}
                  onChange={(v) => set('teamSize', v)}
                  options={teamSizeOptions}
                  error={errors.teamSize}
                  placeholder="Select team size…"
                />
              </Field>
              <Field
                id="primaryBusinessPain"
                label="Primary operational bottleneck"
                required
                error={errors.primaryBusinessPain}
              >
                <SelectField
                  id="primaryBusinessPain"
                  value={values.primaryBusinessPain}
                  onChange={(v) => set('primaryBusinessPain', v)}
                  options={businessPainOptions}
                  error={errors.primaryBusinessPain}
                  placeholder="Select the biggest bottleneck…"
                />
              </Field>
              <Field
                id="hoursLostPerWeek"
                label="Approximate hours lost per week"
                required
                error={errors.hoursLostPerWeek}
              >
                <SelectField
                  id="hoursLostPerWeek"
                  value={values.hoursLostPerWeek}
                  onChange={(v) => set('hoursLostPerWeek', v)}
                  options={hoursLostOptions}
                  error={errors.hoursLostPerWeek}
                  placeholder="Select an estimate…"
                />
              </Field>
              <Field id="existingTools" label="Existing tools" error={errors.existingTools}>
                <input
                  id="existingTools"
                  name="existingTools"
                  type="text"
                  value={values.existingTools}
                  onChange={(e) => set('existingTools', e.target.value)}
                  placeholder="e.g. Gmail, spreadsheets, QuickBooks, HubSpot"
                  className={inputClasses}
                />
              </Field>
            </>
          ) : (
            <>
              <Field id="aiExperience" label="AI experience" required error={errors.aiExperience}>
                <SelectField
                  id="aiExperience"
                  value={values.aiExperience}
                  onChange={(v) => set('aiExperience', v)}
                  options={aiExperienceOptions}
                  error={errors.aiExperience}
                  placeholder="Select your experience level…"
                />
              </Field>
              <Field
                id="primaryInterest"
                label="Primary interest"
                required
                error={errors.primaryInterest}
              >
                <SelectField
                  id="primaryInterest"
                  value={values.primaryInterest}
                  onChange={(v) => set('primaryInterest', v)}
                  options={primaryInterestOptions}
                  error={errors.primaryInterest}
                  placeholder="Select what interests you most…"
                />
              </Field>
              <Field id="currentGoal" label="Current goal" required error={errors.currentGoal}>
                <SelectField
                  id="currentGoal"
                  value={values.currentGoal}
                  onChange={(v) => set('currentGoal', v)}
                  options={currentGoalOptions}
                  error={errors.currentGoal}
                  placeholder="Select your current goal…"
                />
              </Field>
            </>
          )}

          {/* Marketing consent — optional and separate from delivery. */}
          <div className="rounded-[12px] border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-start gap-3">
              <input
                id="marketingConsent"
                name="marketingConsent"
                type="checkbox"
                checked={values.marketingConsent}
                onChange={(e) => set('marketingConsent', e.target.checked)}
                className="mt-[3px] h-4 w-4 shrink-0 accent-[var(--azure)]"
              />
              <label
                htmlFor="marketingConsent"
                className="text-[13.5px] leading-[1.6] text-[var(--text-muted)]"
              >
                {consentCopy.marketingLabel}
              </label>
            </div>
            <p className="mb-0 ml-7 mt-2 text-[12.5px] text-[var(--text-faint)]">
              You will receive the guide either way. See our{' '}
              <Link to={consentCopy.privacyPolicyPath} className="text-[var(--azure)] underline underline-offset-2">
                privacy policy
              </Link>
              .
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-[12px] border border-red-400/40 bg-red-400/10 p-4 text-[14px] leading-[1.6] text-red-300"
            >
              {serverError} If the problem continues, email us and we will send the guide directly.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-[11px] border border-[var(--border-hover)] bg-[var(--bg-surface)] px-[20px] py-[13px] text-[15px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
            >
              <span aria-hidden="true" className="font-mono">
                ←
              </span>
              Back
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center gap-2 rounded-[11px] bg-[var(--azure)] px-[24px] py-[13px] text-[15px] font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--azure-hover)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--azure)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
            >
              {status === 'submitting' ? 'Sending your guide…' : submitCta}
              {status !== 'submitting' && (
                <span aria-hidden="true" className="font-mono">
                  →
                </span>
              )}
            </button>
          </div>

          <p className="sr-only" aria-live="polite">
            {status === 'submitting' ? 'Sending your request.' : ''}
          </p>
        </fieldset>
      )}
    </form>
  )
}
