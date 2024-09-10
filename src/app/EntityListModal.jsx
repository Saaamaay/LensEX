import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const EntityListModal = ({ onSubmit }) => {
  const [entityList, setEntityList] = useState('');

  const handleSubmit = () => {
    const entities = entityList.split('\n').filter(entity => entity.trim() !== '');
    onSubmit(entities);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/ >
          </svg>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[50vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Enter Entity List</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <Textarea
              value={entityList}
              onChange={(e) => setEntityList(e.target.value)}
              placeholder="Enter entities, one per line"
              className="h-full resize-none"
            />
          </ScrollArea>
        </div>
        <div className="flex-shrink-0 pt-4 border-t mt-auto">
          <Button onClick={handleSubmit} className="w-full">Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntityListModal;