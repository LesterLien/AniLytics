import express from 'express';
import { createClient } from '@supabase/supabase-js';
require('dotenv').config();

const app = express();
const port = 4000;

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);


app.get('/test-supabase', async (req, res) => {
  const { data, error } = await supabase
    .from('anime') 
    .select('*')
    .limit(1);

  if (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Connected to Supabase!', data });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
