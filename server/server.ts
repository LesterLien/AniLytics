import { createClient } from '@supabase/supabase-js';
const PORT = 4000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);


app.get('/user-age', async (req, res) => {
    let { data: users, error } = await supabase
        .from('users')
        .select('birth_date');

    if (error || !users) {
        console.error('Supabase error:', error?.message);
        return res.status(500).json({ error: error?.message });
    }


    res.json(users);
});




app.get('/anime', async (req, res) => {
    let { data: anime, error } = await supabase
        .from('anime')
        .select('*');

  if (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(anime);
});

app.get('/users', async (req, res) => {
    let { data: users, error } = await supabase
        .from('users')
        .select('*')
    
    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  
    res.json(users);
  });



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
