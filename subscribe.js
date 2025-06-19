const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Dati mancanti' });

  try {
    // Inserimento in Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([{ name, email, signup_date: new Date(), status: 'pending' }]);

    if (error) throw error;

    // Invio email con SendGrid
    await sgMail.send({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Benvenuto in CycleCrew!',
      html: `<h2>Ciao ${name}, grazie per la registrazione a CycleCrew 🚴</h2>`
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};
