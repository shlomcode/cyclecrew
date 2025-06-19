const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xmgyewszenkqyozwzgzu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZ3lld3N6ZW5rcXlvend6Z3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTAyNDgsImV4cCI6MjA2NTQ4NjI0OH0.eoIXhGfNn00NEFemQ4J2XcSUvCErDtjc58AWgGJzxgQ'
);

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
      .insert([
        {
          name,
          email,
          signup_date: new Date().toISOString(),
          status: 'pending',
        },
      ]);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};
