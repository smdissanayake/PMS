import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const PatientVisitsChart = () => {
    const [chartData, setChartData] = useState({
        series: [{
            name: 'Patient Visits',
            data: []
        }],
        options: {
            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: false
                }
            },
            stroke: {
                curve: 'smooth',
                width: 2
            },
            xaxis: {
                categories: [],
                labels: {
                    style: {
                        colors: '#666'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#666'
                    }
                }
            },
            colors: ['#4287f5'],
            grid: {
                borderColor: '#f1f1f1'
            },
            tooltip: {
                theme: 'light'
            }
        }
    });

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const response = await axios.get('/api/patient-notes/today');
            const visits = response.data.visits;
            
            // Group visits by hour
            const visitsByHour = Array(24).fill(0);
            visits.forEach((visit: any) => {
                const hour = new Date(visit.created_at).getHours();
                visitsByHour[hour]++;
            });

            // Update chart data
            setChartData(prev => ({
                ...prev,
                series: [{
                    name: 'Patient Visits',
                    data: visitsByHour
                }],
                options: {
                    ...prev.options,
                    xaxis: {
                        ...prev.options.xaxis,
                        categories: Array.from({length: 24}, (_, i) => `${i}:00`)
                    }
                }
            }));
        } catch (error) {
            console.error('Error fetching chart data:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Patient Visits</h3>
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
            />
        </div>
    );
};

export default PatientVisitsChart; 