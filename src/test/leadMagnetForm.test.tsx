import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { LeadMagnetForm } from '../app/components/resources/LeadMagnetForm'

function renderForm(resource: 'ai_operations_pain_map' | 'ai_dictionary' = 'ai_operations_pain_map') {
  return render(
    <MemoryRouter initialEntries={['/resources/ai-operations-pain-map']}>
      <Routes>
        <Route
          path='/resources/ai-operations-pain-map'
          element={<LeadMagnetForm resource={resource} submitCta='Send me the Pain Map' />}
        />
        <Route path='/thank-you/business-leader' element={<div>THANK YOU BUSINESS</div>} />
        <Route path='/thank-you/ai-dictionary' element={<div>THANK YOU DICTIONARY</div>} />
      </Routes>
    </MemoryRouter>
  )
}

async function fillStepOne(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/first name/i), 'Ada')
  await user.type(screen.getByLabelText(/work email/i), 'ada@example.com')
  await user.selectOptions(screen.getByLabelText(/role category/i), 'ceo_founder')
}

const successResponse = {
  ok: true,
  audienceSegment: 'business_leader',
  deliveredResource: {
    slug: 'ai_operations_pain_map',
    title: 'The AI Operations Pain Map',
    downloadUrl: 'https://tychosystem.com/downloads/tycho-ai-operations-pain-map.pdf',
  },
  marketingEnrolled: false,
  redirectUrl: '/thank-you/business-leader',
}

describe('LeadMagnetForm', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts on step 1 with an accessible progress indicator', () => {
    renderForm()
    expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
  })

  it('blocks step navigation until required fields are valid', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/please enter your first name/i)).toBeInTheDocument()
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument()
    expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
  })

  it('validates the email format', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText(/first name/i), 'Ada')
    await user.type(screen.getByLabelText(/work email/i), 'not-an-email')
    await user.selectOptions(screen.getByLabelText(/role category/i), 'ceo_founder')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    const emailInput = screen.getByLabelText(/work email/i)
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
  })

  it('navigates to step 2 and back with valid input', async () => {
    const user = userEvent.setup()
    renderForm()
    await fillStepOne(user)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/step 2 of 2/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/team size/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
    // Values survive the round trip.
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Ada')
  })

  it('has the marketing consent unchecked by default and submits consent=false', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(successResponse), { status: 200 })
    )
    renderForm()
    await fillStepOne(user)
    await user.click(screen.getByRole('button', { name: /continue/i }))

    const consent = screen.getByRole('checkbox')
    expect(consent).not.toBeChecked()

    await user.selectOptions(screen.getByLabelText(/team size/i), '6_10')
    await user.selectOptions(screen.getByLabelText(/bottleneck/i), 'slow_lead_response')
    await user.selectOptions(screen.getByLabelText(/hours lost/i), '5_10')
    await user.click(screen.getByRole('button', { name: /send me the pain map/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
    expect(body.marketingConsent).toBe(false)
    expect(body.consentTextVersion).toBeTruthy()
    expect(body.roleCategory).toBe('ceo_founder')
  })

  it('submits consent=true when the checkbox is ticked', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(successResponse), { status: 200 })
    )
    renderForm()
    await fillStepOne(user)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.selectOptions(screen.getByLabelText(/team size/i), '2_5')
    await user.selectOptions(screen.getByLabelText(/bottleneck/i), 'manual_reporting')
    await user.selectOptions(screen.getByLabelText(/hours lost/i), 'not_sure')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /send me the pain map/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)
    expect(body.marketingConsent).toBe(true)
  })

  it('redirects to the returned thank-you route on success', async () => {
    const user = userEvent.setup()
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(successResponse), { status: 200 })
    )
    renderForm()
    await fillStepOne(user)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.selectOptions(screen.getByLabelText(/team size/i), '6_10')
    await user.selectOptions(screen.getByLabelText(/bottleneck/i), 'slow_lead_response')
    await user.selectOptions(screen.getByLabelText(/hours lost/i), '5_10')
    await user.click(screen.getByRole('button', { name: /send me the pain map/i }))

    expect(await screen.findByText('THANK YOU BUSINESS')).toBeInTheDocument()
  })

  it('shows a human-readable error and allows retry on server failure', async () => {
    const user = userEvent.setup()
    const fetchMock = vi
      .mocked(fetch)
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: false, error: 'We could not record your request just now.' }), {
          status: 502,
        })
      )
      .mockResolvedValueOnce(new Response(JSON.stringify(successResponse), { status: 200 }))

    renderForm()
    await fillStepOne(user)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await user.selectOptions(screen.getByLabelText(/team size/i), '6_10')
    await user.selectOptions(screen.getByLabelText(/bottleneck/i), 'slow_lead_response')
    await user.selectOptions(screen.getByLabelText(/hours lost/i), '5_10')

    await user.click(screen.getByRole('button', { name: /send me the pain map/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not record your request/i)

    // Network retry: submitting again succeeds.
    await user.click(screen.getByRole('button', { name: /send me the pain map/i }))
    expect(await screen.findByText('THANK YOU BUSINESS')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('supports keyboard-only completion of step 1', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.tab() // honeypot is tabIndex -1; first tab lands on first name
    expect(screen.getByLabelText(/first name/i)).toHaveFocus()
    await user.keyboard('Ada')
    await user.tab()
    await user.tab()
    expect(screen.getByLabelText(/work email/i)).toHaveFocus()
    await user.keyboard('ada@example.com')
  })

  it('renders the dictionary variant fields on step 2', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LeadMagnetForm resource='ai_dictionary' submitCta='Send me the AI Dictionary' />
      </MemoryRouter>
    )
    await user.type(screen.getByLabelText(/first name/i), 'Sam')
    await user.type(screen.getByLabelText(/^email/i), 'sam@example.com')
    await user.selectOptions(screen.getByLabelText(/current role/i), 'student')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByLabelText(/ai experience/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/primary interest/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/current goal/i)).toBeInTheDocument()
  })
})
