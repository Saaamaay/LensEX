import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaxonomyEditModal, { taxonomyData as importedTaxonomyData } from './TaxonomyEditModal';
import AssociationGraph from './AssociationGraph';
import EntityInputComponent from '@/components/EntityInputComponent';
import DateEntitySelectionComponent from '@/components/DateEntitySelectionComponent';
import VisualizationComponent from '@/components/VisualizationComponent';
import InsightsComponent from '@/components/InsightsComponent';
import ScaleAndReachComponent from '@/components/ScaleAndReachComponent';
import { startOfWeek, addWeeks, format, eachDayOfInterval } from 'date-fns';

const calculatePercentages = (data, view) => {
  const percentages = {};

  if (view === 'main') {
    // Main view: calculate percentages based on top-level categories
    const totalItems = Object.keys(data).length;

    if (totalItems === 0) {
      return {};
    }

    Object.keys(data).forEach(key => {
      percentages[key] = (Math.random() * 100 / totalItems).toFixed(2);
    });

  } else if (data[view]) {
    // Subcategory view: randomize percentages for subtopics within the selected category
    const subtopics = data[view];
    const totalItems = subtopics.length;

    if (totalItems === 0) {
      return {};
    }

    let remainingPercentage = 100;
    const minPercentage = 1; // Minimum percentage for each subtopic

    subtopics.forEach((subtopic, index) => {
      let percentage;
      if (index === totalItems - 1) {
        // Assign remaining percentage to the last subtopic
        percentage = remainingPercentage;
      } else {
        // Ensure each subtopic gets at least the minimum percentage
        const maxPercentage = remainingPercentage - (totalItems - index - 1) * minPercentage;
        percentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
        remainingPercentage -= percentage;
      }
      percentages[subtopic] = percentage.toFixed(2);
    });
  } else {
    // If there's an issue with the data structure
    return {};
  }

  return percentages;
};

