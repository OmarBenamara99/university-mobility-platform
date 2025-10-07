import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailserviceService {

  constructor() { }

  sendEmail(emailParams: any): Promise<EmailJSResponseStatus> {
    return emailjs.send('service_xoaqjz8', 'template_fkd3low', emailParams, '7S_AspFFH7df88VCo')
      .then((response: EmailJSResponseStatus) => {
        console.log('Email sent:', response);
        return response;
      }, (error) => {
        console.error('Error sending email:', error);
        throw error;
      });
  }
}
