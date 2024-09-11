'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

const ITEMS_PER_PAGE = 10;

const taxonomyData = {
  "Art & Entertainment": [
    "Pop (music)", "Dance & Electronic (music)", "Rap & HipHop (music)", "Country (music)",
    "Classical (music)", "Folk & Traditional (music)", "Jazz (music)", "Metal (music)",
    "Celebrities & Entertainment News", "Action & Adventure Films", "Comedy Films", "Drama Films",
    "Family Films", "Horror Films", "Romance Films", "Science Fiction & Fantasy Films",
    "DJ Resources & Equipment", "Musical Instruments", "Broadway & Musical Theater",
    "TV Comedies", "TV Documentary & Nonfiction", "TV Dramas", "TV Family-Oriented Shows",
    "TV Game Shows", "TV Reality Shows", "TV Sci-Fi & Fantasy Shows", "TV Talk Shows",
    "Poetry", "Audiobooks", "Comics and Graphic Novels", "Digital Art",
    "Children's Literature", "Literary Classics", "Magazines"
  ],
  "Business": ["Business Operations", "Marketing"],
  "Finance": ["Personal Finance", "Business Finance"],
  "Computers & Electronics": ["Consumer Electronics", "Software", "Hardware"],
  "Fashion & Beauty (Shopping)": [
    "Beauty Services & Spas", "Cosmetology & Beauty Professionals", "Face & Body Care (Bath & Body Products)",
    "Make-Up & Cosmetics", "Perfumes & Fragrances", "Skin & Nail Care", "Hair Care",
    "Children's Clothing", "Designer Clothing", "Men's Accessories", "Men's Jewelry and Watches",
    "Men's Fashion & Clothing", "Sportswear", "Shoes and Footwear", "Oral Hygiene",
    "Street Style", "Sneakers", "Women's Fashion & Clothing", "Women's Accessories",
    "Women's Handbags and Wallets", "Women's Jewelry and Watches"
  ],
  "Fine Art & Design": [
    "Classical Visual Art", "Design", "Fine art Photography", "Architecture",
    "Dance", "Opera", "Theater", "Modern Visual Art"
  ],
  "Fitness & Wellness": [
    "Fitness Equipment & Accessories", "Fitness Instruction & Personal Training",
    "Gyms & Health Clubs", "High Intensity Interval Training (HIIT)",
    "Yoga & Pilates", "Physical Therapy", "Holistic Health", "Health"
  ],
  "Food & Drink": [
    "Restaurants (Dining)", "Cooking", "Beverages", "Wine & Spirits", "Desserts"
  ],
  "Hobbies & Leisure": [
    "Esports", "Tabletop Games", "Toys", "Video Games", "Card Games",
    "Board Games", "Art & Crafts", "Outdoor Non-Water Activities", 
    "Gardening", "Outdoor Water Activites", "Collecting", "Content Production",
    "Games and Puzzles", "Genealogy and Ancestry", "Musical Instruments"
  ],
  "People & Relationships": [
    "Family", "Parenting", "Charity & Philanthropy", "Dating",
    "Eldercare", "Special Needs Children", "Marriage"
  ],
  "Personal Celebrations & Life Events": [
    "Baby Shower", "Bachelor Party", "Bachelorette Party", "Pregnancy",
    "Birthday", "Funeral & Death", "Graduation", "Prom", "Wedding", "Divorce"
  ],
  "Religion & Spirituality": [
    "Astrology", "Atheism", "Buddhism", "Christianity", "Hinduism",
    "Islam", "Judaism", "Sikhism"
  ],
  "Sports": [
    "Athletics", "Australian Football", "Badminton", "Baseball", "Basketball",
    "Beach Volleyball", "Boxing", "Cricket", "Cycling", "Darts", "Esports",
    "Fishing", "Football", "Motor Sports/Formula 1", "Gaelic Games", "Golf",
    "Greyhounds", "Handball", "Hockey", "Horse Racing", "Ice Hockey",
    "Combat Sports", "Motor Sports", "Netball", "Pool", "Snooker", "Rowing",
    "Rugby", "Skateboarding", "Snowboarding", "Surfing", "Tennis", "Volleyball",
    "Water Sports", "Winter Sports"
  ],
  "Travel & Transportation": [
    "Honeymoons and Getaways", "Africa Travel", "Business Travel", "Family Travel",
    "Eco Travel", "Asia Travel", "Australia and Oceania Travel", "Europe Travel",
    "North America Travel", "Polar Travel", "South America Travel", "Camping",
    "Air Travel", "Car Rentals", "Cruises & Charters", "Hotels & Accommodation",
    "Bus & Rail", "Luggage & Travel Accessories", "Luxury Travel",
    "Mountain & Ski Resorts", "Travel Agencies & Services"
  ]
};

