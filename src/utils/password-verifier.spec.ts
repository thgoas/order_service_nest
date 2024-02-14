import { PasswordHasher } from './password-hasher'
import { PasswordVerifier } from './password-verifier'

describe('PasswordVerifier', () => {
  it('should compare passwords and return true for matching passwords', async () => {
    const password = '123456'
    const hashedPassword = await PasswordHasher.hashPassword(password)
    const isMatch = await PasswordVerifier.comparePassword(
      password,
      hashedPassword,
    )

    expect(isMatch).toBe(true)
  })

  it('should compare passwords and return false for non-matching passwords', async () => {
    const password = '123456'
    const wrongPassword = 'senhaIncorreta'
    const hashedPassword = await PasswordHasher.hashPassword(password)
    const isMatch = await PasswordVerifier.comparePassword(
      wrongPassword,
      hashedPassword,
    )

    expect(isMatch).toBe(false)
  })
})
