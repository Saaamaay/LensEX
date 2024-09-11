import React from 'react';

const AssociationGraph = ({ entityName }) => {
  // This is a placeholder. In a real implementation, you would:
  // 1. Fetch association data for the entity
  // 2. Use a graph visualization library to render the data
  // 3. Not seen Johns graph thing yet
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-lg font-semibold mb-2">Association Graph for {entityName}</p>
        <p className="text-sm text-gray-600">
          This graph would show connections between {entityName} and related entities.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Connections might represent co-occurrences, shared attributes, or other relationships.
        </p>
      </div>
    </div>
  );
};

export default AssociationGraph;