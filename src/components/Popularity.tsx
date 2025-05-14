import '../styles/Popularity.css';
import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend, LineElement, PointElement} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend, LineElement, PointElement);


function Popularity() {
  const [ratingBars, setRatingBars] = useState<Record<string, number>>({});
  const [watchedBars, setWatchedBars] = useState<Record<string, number>>({});
  const [genreBars, setGenreBars] = useState<Record<string, number>>({});
  const [airingBars, setAiringBars] = useState<Record<string, number>>({});


  useEffect(() => {
    fetch("http://localhost:4000/popularity")
      .then(res => res.json())
      .then(({rating, watched, genre, airing}) => {
        const ratingsObject: Record<string, number> = {};
        const watchedObject: Record<string, number> = {};

        rating.forEach((anime: { title: string; score: number }) => {
          ratingsObject[anime.title] = anime.score;
        });
        watched.forEach((anime: { title: string; members: number }) => {
          watchedObject[anime.title] = anime.members;
        });


        setRatingBars(ratingsObject);
        setWatchedBars(watchedObject);
        setGenreBars(genre);
        setAiringBars(airing);

      })
      .catch(error => console.error(error));
  }, []);

  const ratingLabels = Object.keys(ratingBars).slice(0,10);
  const ratingCounts = ratingLabels.map(title => ratingBars[title]);

  const ratingData = {
    labels: ratingLabels,
    datasets: [
      {
        label: 'Rating',
        data: ratingCounts,
        backgroundColor: 'rgba(115, 204, 77, 0.6)',  
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 2,
      },
    ],
  };

  const ratingOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 Anime',
        font: {
          size: 20,
          weight: 700,
        },
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  const watchedLabels = Object.keys(watchedBars).slice(0,10);
  const watchedCounts = watchedLabels.map(title => watchedBars[title]);

  const watchedData = {
    labels: watchedLabels,
    datasets: [
      {
        label: 'Members',
        data: watchedCounts,
        backgroundColor: 'rgba(115, 204, 77, 0.6)',  
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 2,
      },
    ],
  };

  const watchedOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 Anime Watched',
        font: {
          size: 20,
          weight: 700,
        },
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };
  
  const genreLabels = Object.keys(genreBars).slice(0,10);
  const genreCounts = genreLabels.map(genre => genreBars[genre]);

  const genreData = {
    labels: genreLabels,
    datasets: [
      {
        label: 'User Counts',
        data: genreCounts,
        backgroundColor: [
          'rgba(255, 99, 133, 0.48)',
          'rgba(54, 162, 235, 0.6)',   
          'rgba(255, 206, 86, 0.6)',
          'rgba(88, 255, 79, 0.6)',
          'rgba(255, 151, 86, 0.6)',
          'rgba(255, 86, 241, 0.6)',
          'rgba(86, 255, 207, 0.6)',
          'rgba(86, 92, 255, 0.6)',
          'rgba(255, 86, 86, 0.6)',
          'rgba(173, 86, 255, 0.6)',
        ],
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 1,
      },
    ],
  };
  
  const genreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 Anime Genres',
        font: {
          size: 20,
          weight: 700,
        },
        color: '#333',
      },
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
    },
  };

  const airingLabels = Object.keys(airingBars);
  const airingCounts = airingLabels.map(airing => airingBars[airing]);

  const airingData = {
    labels: airingLabels,
    datasets: [
      {
        label: 'Anime Counts',
        data: airingCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',  
        borderColor: 'rgba(54, 162, 235, 0.6)',
        fill: false,
        tension: 0.1
      },
    ],
  };

  const airingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Anime Airing Year Distribution',
        font: {
          size: 20,
          weight: 700,
        },
        color: '#333',
      },
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
    },
  };


  return (
  <div className="popularityPage-body">
      <div className= "popularityPage-header">
        <h2 className="popularityPage-title">Top Anime Insights</h2>
      </div>

      <div className="popularityPage-ratingGraph-container">
        <div className="popularityPage-ratingGraph">
          <Bar data={ratingData} options={ratingOptions} />
        </div>
      </div>

      <div className="popularityPage-airingGraph-container">
        <div className="popularityPage-airingGraph">
          <Line data={airingData} options={airingOptions} />
        </div>
      </div>

      <div className="popularityPage-genreGraph-container">
        <div className="popularityPage-genreGraph">
          <Pie data={genreData} options={genreOptions} />
        </div>
      </div>

      <div className="popularityPage-watchedGraph-container">
        <div className="popularityPage-watchedGraph">
          <Bar data={watchedData} options={watchedOptions} />
        </div>
      </div>
      
    </div>
  );
}

export default Popularity;