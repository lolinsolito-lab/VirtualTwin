import { resend, SYSTEM_EMAIL, FOUNDER_EMAIL } from '@/lib/resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { name, email, source } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // 1. Send Welcome Email to the Applicant
        await resend.emails.send({
            from: SYSTEM_EMAIL,
            to: email,
            subject: 'Benvenuto nell\'Elite: Il Tuo Clone AI ti aspetta 🥂',
            html: `
        <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 20px;">
          <h1 style="font-style: italic; font-weight: normal; font-size: 28px; margin-bottom: 24px;">Ciao ${name},</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a;">
            La tua candidatura per il <strong>Beta Founder Program</strong> di VirtualTwin è stata ricevuta con successo.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a;">
            Stiamo selezionando solo 10 professionisti per questa fase, e il tuo profilo sembra perfettamente in linea con la nostra visione d'elite.
          </p>
          <div style="background-color: #fdfaf5; padding: 24px; border-radius: 12px; margin: 32px 0;">
            <p style="margin: 0; font-weight: bold; color: #c5a059;">Prossimi Step:</p>
            <ul style="padding-left: 20px; margin-top: 10px; color: #4a4a4a;">
              <li>Analizzerò la tua richiesta entro le prossime 24 ore.</li>
              <li>Riceverai un link per fissare la nostra call di setup 1:1.</li>
              <li>Attiveremo il tuo Clone Pioneer (valore €97/mese) GRATUITAMENTE.</li>
            </ul>
          </div>
          <p style="font-size: 14px; color: #999;">
            A presto,<br>
            <strong>Michael @ VirtualTwin</strong>
          </p>
        </div>
      `
        });

        // 2. Notify Michael (Admin)
        await resend.emails.send({
            from: SYSTEM_EMAIL,
            to: FOUNDER_EMAIL,
            subject: `🚀 NUOVA CANDIDATURA BETA: ${name}`,
            html: `
        <h2>Nuovo Lead da ${source || 'Beta Page'}</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
        <hr />
        <p><a href="https://virtualtwin.vercel.app/dashboard/leads">Vedi nella Dashboard</a></p>
      `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email API Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
