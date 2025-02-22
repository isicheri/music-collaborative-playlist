import { BadRequestException, Injectable } from "@nestjs/common";
import sgmail from "@sendgrid/mail";



//still setting up the sendgrid api properly
@Injectable()
export class SendGridService {
  private sgmail: sgmail.MailService;

    async sendMail(data: {reciever: string,code: string}) {
        this.sgmail.setApiKey("")
      const msg = {
        to: data.reciever,
        from: 'ciarakah6@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        html: `<h1>Yout login code</h1>
          <p>${data.code}</p>
        `,
      }
      await this.sgmail.send(msg).catch((error) => {
        console.log(error);
        throw new BadRequestException("somethin went wrong")
      })
    }

}