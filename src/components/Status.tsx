import '../styles/Status.css';
import { useEffect, useState } from "react";
import { Pie} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, Tooltip, Title, ArcElement, Legend} from "chart.js";
import type { TooltipItem } from 'chart.js';

ChartJS.register(CategoryScale, Tooltip, Title, ArcElement, Legend);

function Status() {
    const [statusBars, setStatusBars] = useState<Record<string, number>>({});
    useEffect(() => {
        fetch("http://localhost:4000/user-animeStatus")
        .then(res => res.json())
        .then(({status}) => {

            setStatusBars(status);
        })
        .catch(error => console.error(error));
    },[]);

    const statusLabels = Object.keys(statusBars);
    const statusCounts = statusLabels.map(status => statusBars[status]);

    const statusData = {
        labels: statusLabels,
        datasets: [
        {
            label: 'User Counts Percentage',
            data: statusCounts,
            backgroundColor: [
            'rgba(255, 99, 133, 0.48)',
            'rgba(54, 162, 235, 0.6)',   
            'rgba(255, 206, 86, 0.6)',
            'rgba(88, 255, 79, 0.6)',
            'rgba(255, 151, 86, 0.6)',
            ],
            borderColor: 'rgba(80, 77, 77, 0.6)',
            borderWidth: 1,
        },
        ],
    };
  
    const statusOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Anime Status Distribution',
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
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'pie'>) => {
                        const label =  context.label;
                        const value = context.parsed.toFixed(2);
                        return `${label}: ${value}%`;
                    }
                }
            }
        },
    };


    return (
    <div className="statusPage-body">
        <div className= "statusPage-header">
            <h2 className="statusPage-title">User Completion Trends</h2>
        </div>

        <div className="statusPage-statusGraph-container">
            <div className="statusPage-statusGraph">
            <Pie data={statusData} options={statusOptions} />
            </div>
        </div>
    </div>
    );
}

export default Status;