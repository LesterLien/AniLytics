import '../styles/Activity.css';
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend, LineElement, PointElement, BarElement, LogarithmicScale} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend, LineElement, PointElement, BarElement, LogarithmicScale);

function Activity() {
    const [joinDateBars, setJoinDateBars] = useState<Record<string, number>>({});
    const [daysSpentWatchingBars, setDaysSpentWatchingBars] = useState<Record<string, number>>({});
    const [averageRatingBars, setAverageRatingBars] = useState<Record<string, number>>({});


    useEffect(() => {
        fetch("http://localhost:4000/activity")
        .then(res => res.json())
        .then(({joinDate, daysSpentWatching, averageRating}) => {

            setJoinDateBars(joinDate);
            setDaysSpentWatchingBars(daysSpentWatching);
            setAverageRatingBars(averageRating);
        })
        .catch(error => console.error(error));
    },[]);

    const getStartNumber = (label: string): number => {
        if (label.includes('+')) {
            return Number(label.replace('+', ''));
        }

        return Number(label.split('-')[0]);
    };

    const sortGroupedLabels = (labels: string[]): string[] => {
        return labels.sort((a, b) => getStartNumber(a) - getStartNumber(b));
    };

    const sortedDaysSpentWatchingLabels = sortGroupedLabels(Object.keys(daysSpentWatchingBars));
    const sortedAverageRatingLabels = sortGroupedLabels(Object.keys(averageRatingBars)); 

    const averageRatingCounts = sortedAverageRatingLabels.map(ratingRange => averageRatingBars[ratingRange]);
    const averageRatingData = {
        labels: sortedAverageRatingLabels,
        datasets: [
        {
            label: 'User Counts',
            data: averageRatingCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',  
            borderColor: 'rgba(80, 77, 77, 0.6)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        },
        ],
    };

    const averageRatingOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        title: {
            display: true,
            text: 'User Average Rating',
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

    const daysSpentWatchingCounts = sortedDaysSpentWatchingLabels.map(dayRange => daysSpentWatchingBars[dayRange]);
    const daysSpentWatchingData = {
        labels: sortedDaysSpentWatchingLabels,
        datasets: [
        {
            label: 'User Counts',
            data: daysSpentWatchingCounts,
            backgroundColor: 'rgba(115, 204, 77, 0.6)',  
            borderColor: 'rgba(80, 77, 77, 0.6)',
            borderWidth: 2,
        },
        ],
    };
    const daysSpentWatchingOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
        y: {
            beginAtZero: true,
            type: 'logarithmic' as const,
            ticks: {
            callback: function (tickValue: string | number) {
                return tickValue.toString();
            },
            },
        },
        },
        plugins: {
        title: {
            display: true,        
            text: 'Days Spent Watching Anime Distribution',
            font: {
            size: 20,             
            weight: 700,       
            },
            color: '#333',
        },
        tooltip: {
            enabled: true,
            callbacks: {
            label: function (info: any) {
                const label = info.dataset.label;
                const amount = info.raw;
                return `${label}: ${amount} users`;
            },
            },
        },
        },
    };

    const joinDateLabels = Object.keys(joinDateBars);
    const joinedDateCounts = joinDateLabels.map(year => joinDateBars[year]);

    const joinedDateData = {
        labels: joinDateLabels,
        datasets: [
        {
            label: 'User Counts',
            data: joinedDateCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',  
            borderColor: 'rgba(80, 77, 77, 0.6)',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        },
        ],
    };

    const joinedDateOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        title: {
            display: true,
            text: 'User Growth Over Time',
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
        <div className="activityPage-body">
            <div className= "activityPage-header">
                <h2 className="activityPage-title">User Engagement Trends</h2>
            </div>

            <div className="activityPage-daysSpentWatchingGraph-container">
                <div className="activityPage-daysSpentWatchingGraph">
                    <Bar data={daysSpentWatchingData} options={daysSpentWatchingOptions} />
                </div>
            </div>

            <div className="activityPage-joinedDateGraph-container">
                <div className="activityPage-joinedDateGraph">
                <Line data={joinedDateData} options={joinedDateOptions} />
                </div>
            </div>

            <div className="activityPage-averageRatingGraph-container">
                <div className="activityPage-averageRatingGraph">
                <Line data={averageRatingData} options={averageRatingOptions} />
                </div>
            </div>
       </div>
    );
}

export default Activity;