const PORT = 4000;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { Pool } = require('pg');


app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


app.get('/user-age', async (req, res) => {
  try {
    const result = await pool.query('SELECT birth_date FROM users');
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    const currentDay = new Date();
    const user_birthdays = {};

    users
      .filter(user => user.birth_date !== null)
      .forEach(user => {
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
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/user-gender', async (req, res) => {
  try {
    const result = await pool.query('SELECT gender FROM users');
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    const user_genders = {};

    users
      .filter(user => user.gender !== null)
      .forEach(user => {
        const gender = user.gender;
        if (gender) {
          user_genders[gender] = (user_genders[gender] || 0) + 1;
        }
      });

    res.json(user_genders);
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/user-location', async (req, res) => {
  try {
    const result = await pool.query('SELECT location FROM users');
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    const user_locations: Record<string, number> = {};

    users
      .filter(user => user.location !== null)
      .forEach(user => {
        const location = user.location;
        if (location) {
          user_locations[location] = (user_locations[location] || 0) + 1;
        }
      });

    const locationCounts = Object.entries(user_locations) as [string, number][];
    const sortedLocationCounts = Object.fromEntries(
      locationCounts.sort((a, b) => b[1] - a[1])
    );

    res.json(sortedLocationCounts);
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});



app.get('/user-time', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_days_spent_watching FROM users');
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    let totalTime = 0;

    users
      .filter(user => user.user_days_spent_watching !== null)
      .forEach(user => {
        const time = parseFloat(user.user_days_spent_watching);
        totalTime += time;
      });

    const userCount = users.length;
    const avgTimePerUser = userCount > 0 ? totalTime / userCount : 0;

    res.json(avgTimePerUser);
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/user-animeStatus', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT user_watching, user_completed, user_onhold, user_dropped, user_plantowatch 
      FROM users
    `);
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    let total = {
      watching: 0,
      completed: 0,
      onhold: 0,
      dropped: 0,
      plantowatch: 0
    };

    users.forEach(user => {
      total.watching += parseInt(user.user_watching) || 0;
      total.completed += parseInt(user.user_completed) || 0;
      total.onhold += parseInt(user.user_onhold) || 0;
      total.dropped += parseInt(user.user_dropped) || 0;
      total.plantowatch += parseInt(user.user_plantowatch) || 0;
    });

    const userCount = users.length;
    const averages = {
      watching: total.watching / userCount,
      completed: total.completed / userCount,
      onhold: total.onhold / userCount,
      dropped: total.dropped / userCount,
      plantowatch: total.plantowatch / userCount
    };

    res.json({ total, averages });
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/anime', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM anime');
    const anime = result.rows;
    res.json(anime);
  } catch (error) {
    console.error('Error fetching anime data:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const users = result.rows.map(user => ({
      ...user,
      birth_date: user.birth_date?.toISOString().split('T')[0],
      join_date: user.join_date?.toISOString().split('T')[0],
      last_online: user.last_online?.toISOString().split('T')[0]
    }));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users data:', error.message);
    return res.status(500).json({ error: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
