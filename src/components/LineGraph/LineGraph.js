import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { lineGraphServices } from './LineGraph.services'
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, chart) {
                return numeral(tooltipItem.value).format('+0, 0')
            }
        }
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll',
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: true,
                },
                ticks: {
                    // Include a $ sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format('0a');
                    },
                }
            },
        ],

    }
}

function LineGraph({ casesType = 'cases'}) {

    const [data, setData] = useState({})
    useEffect(() => {
        const fetchHistoricalData = async () => {
            const result = await lineGraphServices.getHistoricalData()
            if (result && result.status === 200) {
                const chartData = buildChartData(result.data, casesType);
                setData(chartData)
            }
        }
        fetchHistoricalData();
    }, [casesType])
    
    const buildChartData = (data, casesType = 'cases') => {
        let chartData = [];
        let lastDataPoint;
        // data[casesType] && data[casesType].forEach(date => {
        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date];
        };
        return chartData;
    }


    return (
        <div className='app__graph'>
            { data?.length > 0 && <Line
                options={options}
                data={{
                    datasets: [
                        {
                            backgroundColor: casesType === 'recovered'?'rgba(125, 215, 29, 0.5)': 'rgba(204, 16, 52, 0.5)',
                            borderColor: casesType === 'recovered'?'#7DD71D':'#CC1034',
                            data: data
                        }
                    ]
                }}
            />}
            {/* <h1>I am a graph</h1> */}
        </div>
    )
}

export default LineGraph
