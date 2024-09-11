import React from 'react';
import AssociationGraph from './AssociationGraph';

const AssociationTab = () => {
  // You might want to get the entityName from a context or prop
  const entityName = "Example Entity";

  return (
    <div className="w-full h-[400px]">
      <div className="border rounded-lg p-4 w-full h-full flex flex-col">
        <h3 className="text-2xl font-semibold mb-4">Association Graph</h3>
        <div className="flex-grow">
          <AssociationGraph entityName={entityName} />
        </div>
      </div>
    </div>
  );
};

export default AssociationTab;