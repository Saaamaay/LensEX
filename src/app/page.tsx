/// Add in a pie chart that has the selected topics on. Then a second pie chart view that breaks the pie chart down by subtopic too. 
//// change graph text to spike detection
///// add edit box for entitys. just a text box when each new line is a numbered bullet point

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


const EntityXLensUI = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedTaxonomy, setSelectedTaxonomy] = useState({});
  const [entityList, setEntityList] = useState([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState([]);
  const [spikeData, setSpikeData] = useState([]);
  const [taxonomyChartData, setTaxonomyChartData] = useState([]);




  

  

  const targetingOptions = [
    { name: 'GEOGRAPHY', description: 'Any geography' },
    { name: 'TAXONOMY SEGMENTS', description: 'All Topic Entities' },
    { name: 'DEVICE TYPE', description: 'Any device type' },
    { name: 'INVENTORY LIST', description: 'Any inventory list' },
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
  
  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6 border-b pb-2">
        <h1 className="text-2xl font-bold text-red-500">EntityX Lens</h1>
        <div className="flex space-x-4">
          <Button variant="ghost">Audiences</Button>
          <Button variant="ghost">Report</Button>
          <Button variant="ghost">Admin</Button>
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
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="setup" className="flex-1">Setup</TabsTrigger>
                <TabsTrigger value="targeting" className="flex-1">Targeting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="setup">
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
                        onClick={() => {}} // The DatePicker will handle opening on click
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
                        onClick={() => {}} // The DatePicker will handle opening on click
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      </Button>
                    </div>
                  </div>
                </div>
                </div>
              </TabsContent>

              <TabsContent value="targeting">
                <div className="space-y-4">
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
              </TabsContent>
            </Tabs>
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
                <div className="space-y-6">
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
                  </div>
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
                  <div>
                    <h4 className="font-semibold mb-2">Geography</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>London</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '100%'}}></div>
                        </div>
                        <span className="text-sm">574B imps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>New York</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '59%'}}></div>
                        </div>
                        <span className="text-sm">339B imps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Milan</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '58%'}}></div>
                        </div>
                        <span className="text-sm">333B imps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Paris</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-400 h-2.5 rounded-full" style={{width: '6%'}}></div>
                        </div>
                        <span className="text-sm">346M imps</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
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
                    {Object.keys(selectedTaxonomy).length === 0 && (
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                        Please select taxonomy segments
                      </text>
                    )}
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Entity List:</h4>
              <ul className="list-decimal list-inside">
                {entityList.map((entity, index) => (
                  <li key={index} className="text-sm">{entity}</li>
                ))}
              </ul>
            </div>
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