const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  try {
    const { error } = await supabase
      .from('subscribers')
      .insert([{ name, email, signup_date: new Date().toISOString(), status: 'pending' }]);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err.code === '23505') {
      // codice errore per chiave unica duplicata
      return res.status(400).json({ error: 'Email già registrata' });
    }
    return res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};
