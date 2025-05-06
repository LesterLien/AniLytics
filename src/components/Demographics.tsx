import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Title, ArcElement, Legend } from "chart.js";
import '../styles/Demographics.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, LogarithmicScale, Tooltip, Title, ArcElement, Legend);

function Demographics() {
  const [ageBars, setAgeBars] = useState<Record<string, number>>({});
  const [genderBars, setGenderBars] = useState<Record<string, number>>({});
  const [locationBars, setLocationBars] = useState<Record<string, number>>({});

    useEffect(() => {
    fetch("http://localhost:4000/user-demographics")
      .then(res => res.json())
      .then(({age, gender, location}) => {
        setAgeBars(age);
        setGenderBars(gender);
        setLocationBars(location);
      })
      .catch(error => console.error(error));
  }, []);

  const sortedAgeLabels = Object.keys(ageBars).sort((labelA, labelB) => {  //compares two keys (age ranges) from the ageBars object
    const [startAgeA] = labelA.split('-').map(Number);  //splits the labelA (ex: "10-11") into an array of strings (ex: ["10", "11"]), then converts to numbers using map; grabs the first element (start age)
    const [startAgeB] = labelB.split('-').map(Number);  //same as above but for labelB
    return startAgeA - startAgeB; //compares the start ages: negative means labelA is smaller, positive means labelB is smaller, 0 means they are equal
  });

  const ageCounts = sortedAgeLabels.map(ageRange => ageBars[ageRange]);
  const ageData = {
    labels: sortedAgeLabels,
    datasets: [
      {
        label: 'User Counts',
        data: ageCounts,
        backgroundColor: 'rgba(115, 204, 77, 0.6)',  
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 2,
      },
    ],
  };
  const ageOptions = {
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
          size: 20,             
          weight: 700,       
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

  const genderLabels = Object.keys(genderBars);
  const genderCounts = genderLabels.map(gender => genderBars[gender]);

  const genderData = {
    labels: genderLabels,
    datasets: [
      {
        label: 'User Counts',
        data: genderCounts,
        backgroundColor: [
          'rgba(255, 99, 133, 0.48)',
          'rgba(54, 162, 235, 0.6)',   
          'rgba(255, 206, 86, 0.6)',  
        ],
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 1,
      },
    ],
  };
  
  const genderOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Gender Distribution',
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

  const locationLabels = Object.keys(locationBars).slice(0,20);
  const locationCounts = locationLabels.map(location => locationBars[location]);

  const locationData = {
    labels: locationLabels,
    datasets: [
      {
        label: 'User Counts',
        data: locationCounts,
        backgroundColor: 'rgba(115, 204, 77, 0.6)',  
        borderColor: 'rgba(80, 77, 77, 0.6)',
        borderWidth: 2,
      },
    ],
  };

  const locationOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Top Locations',
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
    <div className="demographicsPage-body">
      <div className= "demographicsPage-header">
        <h2 className="demographicsPage-title">User Demographics</h2>
      </div>
      <div className="demographicsPage-ageGraph-container">
        <div className="demographicsPage-ageGraph">
          <Bar data={ageData} options={ageOptions} />
        </div>
      </div>

      <div className="demographicsPage-genderGraph-container">
        <div className="demographicsPage-genderGraph">
          <Pie data={genderData} options={genderOptions} />
        </div>
      </div>

      <div className="demographicsPage-locationGraph-container">
        <div className="demographicsPage-locationGraph">
          <Bar data={locationData} options={locationOptions} />
        </div>
      </div>

    </div>
  );
}

export default Demographics;
