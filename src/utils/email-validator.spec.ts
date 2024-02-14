import { EmailValidator } from './email-validator'

describe('Email Validator', () => {
  it('should return true if the email is valid', () => {
    // Exemplo de uso
    const emailValidator = new EmailValidator()
    const emailToValidate = 'user@example.com'

    const result = emailValidator.validate(emailToValidate)

    expect(result).toEqual(true)
  })

  it('should return false if the email is not valid', () => {
    // Exemplo de uso
    const emailValidator = new EmailValidator()
    const emailToValidate = 'user.com'

    const result = emailValidator.validate(emailToValidate)

    expect(result).toEqual(false)
  })
})
