import { ITwilioMicroservice } from '../../domain/microservices/twilio.microservice';
import { Twilio } from 'twilio';

export class TwilioMicroservice implements ITwilioMicroservice {
	private twilioClient: Twilio;

	constructor() {
		this.twilioClient = new Twilio(
			process.env.TWILIO_ACCOUNT_SID as string,
			process.env.TWILIO_AUTH_TOKEN as string,
		);
	}

	async sendSms(body: string) {
		await this.twilioClient.messages.create({
			body,
			from: process.env.TWILIO_PHONE_NUMBER as string,
			to: process.env.TWILIO_DESTINATION_PHONE_NUMBER as string,
		});
	}
}
