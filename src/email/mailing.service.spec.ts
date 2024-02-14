import { Test, TestingModule } from '@nestjs/testing'
import { MailingService } from './mailing.service'

describe('EmailService', () => {
  let mailingService: MailingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailingService],
    }).compile()

    mailingService = module.get<MailingService>(MailingService)
  })

  it('should be defined', () => {
    expect(mailingService).toBeDefined()
  })

  describe('sendUserConfirmation', () => {
    it('should send user confirmation email', async () => {
      const mockUser = {
        firstName: 'John',
        email: 'john@example.com',
      }

      mailingService['transporter'].sendMail = jest.fn((mailOptions) => {
        // Verifying the mail options
        expect(mailOptions.to).toEqual(mockUser.email)
        expect(mailOptions.subject).toEqual('Welcome user! Confirm your Email')
        expect(mailOptions.html).toContain('John')

        // Mocking a resolved promise to simulate sending the email
        return Promise.resolve()
      })

      await mailingService.sendUserConfirmation(mockUser, '123456')

      expect(mailingService['transporter'].sendMail).toHaveBeenCalledWith({
        to: mockUser.email,
        subject: 'Welcome user! Confirm your Email',
        html: expect.stringContaining('John'),
      })
    })
  })
})
