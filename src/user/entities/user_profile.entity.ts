import { Company } from 'src/companies/entities/company.entity'
import { Profile } from 'src/profiles/entities/profile.entity'

export class userProfile {
  name: string
  email: string
  id: string
  profile: Profile
  company: Company[]
}
