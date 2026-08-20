export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override the admin sidebar layout so the login page renders clean
  return <>{children}</>
}
