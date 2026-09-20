import { resendEmailCode, verifyEmailCode } from '@/lib/auth/otp-actions'
import { SubmitButton } from './SubmitButton'

const errorMessages: Record<string, string> = {
  invalid: 'That code is not right, or it has expired. Check the latest email, or send a new code.',
  rate: 'Too many attempts. Please wait a few minutes and try again.',
  resend: 'We couldn’t send a new code just now. Please try again shortly.',
}

const noticeMessages: Record<string, string> = {
  sent: 'A new code is on its way — it can take a minute to arrive.',
  unconfirmed: 'Your email address isn’t confirmed yet. Enter the code we emailed you.',
}

interface VerifyCodeFormProps {
  email: string
  error?: string
  notice?: string
}

export function VerifyCodeForm({ email, error, notice }: VerifyCodeFormProps) {
  const errorMessage = error ? errorMessages[error] ?? errorMessages.invalid : null
  const noticeMessage = notice ? noticeMessages[notice] : null

  return (
    <div className="flex flex-col gap-5">
      {errorMessage && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      {!errorMessage && noticeMessage && (
        <p role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {noticeMessage}
        </p>
      )}

      <form className="flex flex-col gap-5">
        <input type="hidden" name="email" value={email} />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="code">
            Verification code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,12}"
            maxLength={12}
            required
            autoFocus
            placeholder="12345678"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
          />
        </div>

        <SubmitButton formAction={verifyEmailCode} pendingLabel="Verifying…">
          Verify email
        </SubmitButton>
      </form>

      <form className="text-center">
        <input type="hidden" name="email" value={email} />
        <SubmitButton formAction={resendEmailCode} pendingLabel="Sending…" tone="secondary">
          Send a new code
        </SubmitButton>
      </form>
    </div>
  )
}