const PlanningComponent = () => {
  const [entityName, setEntityName] = useState('');
  const [taxonomyData, setTaxonomyData] = useState({});
  const [percentages, setPercentages] = useState({});
  const [currentView, setCurrentView] = useState('main');
  const [viewMode, setViewMode] = useState('distribution');
  const [spikeData, setSpikeData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [taxonomyChartData, setTaxonomyChartData] = useState([]);
  const [selectionData, setSelectionData] = useState(null);

  const handleTaxonomyUpdate = (newTaxonomy) => {
    setTaxonomyData(newTaxonomy);
  };

  useEffect(() => {
    setTaxonomyData(importedTaxonomyData);
  }, []);
  
  useEffect(() => {
    if (Object.keys(taxonomyData).length > 0) {
      const calculatedPercentages = calculatePercentages(taxonomyData, currentView);
      setPercentages(calculatedPercentages);
    }
  }, [taxonomyData, currentView]);

  useEffect(() => {
    if (Object.keys(taxonomyData).length > 0 && entityName) {
      const calculatedPercentages = calculatePercentages(taxonomyData, currentView);
      setPercentages(calculatedPercentages);
    }
  }, [taxonomyData, currentView, entityName]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleEntitySubmit = (name) => {
    setEntityName(name);
  };

  const handleSelectionSubmit = (data) => {
    setSelectionData(data);
    const newSpikeData = generateSpikeData(data.startDate, data.endDate, data.selectedEntities);
    setSpikeData(newSpikeData);
    const newWeeklyData = generateWeeklyData(data.startDate, data.endDate);
    setWeeklyData(newWeeklyData);
  };

  const generateSpikeData = (startDate, endDate, entityList) => {
    const dateRange = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
    return dateRange.map(date => {
      const baseValue = Math.floor(Math.random() * 5) + 1;
      const spike = Math.random() < 0.1 ? Math.floor(Math.random() * 10) + 5 : 0;
      return {
        date: format(date, 'MMM dd'),
        value: baseValue + spike,
        entity: entityList[Math.floor(Math.random() * entityList.length)]
      };
    });
  };

  const generateWeeklyData = (startDate, endDate) => {
    let currentDate = startOfWeek(new Date(startDate));
    const lastDate = new Date(endDate);
    const data = [];

    while (currentDate <= lastDate) {
      data.push({
        week: format(currentDate, 'MMM d'),
        percentage: Math.floor(Math.random() * 100)
      });
      currentDate = addWeeks(currentDate, 1);
    }

    return data;
  };

  if (!entityName) {
    return <EntityInputComponent onEntitySubmit={handleEntitySubmit} />;
  }

  if (!selectionData) {
    return <DateEntitySelectionComponent onSelectionSubmit={handleSelectionSubmit} />;
  }

  return (
    <Card className="w-full h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Brand Analysis</h2>
          <TaxonomyEditModal onSelect={handleTaxonomyUpdate} />
        </div>
        <div className="bg-gray-100 p-2 rounded mb-4">
          {entityName} Articles
        </div>
        <div className="flex space-x-4 mb-4">
          <Button 
            onClick={() => setViewMode('distribution')}
            className={`
              px-4 py-2 rounded-md transition-colors duration-200
              ${viewMode === 'distribution' 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            Brand Distribution
          </Button>
          <Button 
            onClick={() => setViewMode('association')}
            className={`
              px-4 py-2 rounded-md transition-colors duration-200
              ${viewMode === 'association' 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            Brand Association
          </Button>
          <Button 
            onClick={() => setViewMode('insights')}
            className={`
              px-4 py-2 rounded-md transition-colors duration-200
              ${viewMode === 'insights' 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            Insights
          </Button>
          <Button 
            onClick={() => setViewMode('scale-and-reach')}
            className={`
              px-4 py-2 rounded-md transition-colors duration-200
              ${viewMode === 'scale-and-reach' 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            Scale and Reach
          </Button>
        </div>
        {viewMode === 'distribution' ? (
          <div className="flex space-x-4">
            <div className="w-1/2 border rounded-lg p-4">
              {taxonomyData && Object.keys(taxonomyData).length > 0 ? (
                <VisualizationComponent 
                  taxonomyData={taxonomyData} 
                  currentView={currentView} 
                  setCurrentView={setCurrentView} 
                />
              ) : (
                <p>Loading visualization...</p>
              )}
              {currentView !== 'main' && (
                <Button onClick={() => setCurrentView('main')} className="mt-4">
                  Back to Main View
                </Button>
              )}
            </div>
            <div className="w-1/2 border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Brand Distribution</h3>
              <h4 className="text-lg font-bold">{currentView === 'main' ? 'Overview' : currentView}</h4>
              <p className="text-sm text-gray-500 mb-4">
                This view organizes articles related to {currentView === 'main' ? 'various categories' : currentView} by the sample into themes, with each theme representing a percentage of the total article views.
              </p>
              {Object.keys(percentages).length > 0 ? (
                <ul>
                  {Object.entries(percentages).map(([topic, percentage]) => (
                    <li key={topic} className="flex justify-between items-center mb-2">
                      <span>{topic}</span>
                      <span className="bg-gray-300 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold">
                        {percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No data available.</p>
              )}
            </div>
          </div>
        ) : viewMode === 'association' ? (
          <div className="w-full h-[400px]">
            <div className="border rounded-lg p-4 w-full h-full flex flex-col">
              <h3 className="text-2xl font-semibold mb-4">Association Graph</h3>
              <div className="flex-grow">
                <AssociationGraph entityName={entityName} />
              </div>
            </div>
          </div>
        ) : viewMode === 'insights' ? (
          <InsightsComponent spikeData={spikeData} weeklyData={weeklyData} />
        ) : viewMode === 'scale-and-reach' ? (
          <ScaleAndReachComponent taxonomyChartData={taxonomyChartData} />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PlanningComponent;