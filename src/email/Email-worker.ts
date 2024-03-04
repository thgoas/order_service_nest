import * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import * as path from 'path'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

@Processor('email')
@Injectable()
export class EmailWorker {
  private transporter: nodemailer.Transporter
  private welcomeTemplate: handlebars.TemplateDelegate
  private passwordResetTemplate: handlebars.TemplateDelegate
  private groupInviteTemplate: handlebars.TemplateDelegate

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAILER_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      {
        from: {
          name: 'No-reply',
          address: process.env.MAIL_FROM,
        },
      },
    )

    // Load Handlebars templates
    this.welcomeTemplate = this.loadTemplate('welcome.hbs')
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    console.log(__dirname)
    const templatesFolderPath = path.join(__dirname, './templates')
    const templatePath = path.join(templatesFolderPath, templateName)

    const templateSource = fs.readFileSync(templatePath, 'utf8')
    return handlebars.compile(templateSource)
  }

  @Process('sendUserWelcome')
  async sendUserWelcome(job: Job<{ user: any; password: string }>) {
    const { user, password } = job.data
    const html = this.welcomeTemplate({ name: user.name, password })
    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Bem-vindo ao order service nest!',
        html: html,
      })
      console.log('Email successfully sent to ', user.email)
    } catch (error) {
      console.error('Error sending email to ', user.email, ': ', error)
      return false
    }
  }

  // Other email sending methods...
}
