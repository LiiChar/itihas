import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const emailTransporter = () => {
	return nodemailer.createTransport({
		host: 'smtp.gmail.com',
		auth: {
			type: 'login',
			user: `${process.env.MAILER_USER}`,
			pass: `${process.env.MAILER_PASS}`,
		},
	});
};

export const sendEmail = async (
	email: string,
	content: string,
	transporter?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
) => {
	let transport = transporter ?? emailTransporter();
	const mailOptions = {
		from: process.env.MAILER_USER,
		to: email,
		subject: 'Подтвердите свою почту',
		text: '',
		html: `${content}`,
	};
	try {
		await transport.sendMail(mailOptions);
	} catch (error) {
		if (
			error &&
			typeof error == 'object' &&
			'response' in error &&
			typeof error.response == 'string'
		) {
			throw new Error(error.response);
		}
	}
};
