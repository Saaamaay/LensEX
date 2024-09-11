'use client';

import React, { useState, useEffect} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import TaxonomyEditModal from './TaxonomyEditModal';
import EntityListModal from './EntityListModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfWeek, addWeeks, format, eachDayOfInterval } from 'date-fns';
import VisualizationComponent from './VisualizationComponent';

const calculatePercentages = (data, view) => {
  console.log("Input data:", data);
  console.log("Current view:", view);

  const percentages = {};
  
  if (view === 'main') {
    Object.keys(data).forEach(key => {
      percentages[key] = (data[key].length / Object.keys(data).length * 100).toFixed(2);
    });
  } else if (data[view]) {
    const subtopics = data[view];
    if (Array.isArray(subtopics)) {
      const total = subtopics.length;
      subtopics.forEach(subtopic => {
        percentages[subtopic] = (100 / total).toFixed(2);
      });
    }
  }

  // Normalize percentages to ensure they sum up to 100
  const total = Object.values(percentages).reduce((sum, value) => sum + parseFloat(value), 0);
  Object.keys(percentages).forEach(key => {
    percentages[key] = ((parseFloat(percentages[key]) / total) * 100).toFixed(2);
  });

  console.log("Calculated percentages:", percentages);
  return percentages;
};

const EntityXLensUI = () => {
  const [selectedTaxonomy, setSelectedTaxonomy] = useState({});
  const [entityList, setEntityList] = useState([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState([]);
  const [spikeData, setSpikeData] = useState([]);
  const [taxonomyChartData, setTaxonomyChartData] = useState([]);
  const [currentView, setCurrentView] = useState('main');
  const [percentages, setPercentages] = useState({});

  const targetingOptions = [
    { name: 'TAXONOMY SEGMENTS', description: 'All Topic Entities' },
    { name: 'ENTITY LIST', description: 'All Topic Entities' },
  ];

  useEffect(() => {
    if (startDate && endDate) {
      setSpikeData(generateSpikeData(startDate, endDate, entityList));
    }
  }, [startDate, endDate, entityList]);

  const handleTaxonomySelect = (topics) => {
    console.log('Selected Taxonomy Topics:', topics);
    setSelectedTaxonomy(topics);
  };

  useEffect(() => {
    console.log('Updated selectedTaxonomy:', selectedTaxonomy);
  }, [selectedTaxonomy]);

  const handleEntityListSubmit = (entities) => {
    setEntityList(entities);
  };

  const handleGeneratePlan = () => {
    console.log('Generate Plan button clicked');
    setIsGeneratingPlan(true);
  
    setTimeout(() => {
      const newWeeklyData = generateWeeklyData(startDate, endDate);
      setWeeklyData(newWeeklyData);
      setIsGeneratingPlan(false);
      setShowResults(true);
      console.log('Plan generation completed, showResults:', showResults);
    }, 2000);
  };

  const inventoryPricingData = [
    { cpm: 0, percentage: 0 },
    { cpm: 0.62, percentage: 10 },
    { cpm: 1.24, percentage: 20 },
    { cpm: 1.85, percentage: 25 },
    { cpm: 2.47, percentage: 30 },
    { cpm: 3.09, percentage: 33 },
    { cpm: 3.71, percentage: 36 },
    { cpm: 4.32, percentage: 38 },
    { cpm: 4.94, percentage: 40 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow">
          <p className="label">{`Date: ${label}`}</p>
          <p className="value">{`Value: ${payload[0].value}`}</p>
          <p className="entity">{`Entity: ${payload[0].payload.entity}`}</p>
        </div>
      );
    }
    return null;
  };

  const generateWeeklyData = (startDate, endDate) => {
    let currentDate = startOfWeek(new Date(startDate));
    const lastDate = new Date(endDate);
    const data = [];
  
    while (currentDate <= lastDate) {
      data.push({
        week: format(currentDate, 'MMM d'),
        percentage: Math.floor(Math.random() * 100) // Replace with actual data
      });
      currentDate = addWeeks(currentDate, 1);
    }
  
    return data;
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

  const prepareTaxonomyPieChartData = (taxonomy) => {
    const data = Object.entries(taxonomy).map(([category, subCategories]) => ({
      name: category,
      value: subCategories.length
    }));
    setTaxonomyChartData(data);
  };

  useEffect(() => {
    prepareTaxonomyPieChartData(selectedTaxonomy);
  }, [selectedTaxonomy]);
  
  const renderSpikeDetection = () => (
    <div>
      <h4 className="font-semibold mb-2">Spike Detection</h4>
      <p className="text-sm text-gray-600 mb-2">Inventory scanner showing potential spikes</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={spikeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            interval={Math.floor(spikeData.length / 7)}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
  
      {/* Start new section for taxonomy distribution */}
      <h4 className="font-semibold mb-2">Selected Topics/Sub Topics:</h4>
      <div className="mt-4">
        <h5 className="font-medium mb-2">Taxonomy Distribution of Selected Entities</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taxonomyChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={(entry) => entry.name}
            >
              {taxonomyChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
              ))}
            </Pie>
            {Object.keys(selectedTaxonomy || {}).length === 0 && (
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                Please select taxonomy segments
              </text>
            )}
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
  
      {/* New Entity List Section */}
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Entity List:</h4>
        <ul className="list-decimal list-inside">
          {entityList.map((entity, index) => (
            <li key={index} className="text-sm">{entity}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderReach = () => (
    <div>
      <div>
        <h4 className="font-semibold mb-2">Supply Strategy</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Exchange</span>
            <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '100%'}}></div>
            </div>
            <span className="text-sm">926B imps</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Deals</span>
            <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
              <div className="bg-gray-400 h-2.5 rounded-full" style={{width: '92%'}}></div>
            </div>
            <span className="text-sm">856B imps</span>
          </div>
        </div>
      </div>
    </div>
  );
  

  const renderBrandVisualization = () => (
    <div className="flex space-x-4">
      <div className="w-1/2 border rounded-lg p-4">
        <h4 className="font-semibold mb-2">Brand Visualization</h4>
        <p className="text-sm text-gray-600 mb-2">Visual representation of brand distribution</p>
        <VisualizationComponent
          taxonomyData={selectedTaxonomy}
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
            const calculatedPercentages = calculatePercentages(selectedTaxonomy, view);
            setPercentages(calculatedPercentages);
          }}
        />
        {currentView !== 'main' && (
          <Button onClick={() => {
            setCurrentView('main');
            const calculatedPercentages = calculatePercentages(selectedTaxonomy, 'main');
            setPercentages(calculatedPercentages);
          }} className="mt-4">
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
  );

  useEffect(() => {
    if (Object.keys(selectedTaxonomy).length > 0) {
      const calculatedPercentages = calculatePercentages(selectedTaxonomy, currentView);
      setPercentages(calculatedPercentages);
    }
  }, [selectedTaxonomy, currentView]);

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-bold text-red-500">EntityX Lens</h1>
        <div className="flex space-x-4">
          <Button variant="ghost">Planning</Button>
        </div>
        <div className="flex space-x-4 items-center">
          <Button variant="ghost" className="p-2">
            {/* Search Icon */}
          </Button>
          <Button variant="ghost" className="p-2"></Button>
          <Button variant="ghost" className="p-2">
            {/* Notification Icon */}
          </Button>
          <Button variant="ghost" className="p-2">
            {/* User Icon */}
          </Button>
          <span className="text-sm text-gray-500"> Test Curator</span>
        </div>
      </header>

      <h2 className="text-xl font-semibold mb-4">Create a New Plan</h2>

      <div className="flex">
        <Card className="w-1/3 mr-4">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Plan Setup and Targeting</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Name*</label>
                <Input placeholder="Give your plan a name" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Dates</label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd/MM/yyyy"
                      className="w-full pl-3 pr-8 py-2 border rounded-md"
                    />
                    <Button
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
                      onClick={() => {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </Button>
                  </div>
                  <span className="flex items-center">-</span>
                  <div className="relative flex-1">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      dateFormat="dd/MM/yyyy"
                      className="w-full pl-3 pr-8 py-2 border rounded-md"
                    />
                    <Button
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1"
                      onClick={() => {}}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
              {targetingOptions.map((item) => (
                <div key={item.name} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  {item.name === 'TAXONOMY SEGMENTS' ? (
                    <TaxonomyEditModal onSelect={handleTaxonomySelect} />
                  ) : item.name === 'ENTITY LIST' ? (
                    <EntityListModal onSubmit={handleEntityListSubmit} />
                  ) : (
                    <Button variant="ghost" size="sm" className="text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                      </svg>
                      Edit
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleGeneratePlan}>
              Generate Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="w-2/3">
          <CardContent>
            {isGeneratingPlan ? (
              <div className="flex flex-col justify-center items-center h-64 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-blue-500 mb-4">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <p>Generating plan...</p>
              </div>
            ) : showResults ? (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <Tabs defaultValue="brand">
                  <TabsList className="mb-4">
                    <TabsTrigger value="brand">Brand</TabsTrigger>
                    <TabsTrigger value="reach">Reach</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  <TabsContent value="brand">
                    {renderBrandVisualization()}
                  </TabsContent>
                  <TabsContent value="reach">
                    {renderReach()}
                  </TabsContent>
                  <TabsContent value="insights">
                    {renderSpikeDetection()}
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            ) : (
              <div className="flex flex-col justify-center items-center h-64 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-4">
                  <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
                  <path d="M12 10v4"/><path d="M8 10v4"/><path d="M16 10v4"/>
                </svg>
                <p>
                Build out your plan on the left, then click "Generate Plan" to view insights about this plan
                </p>
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntityXLensUI;