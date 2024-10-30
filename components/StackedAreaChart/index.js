import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StackedAreaChart = ({ data }) => {
    const dataStackedArea = {
        labels: ['2019', '2020', '2021', '2022'],
        datasets: [
            {
                label: 'February',
                data: [200, 300, 400, 500],
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                borderColor: 'rgba(255, 159, 64, 1)',
                fill: true,
            },
            {
                label: 'March',
                data: [150, 250, 300, 450],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: true,
            },
            {
                label: 'April',
                data: [100, 200, 250, 350],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: true,
            },
        ],
    };






    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Total Salary',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Years',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Total',
                },
            },
        },
    };

    return <Line data={dataStackedArea} options={options} />;
};

export default StackedAreaChart;
