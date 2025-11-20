import {Resend} from 'resend'
import 'dotenv/config';

 


export const resendClient= new Resend('re_f1KKxoWo_LhXiREVsidJa75y54Q3zpSoG') 


export const sender = {
  email:process.env.EMAIL_FROM,
  name: process.env.EMAIL_FROM_NAME,
};