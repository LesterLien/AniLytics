import '../styles/Production.css';
import { useEffect, useState } from "react";
import { Bar, Pie} from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, Legend);


function Production() {
    const [sourceBars, setSourceBars] = useState<Record<string, number>>({});


    useEffect(() => {
    fetch("http://localhost:4000/production")
        .then(res => res.json())
        .then(({source}) => {

            setSourceBars(source);
        })
        .catch(error => console.error(error));
    }, []);

    const sourceLabels = Object.keys(sourceBars);
    const sourceCounts = sourceLabels.map(source => sourceBars[source]);

    const sourceData = {
        labels: sourceLabels,
        datasets: [
        {
            label: 'User Counts',
            data: sourceCounts,
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
            ],
            borderColor: 'rgba(80, 77, 77, 0.6)',
            borderWidth: 1,
        },
        ],
    };
    
    const sourceOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        title: {
            display: true,
            text: 'Source Distribution',
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

    <div className="productionPage-body">
        <div className= "productionPage-header">
            <h2 className="productionPage-title"> Production & Licensing </h2>
        </div>
        
        <div className="productionPage-sourceGraph-container">
            <div className="productionPage-sourceGraph">
                <Pie data={sourceData} options={sourceOptions} />
            </div>
        </div>
    </div>
    );
}

export default Production;