const TaxonomySelector = ({ onSelect }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectAll, setSelectAll] = useState(false);

const handleSelectAll = () => {
  if (selectAll) {
    setSelectedItems({});
    onSelect([]);
  } else {
    const allItems = {};
    Object.keys(taxonomyData).forEach(category => {
      allItems[category] = [...taxonomyData[category]];
    });
    setSelectedItems(allItems);
    onSelect(Object.keys(allItems)); // Pass the main categories
  }
  setSelectAll(!selectAll);
};

  const handleSelect = (category, subCategory = null) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (subCategory) {
        if (!newItems[category]) newItems[category] = [];
        if (newItems[category].includes(subCategory)) {
          newItems[category] = newItems[category].filter(item => item !== subCategory);
        } else {
          newItems[category].push(subCategory);
        }
      } else {
        if (newItems[category]) {
          delete newItems[category];
        } else {
          newItems[category] = taxonomyData[category];
        }
      }
      onSelect(newItems);
      return newItems;
    });
  };

  const renderCategories = () => {
    const categories = Object.keys(taxonomyData);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const paginatedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <div className="space-y-2">
        {paginatedCategories.map(category => (
          <div key={category} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={category}
              checked={!!selectedItems[category]}
              onCheckedChange={() => handleSelect(category)}
            />
            <label htmlFor={category} className="text-sm font-medium leading-none cursor-pointer flex-grow">
              {category}
            </label>
            <Button variant="ghost" size="sm" onClick={() => setCurrentCategory(category)}>
              &gt;
            </Button>
          </div>
        ))}
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </Button>
          <Button variant="ghost" size="sm" disabled={(currentPage + 1) * ITEMS_PER_PAGE >= categories.length} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderSubCategories = () => {
    const subCategories = taxonomyData[currentCategory];
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const paginatedSubCategories = subCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
      <div className="space-y-2">
        <Button variant="ghost" size="sm" onClick={() => { setCurrentCategory(null); setCurrentPage(0); }}>
          &lt; Back
        </Button>
        {paginatedSubCategories.map(subCategory => (
          <div key={subCategory} className="flex items-center space-x-2 py-1">
            <Checkbox
              id={subCategory}
              checked={selectedItems[currentCategory]?.includes(subCategory)}
              onCheckedChange={() => handleSelect(currentCategory, subCategory)}
            />
            <label htmlFor={subCategory} className="text-sm font-medium leading-none cursor-pointer">
              {subCategory}
            </label>
          </div>
        ))}
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm" disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </Button>
          <Button variant="ghost" size="sm" disabled={(currentPage + 1) * ITEMS_PER_PAGE >= subCategories.length} onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Button onClick={handleSelectAll} variant="outline" size="sm" className="w-full">
          {selectAll ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <ScrollArea className="flex-grow">
        {currentCategory ? renderSubCategories() : renderCategories()}
      </ScrollArea>
    </div>
  );
};

const TaxonomyEditModal = ({ onSelect }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    console.log("Selected Taxonomy Items:", selectedItems);
    const selectedMainTopics = Object.keys(selectedItems);
    onSelect(selectedItems);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-500" onClick={() => setOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
          </svg>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Select Taxonomy Segments</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden flex flex-col">
          <TaxonomySelector onSelect={setSelectedItems} />
        </div>
        <div className="flex-shrink-0 pt-4 border-t mt-auto">
          <Button onClick={handleApply} className="w-full">Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaxonomyEditModal;
