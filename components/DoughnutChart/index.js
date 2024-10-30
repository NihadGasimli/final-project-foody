import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Dataset',
                data: data.values,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#FFCD56', '#4B77BE', '#C0392B', '#E74C3C',
                    '#8E44AD', '#9B59B6', '#2980B9', '#3498DB', '#2ECC71',
                    '#27AE60', '#F39C12', '#F1C40F', '#D35400', '#E67E22'
                ],
            },
        ],
    };

    return (
        <div>
            <Doughnut data={chartData} />
        </div>
    );
};

export default DoughnutChart;
