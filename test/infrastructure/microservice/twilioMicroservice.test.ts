import { TwilioMicroservice } from '../../../src/modules/infrastructure/microservices/twillio.microservice';
import dotenv from 'dotenv';
import { Twilio } from 'twilio';

dotenv.config();
jest.mock('twilio');

describe('TwilioMicroservice', () => {
	let microservice: TwilioMicroservice;
	let twilioClientMock: jest.Mocked<Twilio>;
	let createMock: jest.Mock;

	beforeEach(() => {
		twilioClientMock = {
			messages: {
				create: jest.fn(),
			},
		} as unknown as jest.Mocked<Twilio>;

		createMock = twilioClientMock.messages.create as jest.Mock;
		microservice = new TwilioMicroservice();
		(microservice as any).twilioClient = twilioClientMock;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('sendSms', () => {
		test('should send an SMS successfully', async () => {
			createMock.mockResolvedValue({});

			await microservice.sendSms('Test SMS');

			expect(createMock).toHaveBeenCalledWith({
				body: 'Test SMS',
				from: process.env.TWILIO_PHONE_NUMBER,
				to: process.env.TWILIO_DESTINATION_PHONE_NUMBER,
			});
		});

		test('should handle send SMS failure', async () => {
			const errorMessage = 'Send SMS failed';
			createMock.mockRejectedValue(new Error(errorMessage));

			await expect(microservice.sendSms('Test SMS')).rejects.toThrow(new Error('Send SMS failed'));
		});
	});
});
