import * as bcrypt from 'bcrypt'

export class PasswordHasher {
  private static saltRounds = 10

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }
}
