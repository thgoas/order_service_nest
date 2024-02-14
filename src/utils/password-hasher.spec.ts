import { PasswordHasher } from './password-hasher'

describe('Password hasher', () => {
  it('should return a hash', async () => {
    const password = '123456'
    const hashedPassword = await PasswordHasher.hashPassword(password)
    expect(hashedPassword).toBeDefined()
    expect(hashedPassword.length).toBeGreaterThan(0)
  })
})
