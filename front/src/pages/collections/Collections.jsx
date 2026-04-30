import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';

// Mock data
const mockRoutes = [
  {
    id: 1,
    location: "Gràcia, Barcelona",
    title: "Tapes per Gràcia",
    price: "15€ / aprox",
    image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&q=80",
  },
  {
    id: 2,
    location: "Gòtic, Barcelona",
    title: "Cafès secrets",
    price: "10€ / aprox",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
  {
    id: 3,
    location: "Poblenou, Barcelona",
    title: "Urbex BCN",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&q=80",
  },
  {
    id: 4,
    location: "Montjuïc, Barcelona",
    title: "Vistes de nit",
    price: "Gratis",
    image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&q=80",
  }
];

const Collections = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoutes = mockRoutes.filter(route =>
    route.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-[#f0f4f9] dark:bg-slate-950 text-[#1a1a1a] dark:text-white font-display p-4 md:pl-20 pb-24 transition-colors duration-300">
      <Header />
      {/* Top spacing for header */}
      <div className="pt-28">

      {/* Search Bar */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input 
          type="text" 
          placeholder={t("collections.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
      </div>

      {/* Pills (Static for design matching) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <button className="flex items-center gap-2 bg-black dark:bg-primary text-white dark:text-primary-text px-4 py-2 rounded-full whitespace-nowrap">
          <img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=100" alt="Gràcia" className="w-6 h-6 rounded-full object-cover" />
          Gràcia
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-6 py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-gray-700">
          Gòtic
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-6 py-2 rounded-full whitespace-nowrap border border-gray-200 dark:border-gray-700">
          Poblenou
        </button>
      </div>

      {/* Route Cards List */}
      <div className="flex flex-col gap-4">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map(route => (
            <div 
              key={route.id} 
              className="relative w-full h-64 md:h-72 rounded-[32px] overflow-hidden shadow-lg group cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={route.image} 
                alt={route.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
             

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex flex-col">
                  <h3 className="text-white text-2xl font-bold leading-tight mb-1">
                    {route.title.split(' ').slice(0, -1).join(' ')}<br/>
                    {route.title.split(' ').slice(-1)}
                  </h3>
                </div>
                
                {/* Pencil Button (Non-functional as requested) */}
                <button 
                  className="bg-white dark:bg-primary text-black dark:text-primary-text w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-primary-dark transition-colors"
                  aria-label="Edit route"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No routes found matching your search.
          </div>
        )}
      </div>{/* end cards */}
      </div>{/* end pt-28 */}
      <Navbar />
    </div>
  );
};

export default Collections;
