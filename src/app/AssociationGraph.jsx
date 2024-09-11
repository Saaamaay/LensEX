import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes'; // Make sure to install next-themes package

const Graph = dynamic(() => import('react-graph-vis').then(mod => mod.default), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const AssociationGraph = ({ entityName }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = mounted && currentTheme === 'dark';

  // Updated graph data with more nodes and edges
  const graph = {
    nodes: [
      { id: 1, label: 'news', color: '#8bc34a' },
      { id: 2, label: 'milk', color: '#03a9f4' },
      { id: 3, label: 'coffee', color: '#795548' },
      { id: 4, label: 'technology', color: '#ff5722' },
      { id: 5, label: 'sports', color: '#ffc107' },
      { id: 6, label: 'music', color: '#9c27b0' },
      { id: 7, label: 'movies', color: '#e91e63' },
      { id: 8, label: 'books', color: '#4caf50' },
      { id: 9, label: 'travel', color: '#00bcd4' },
      { id: 10, label: 'food', color: '#ff9800' },
      { id: 11, label: 'fashion', color: '#9e9e9e' },
      { id: 12, label: 'health', color: '#f44336' },
      { id: 13, label: 'education', color: '#3f51b5' },
      { id: 14, label: 'science', color: '#009688' },
      { id: 15, label: 'politics', color: '#673ab7' },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 10 },
      { from: 3, to: 10 },
      { from: 4, to: 7 },
      { from: 4, to: 13 },
      { from: 4, to: 14 },
      { from: 5, to: 12 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 13 },
      { from: 9, to: 10 },
      { from: 10, to: 12 },
      { from: 11, to: 12 },
      { from: 13, to: 14 },
      { from: 14, to: 15 },
      { from: 15, to: 1 },
    ]
  };

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: isDarkMode ? "#FFFFFF" : "#000000"
    },
    nodes: {
      shape: 'box',
      font: {
        size: 16,
        color: isDarkMode ? '#ffffff' : '#000000'
      },
      borderWidth: 2,
      shadow: true
    },
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -2000,
        springConstant: 0.001,
        springLength: 200
      }
    },
    height: '600px',
    background: isDarkMode ? '#000000' : '#ffffff'
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
      console.log("Selected nodes:");
      console.log(nodes);
      console.log("Selected edges:");
      console.log(edges);
    }
  };

  if (!mounted) return null;

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <Graph
        graph={graph}
        options={options}
        events={events}
      />
    </div>
  );
};

export default AssociationGraph;