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

app.get('/demographics', async (req, res) => {
  try {
    const result = await pool.query('SELECT birth_date, gender, location FROM users');
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    const currentDay = new Date();
    const ageData = {};
    const genderData = {};
    const locationData = {};

    users.forEach(user => {
      if (user.birth_date) {
        const birthDate = new Date(user.birth_date);
        let age = currentDay.getFullYear() - birthDate.getFullYear();
        const month = currentDay.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && currentDay.getDate() < birthDate.getDate())) {
          age--;
        }
        const label = `${Math.floor(age / 2) * 2}-${Math.floor(age / 2) * 2 + 1}`;
        ageData[label] = (ageData[label] || 0) + 1;
      }

      if(user.gender) {
        genderData[user.gender] = (genderData[user.gender] || 0) + 1;
      }

      if(user.location) {
        locationData[user.location] = (locationData[user.location] || 0) + 1;
      }
    });

    const sortedLocation = Object.fromEntries(
      Object.entries(locationData as Record<string, number>).sort(
        (a, b) => b[1] - a[1]
      )
    );
    res.json({ age: ageData, gender: genderData, location: sortedLocation });
    
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/popularity', async (req, res) => {
  try {
    const ratingResult = await pool.query(
      `SELECT rank, title, scored_by, score
       FROM anime 
       WHERE rank IS NOT NULL AND scored_by >= 100000 
       ORDER BY rank ASC 
       LIMIT 10`
    );

    const watchedResult = await pool.query(
      `SELECT members, title
       FROM anime 
       WHERE members IS NOT NULL
       ORDER BY members DESC
       LIMIT 10`
    );

    const genreAiringResult = await pool.query(
      `SELECT genre, aired_from_year
       FROM anime`
    );


    const rating = ratingResult.rows;
    const watched = watchedResult.rows;
    const genre_airing = genreAiringResult.rows;

    const genreData = {};
    const airingData = {};


    const ratingData = rating.map(anime => ({
      title: anime.title,
      score: anime.score,
    }));

    const watchedData = watched.map(anime => ({
      title: anime.title,
      members: anime.members,
    }));


    genre_airing.forEach(anime => {
      if (anime.genre) {
        anime.genre.split(',').forEach(genres => {
          const genre = genres.trim();
          genreData[genre] = (genreData[genre] || 0) + 1;
        });
      }

      if (anime.aired_from_year !== null) {
        const year = anime.aired_from_year.toString();
        airingData[year] = (airingData[year] || 0) + 1;
      }

    });

    const sortedGenre = Object.fromEntries(
      Object.entries(genreData as Record<string, number>).sort(
        (a, b) => b[1] - a[1]
      )
    );

    res.json({ rating: ratingData, watched: watchedData, genre: sortedGenre, airing: airingData});

  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT user_watching, user_completed, user_onhold, user_dropped, user_plantowatch
      FROM users
    `);
    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    let status = {
      watching: 0,
      completed: 0,
      onhold: 0,
      dropped: 0,
      plantowatch: 0
    };


    users.forEach(user => {
      status.watching += parseInt(user.user_watching) || 0;
      status.completed += parseInt(user.user_completed) || 0;
      status.onhold += parseInt(user.user_onhold) || 0;
      status.dropped += parseInt(user.user_dropped) || 0;
      status.plantowatch += parseInt(user.user_plantowatch) || 0;
    });

    const totalStatus = status.watching + status.completed + status.onhold + status.dropped + status.plantowatch;


    const percentageStatus = {
      "Watching": (status.watching / totalStatus)*100,
      "Completed": (status.completed / totalStatus)*100,
      "On Hold": (status.onhold / totalStatus)*100,
      "Dropped": (status.dropped / totalStatus)*100,
      "Plan To Watch": (status.plantowatch / totalStatus)*100
    };


    res.json({ status: percentageStatus});
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/activity', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT join_date, user_days_spent_watching, stats_mean_score 
      FROM users
    `);

    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    const joinData = {};
    const daysSpentData = {};
    const averageRatingData = {};
    

    const daysSpentGrouped = [
      { label: '0-5', min: 0, max: 5 },
      { label: '6-15', min: 6, max: 15 },
      { label: '16-30', min: 16, max: 30 },
      { label: '31-50', min: 31, max: 50 },
      { label: '51-75', min: 51, max: 75 },
      { label: '76-100', min: 76, max: 100 },
      { label: '101-200', min: 101, max: 200 },
      { label: '201-400', min: 201, max: 400 },
      { label: '401+', min: 401, max: Infinity }, 
    ];

    const averageRatingGrouped = [
      { label: '0-1', min: 0.0, max: 0.99 },
      { label: '1-2', min: 1.0, max: 1.99 },
      { label: '2-3', min: 2.0, max: 2.99 },
      { label: '3-4', min: 3.0, max: 3.99 },
      { label: '4-5', min: 4.0, max: 4.99 },
      { label: '5-6', min: 5.0, max: 5.99 },
      { label: '6-6.5', min: 6.0, max: 6.49 },
      { label: '6.5-7', min: 6.5, max: 6.99 },
      { label: '7-7.5', min: 7.0, max: 7.49 },
      { label: '7.5-8', min: 7.5, max: 7.99 },
      { label: '8-8.5', min: 8.0, max: 8.49 },
      { label: '8.5-9', min: 8.5, max: 8.99 },
      { label: '9-9.5', min: 9.0, max: 9.49 },
      { label: '9.5-10', min: 9.5, max: 9.99 },
      { label: '10', min: 10.0, max: 10.0 },
    ];


    const getRange = (value: number, groups: { label: string, min: number, max: number }[]): string => {
      for (let i = 0; i < groups.length; i++) {
        if (value >= groups[i].min && value <= groups[i].max) {
          return groups[i].label;
        }
      }
    return 'Out of Range';
    };


    users.forEach(user => {
      const joinDate = new Date(user.join_date);
      joinData[joinDate.getFullYear()] = (joinData[joinDate.getFullYear()] || 0) + 1;

      const daysSpentLabel = getRange(user.user_days_spent_watching, daysSpentGrouped);
      daysSpentData[daysSpentLabel] = (daysSpentData[daysSpentLabel] || 0) + 1;

      const averageRatingLabel = getRange(user.stats_mean_score, averageRatingGrouped);
      averageRatingData[averageRatingLabel] = (averageRatingData[averageRatingLabel] || 0) + 1;
    });


    res.json({joinDate: joinData, daysSpentWatching: daysSpentData, averageRating: averageRatingData });
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/production', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT source
      FROM anime
    `);

    const users = result.rows;

    if (!users || users.length === 0) {
      return res.status(500).json({ error: 'User data is empty' });
    }

    const sourceData = {};
    const sourceList = new Set([
      'Manga',
      'Original',
      'Light novel',
      'Visual novel',
      '4-koma manga',
      'Novel',
      'Game',
      'Web manga',
      'Other'
    ]);

    users.forEach(user => {
      const sources = sourceList.has(user.source) ? user.source : 'Other';
      sourceData[sources] = (sourceData[sources] || 0) + 1;
    });


    res.json({source: sourceData})

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
