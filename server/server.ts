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

  if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
  }

  if(!users) {
      return res.status(500).json({error: 'User data is empty'});
  }

  const currentDay = new Date();
  
  const user_birthdays: Record<string, number> = {};

  users
    .filter((user: { birth_date: string | null }) => user.birth_date !== null)
    .forEach((user: { birth_date: string }) => {
        const user_birth_date = new Date(user.birth_date);
        
        let age = currentDay.getFullYear() - user_birth_date.getFullYear();
        const month = currentDay.getMonth() - user_birth_date.getMonth();


        if (month < 0 || (month === 0 && currentDay.getDate() < user_birth_date.getDate())) {
            age--;
        }

        const ageLabel = Math.floor(age / 2) * 2;
        const ageRangeLabel = `${ageLabel}-${ageLabel + 1}`;

        if (user_birthdays[ageRangeLabel]) {
          user_birthdays[ageRangeLabel]++;
        } else {
          user_birthdays[ageRangeLabel] = 1;
        }
    });
  res.json(user_birthdays);
});

app.get('/user-gender', async (req, res) => {
  let { data: users, error } = await supabase
        .from('users')
        .select('gender');
      
  if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
  }

  if(!users) {
      return res.status(500).json({error: 'User data is empty'});
  }

  const user_genders: Record<string, number> = {};

  users
    .filter((user: { gender: string | null }) => user.gender !== null)
    .forEach((user: { gender: string }) => {
      const gender = user.gender;
      if (gender) {
        user_genders[gender] = (user_genders[gender] || 0) + 1; 
      }
  });
  res.json(user_genders);
});

app.get('/user-location', async (req, res) => {
  let { data: users, error } = await supabase
        .from('users')
        .select('location');
      
  if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
  }

  if(!users) {
      return res.status(500).json({error: 'User data is empty'});
  }

  const user_locations: Record<string, number> = {};

  users
    .filter((user: { location: string | null }) => user.location !== null)
    .forEach((user: { location: string }) => {
      const location = user.location;
      if (location) {
        user_locations[location] = (user_locations[location] || 0) + 1; 
      } 
  });
  const locationCounts = Object.entries(user_locations)
    .sort((a, b) => b[1] - a[1]); 

  const sortedLocationCounts  = Object.fromEntries(locationCounts);

  res.json(sortedLocationCounts);
})




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
