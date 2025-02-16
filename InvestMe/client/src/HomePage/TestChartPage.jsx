import React from 'react';
import Chart from 'react-apexcharts';
import mockData from './mockData.json'; // Adjust the path if needed

function TestChartPage() {
  // Transform the mock data into the series format for a candlestick chart.
  const series = [
    {
      data: mockData.t.map((timestamp, index) => ({
        x: new Date(timestamp * 1000), // Convert seconds to a JavaScript Date
        y: [
          mockData.o[index],
          mockData.h[index],
          mockData.l[index],
          mockData.c[index]
        ]
      }))
    }
  ];

  // Chart configuration options for a candlestick chart.
  const options = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'Test Candlestick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Test Chart Page</h1>
      <Chart options={options} series={series} type="candlestick" height={350} />
    </div>
  );
}

export default TestChartPage;
