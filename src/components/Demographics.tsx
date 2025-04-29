import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Title } from "chart.js";
import '../styles/Demographics.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Title);

function Demographics() {
  const [ageBars, setAgeBars] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('http://localhost:4000/user-age')
      .then(res => res.json())
      .then(data => setAgeBars(data))
      .catch(error => console.error(error));
  }, []);

  const sortedAgeLabels = Object.keys(ageBars).sort((labelA, labelB) => {  //compares two keys (age ranges) from the ageBars object
    const [startAgeA] = labelA.split('-').map(Number);  //splits the labelA (ex: "10-11") into an array of strings (ex: ["10", "11"]), then converts to numbers using map; grabs the first element (start age)
    const [startAgeB] = labelB.split('-').map(Number);  //same as above but for labelB
    return startAgeA - startAgeB; //compares the start ages: negative means labelA is smaller, positive means labelB is smaller, 0 means they are equal
  });

  const ageCounts = sortedAgeLabels.map(ageRange => ageBars[ageRange]);

  const data = {
    labels: sortedAgeLabels,
    datasets: [
      {
        label: 'User Ages',
        data: ageCounts,
        backgroundColor: 'rgba(77, 155, 204, 0.6)',  
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
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
        text: 'Age Distribution',
        font: {
          size: 24,             
          weight: 700,       
        },
        padding: {
          top: 10,
          bottom: 20,
        },
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
  
  

  return (
    <div className="demographicsPage-body">
      <div className= "demographicsPage-header">
        <h2 className="demographicsPage-title">User Demographics</h2>
      </div>
      <div className="demographicsPage-ageGraph-container">
        <div className="demographicsPage-ageGraph">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Demographics;
