import * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import * as handlebars from 'handlebars'
import * as fs from 'fs'
import * as path from 'path'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { EmailOrderService } from './model/email-order-service'

@Processor('email')
@Injectable()
export class EmailWorker {
  private transporter: nodemailer.Transporter
  private welcomeTemplate: handlebars.TemplateDelegate
  private forgotPasswordTemplate: handlebars.TemplateDelegate
  private orderService: handlebars.TemplateDelegate

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
    this.forgotPasswordTemplate = this.loadTemplate('forgot_password.hbs')
    this.orderService = this.loadTemplate('order_service.hbs')
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
    const html = this.welcomeTemplate({
      name: user.name,
      password,
      url: process.env.URL,
    })
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

  @Process('sendUserRecoveryPasswordLink')
  async sendUserRecoveryPasswordLink(
    job: Job<{ user: any; recoveryPasswordLink: string }>,
  ) {
    const { user, recoveryPasswordLink } = job.data
    const html = this.forgotPasswordTemplate({
      name: user.name,
      recoveryPassword: recoveryPasswordLink,
    })

    try {
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Recuperação de senha',
        html: html,
      })
      console.log('Email recovery password successfully sent to ', user.email)
    } catch (error) {
      console.error(
        'Error recovery password sending email to ',
        user.email,
        ': ',
        error,
      )
      return false
    }
  }

  @Process('sendNewCreateOrderService')
  async sendNewCreateOrderService(job: Job<EmailOrderService>) {
    const createOrderService = job.data
    const html = this.orderService(createOrderService)

    try {
      if (createOrderService.applicant) {
        await this.transporter.sendMail({
          to: createOrderService.applicant,
          subject: `Nova Order de Serviço Número: ${createOrderService.order_number}`,
          html: html,
        })
        console.log(
          'Email new Order service applicant successfully sent to ',
          createOrderService.applicant,
        )
      }
      if (
        createOrderService.userEmail &&
        createOrderService.userEmail !== createOrderService.technicianEmail
      ) {
        await this.transporter.sendMail({
          to: createOrderService.userEmail,
          subject: `Nova Order de Serviço Número: ${createOrderService.order_number}`,
          html: html,
          attachments: createOrderService.images.map((r) => ({
            path: r,
          })),
        })
        console.log(
          'Email new Order service userEmail successfully sent to ',
          createOrderService.userEmail,
        )
      }
      if (createOrderService.technicianEmail) {
        await this.transporter.sendMail({
          to: createOrderService.technicianEmail,
          subject: `Nova Order de Serviço Número: ${createOrderService.order_number}`,
          html: html,
        })
        console.log(
          'Email new Order service technician successfully sent to ',
          createOrderService.technicianEmail,
        )
      }
    } catch (error) {
      console.error(
        'Error new Order service sending email to ',
        createOrderService.applicant,
        ': ',
        error,
      )
      return false
    }
  }

  @Process('sendUpdateOrderService')
  async sendNewUpdateOrderService(job: Job<EmailOrderService>) {
    const updateOrderService = job.data
    const html = this.orderService(updateOrderService)

    try {
      if (updateOrderService.applicant) {
        await this.transporter.sendMail({
          to: updateOrderService.applicant,
          subject: `${updateOrderService.type} Order de Serviço Número: ${updateOrderService.order_number}`,
          html: html,
          attachments: updateOrderService.images.map((r) => ({
            path: r,
          })),
        })
        console.log(
          'Email Update Order service applicant successfully sent to ',
          updateOrderService.applicant,
        )
      }
      if (
        updateOrderService.userEmail &&
        updateOrderService.userEmail !== updateOrderService.technicianEmail
      ) {
        await this.transporter.sendMail({
          to: updateOrderService.userEmail,
          subject: `${updateOrderService.type} Order de Serviço Número: ${updateOrderService.order_number}`,
          html: html,
          attachments: updateOrderService.images.map((r) => ({
            path: r,
          })),
        })
        console.log(
          'Email update Order service userEmail successfully sent to ',
          updateOrderService.userEmail,
        )
      }
      if (updateOrderService.technicianEmail) {
        await this.transporter.sendMail({
          to: updateOrderService.technicianEmail,
          subject: `${updateOrderService.type} Order de Serviço Número: ${updateOrderService.order_number}`,
          html: html,
          attachments: updateOrderService.images.map((r) => ({
            path: r,
          })),
        })
        console.log(
          'Email update Order service technician successfully sent to ',
          updateOrderService.technicianEmail,
        )
      }
    } catch (error) {
      console.error(
        'Error update Order service sending email to ',
        updateOrderService.applicant,
        ': ',
        error,
      )
      return false
    }
  }

  @Process('sendDeleteOrderService')
  async sendNewDeleteOrderService(job: Job<EmailOrderService>) {
    const deleteOrderService = job.data
    const html = this.orderService(deleteOrderService)

    try {
      if (deleteOrderService.applicant) {
        await this.transporter.sendMail({
          to: deleteOrderService.applicant,
          subject: `Order de Serviço Número: ${deleteOrderService.order_number} ${deleteOrderService.type}`,
          html: html,
        })
        console.log(
          'Email Delete Order service applicant successfully sent to ',
          deleteOrderService.applicant,
        )
      }
      if (
        deleteOrderService.userEmail &&
        deleteOrderService.userEmail !== deleteOrderService.technicianEmail
      ) {
        await this.transporter.sendMail({
          to: deleteOrderService.userEmail,
          subject: `Order de Serviço Número: ${deleteOrderService.order_number} ${deleteOrderService.type}`,
          html: html,
        })
        console.log(
          'Email Delete Order service userEmail successfully sent to ',
          deleteOrderService.userEmail,
        )
      }
      if (deleteOrderService.technicianEmail) {
        await this.transporter.sendMail({
          to: deleteOrderService.technicianEmail,
          subject: `Order de Serviço Número: ${deleteOrderService.order_number} ${deleteOrderService.type}`,
          html: html,
        })
        console.log(
          'Email Delete Order service technician successfully sent to ',
          deleteOrderService.technicianEmail,
        )
      }
    } catch (error) {
      console.error(
        'Error Delete Order service sending email to ',
        deleteOrderService.applicant,
        ': ',
        error,
      )
      return false
    }
  }

  // Other email sending methods...
}
