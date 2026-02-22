import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not configured. Email NOT sent.');
        console.log(`To: ${to}\nSubject: ${subject}\nBody: ${html}`);
        return { success: false, error: 'API Key missing' };
    }

    try {
        const recipients = Array.isArray(to) ? to : [to];

        // Remove duplicates and invalid emails
        const uniqueRecipients = [...new Set(recipients)].filter(e => e && e.includes('@'));

        if (uniqueRecipients.length === 0) {
            return { success: false, error: 'No valid recipients' };
        }

        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Log Monitor <alerts@resend.dev>',
            to: uniqueRecipients,
            subject,
            html,
        });

        if (data.error) {
            console.error('❌ Resend Error:', data.error);
            return { success: false, error: data.error.message };
        }

        console.log(`✅ Email sent successfully to ${uniqueRecipients.join(', ')}`);
        return { success: true, data };
    } catch (error: any) {
        console.error('❌ Failed to send email via Resend:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}
