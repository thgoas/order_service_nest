export interface EmailOrderService {
  order_number: string
  applicant: string
  date_entry: string
  date_departure?: string
  identification_number?: string
  serie_number?: string
  status: string
  technicianEmail: string
  userEmail: string
  description: string
  technical_accompaniments?: string[]
  solution: string
  type?: string
}
