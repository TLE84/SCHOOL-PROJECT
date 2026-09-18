'use server'

import { signOut } from '@/lib/auth/actions'

export async function signout() {
  await signOut()
}
