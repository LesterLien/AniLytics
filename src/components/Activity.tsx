import '../styles/Activity.css';
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend, LineElement, PointElement} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend, LineElement, PointElement);

function Activity() {
        const [joinDateBars, setjoinDateBars] = useState<Record<string, number>>({});
    useEffect(() => {
        fetch("http://localhost:4000/user-activity")
        .then(res => res.json())
        .then(({joinDate}) => {

            setjoinDateBars(joinDate);
        })
        .catch(error => console.error(error));
    },[]);

    const joinDateLabels = Object.keys(joinDateBars);
    const joinedDateCounts = joinDateLabels.map(year => joinDateBars[year]);

    const joinedDateData = {
        labels: joinDateLabels,
        datasets: [
        {
            label: 'User Counts',
            data: joinedDateCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',  
            borderColor: 'rgba(54, 162, 235, 0.6)',
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
            <div className="activityPage-joinedDateGraph-container">
                <div className="activityPage-joinedDateGraph">
                <Line data={joinedDateData} options={joinedDateOptions} />
                </div>
            </div>
       </div>
    );
}

export default Activity;