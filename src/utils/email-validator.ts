export class EmailValidator {
  private emailPattern: RegExp

  constructor() {
    // Expressão regular simples para validar endereços de e-mail
    this.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }

  validate(email: string): boolean {
    // Método para validar o endereço de e-mail usando a expressão regular
    return this.emailPattern.test(email)
  }
}
