import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

function SetsPerMonth() {
  const chartRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState("2016");


  useEffect(() => {
    // Read the CSV file
    d3.csv(process.env.REACT_APP_G_STORAGE_URL).then(data => {
      // Format the data
      data.forEach(d => {
        d.event_date = +d.event_date; // Convert the string to a number
      });

      // Filter the data based on the selected year
      const filteredData = selectedYear
        ? data.filter(d => d.year === selectedYear)
        : data;

      // Set up the chart dimensions
      const width = 800;
      const height = 600;
      const margin = { top: 60, right: 20, bottom: 30, left: 40 };


      // Create the x-scale
      const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.month))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      // Create the y-scale
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.event_date)])
        .range([height - margin.bottom, margin.top]);

      // Create the x-axis
      const xAxis = d3.axisBottom(xScale);

      // Create the y-axis
      const yAxis = d3.axisLeft(yScale);



      // Create the chart
      const svg = d3.select(chartRef.current);

      // Add chart title
      svg.append('text')
          .attr('x', width / 2)
          .attr('y', margin.top / 2)
          .attr('text-anchor', 'middle')
          .attr('font-size', '16px')
          .text('Number of sets per month');

      svg.selectAll('rect')
        .data(filteredData)
        .join('rect')
        .attr('x', d => xScale(d.month))
        .attr('y', d => yScale(d.event_date))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d.event_date))
        .attr('fill', 'steelblue');

      // Append x-axis to the chart
      svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

      // Append y-axis to the chart
      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);
    });
  }, [selectedYear]);

  const handleYearChange = event => {
    setSelectedYear(event.target.value);
  };

  return (
      <div>
      <h1>CSV Bar Chart</h1>
      <div>
        <label htmlFor="year-slider">Select Year: </label>
        <input
          type="range"
          id="year-slider"
          min="2015"
          max="2022"
          step="1"
          value={selectedYear || ''}
          onChange={handleYearChange}
        />
        <span>{selectedYear}</span>

      </div>
      <svg ref={chartRef} width="800" height="600"></svg>
    </div>
  );
}


export default SetsPerMonth;


