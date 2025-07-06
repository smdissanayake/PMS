import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { Loader2 } from 'lucide-react';

const PatientCategoryChart = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'pie',
                height: 350
            },
            labels: [],
            colors: ['#4287f5', '#42f5a4', '#f542a4', '#f5a442', '#a442f5'],
            legend: {
                position: 'bottom',
                labels: {
                    colors: '#666'
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            tooltip: {
                y: {
                    formatter: function(value: number) {
                        return value + ' patients';
                    }
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '0%'
                    }
                }
            }
        }
    });

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/patient-categories');
            const categories = response.data;

            if (!categories || categories.length === 0) {
                setError('No category data available');
                return;
            }

            setChartData(prev => ({
                ...prev,
                series: categories.map((cat: any) => cat.count),
                options: {
                    ...prev.options,
                    labels: categories.map((cat: any) => cat.category || 'Uncategorized')
                }
            }));
        } catch (error) {
            console.error('Error fetching category data:', error);
            setError('Failed to load category data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 flex justify-center items-center h-[350px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Categories</h3>
                <div className="text-center text-red-500 p-4">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Categories</h3>
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="pie"
                height={350}
            />
        </div>
    );
};

export default PatientCategoryChart; 