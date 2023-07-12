export interface ITwilioMicroservice {
	sendSms(body: string): Promise<void>;
}
