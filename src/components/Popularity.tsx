import '../styles/Popularity.css';
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend);


function Popularity() {
  const [ratingBars, setRatingBars] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("http://localhost:4000/anime-popularity")
      .then(res => res.json())
      .then(({rating}) => {
        const ratingsObject: Record<string, number> = {};
        rating.forEach((anime: { title: string; score: number }) => {
          ratingsObject[anime.title] = anime.score;
        });
        setRatingBars(ratingsObject);
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
          
        </div>
    );
}

export default Popularity;