import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const VisualizationComponent = ({ taxonomyData, currentView, setCurrentView }) => {
  const svgRef = useRef(null);

  const drawVisualization = () => {
    const width = 400; // Reduced from 500
    const height = 500;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = currentView === 'main' 
      ? Object.keys(taxonomyData).map(key => ({ name: key, value: taxonomyData[key].length }))
      : Array.isArray(taxonomyData[currentView])
        ? taxonomyData[currentView].map(item => ({ 
            name: item, // Changed from 'key' to 'item'
            value: Math.floor(Math.random() * 10) + 1 
          }))
        : [];

    if (data.length === 0) {
      return;
    }

    // More aggressive size adjustment
    const maxSize = Math.min(60, 300 / Math.sqrt(data.length));
    const minSize = Math.max(5, maxSize / 4);

    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.value)])
      .range([minSize, maxSize]);

    const padding = 10;
    const simulation = d3.forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(-200)) // Increased strength
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => sizeScale(d.value) + 2)) // Added padding
      .force("x", d3.forceX(width / 2).strength(0.1)) // Increased strength
      .force("y", d3.forceY(height / 2).strength(0.1)) // Increased strength
      .force("boundary", function() {
        for (let i = 0; i < data.length; i++) {
          const d = data[i];
          const r = sizeScale(d.value);
          d.x = Math.max(r, Math.min(width - r, d.x));
          d.y = Math.max(r, Math.min(height - r, d.y));
        }
      });

    const nodes = svg.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", d => `translate(${width/2},${height/2})`);

    nodes.append("circle")
      .attr("r", d => sizeScale(d.value))
      .attr("fill", "red")
      .attr("opacity", 0.7);

    const wrapText = (text, width) => {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

    nodes.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .text(d => d.name)
      .style("font-size", d => `${Math.min(sizeScale(d.value) / 2.5, 12)}px`) // Reduced max font size
      .call(wrapText, d => sizeScale(d.value) * 1.8);

    nodes.on("click", (event, d) => {
      if (currentView === 'main') {
        setCurrentView(d.name);
      } else {
        setCurrentView('main');
      }
    });

    simulation.on("tick", () => {
      nodes.attr("transform", d => {
        d.x = Math.max(sizeScale(d.value), Math.min(width - sizeScale(d.value), d.x));
        d.y = Math.max(sizeScale(d.value), Math.min(height - sizeScale(d.value), d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    svg.attr("viewBox", [0, 0, width, height]);
  };

  useEffect(() => {
    drawVisualization();
  }, [taxonomyData, currentView]);

  return <svg ref={svgRef} width="400" height="500"></svg>; // Adjusted width
};

export default VisualizationComponent;