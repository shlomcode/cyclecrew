const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');
const supabase = createClient(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZ3lld3N6ZW5rcXlvend6Z3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTAyNDgsImV4cCI6MjA2NTQ4NjI0OH0.eoIXhGfNn00NEFemQ4J2XcSUvCErDtjc58AWgGJzxgQ);
sgMail.setApiKey('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');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo non consentito' });

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  try {
    // Inserimento nel database Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([
        {
          name,
          email,
          signup_date: new Date().toISOString(),
          status: 'pending'
        }
      ]);

    if (error) throw error;

    // Invio email tramite SendGrid
    await sgMail.send({
      to: email,
      from: 'noreply@cyclecrew.it', // o un indirizzo SendGrid verificato
      subject: 'Benvenuto in CycleCrew!',
      html: `<h2>Ciao ${name},</h2><p>Grazie per esserti registrato a <strong>CycleCrew</strong> 🚴</p>`
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Errore durante la registrazione:', err.message);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};
