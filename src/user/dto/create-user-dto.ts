export class CreateUserDto {
  readonly id?: string
  readonly name: string
  readonly email: string
  readonly password: string
  readonly status?: boolean
  readonly profile_id: string
  readonly created_at?: Date
  readonly updated_at?: Date
  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    status: boolean,
    profile_id: string,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.status = status
    this.profile_id = profile_id
    this.created_at = created_at
    this.updated_at = updated_at
  }
}
