import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
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

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Errore registrazione:', err.message);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
}
