"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Unlock 
} from 'lucide-react';

// --- TYPES ---
interface DailyData {
  date: string;
  inventory?: number;
  price?: number;
  available?: number;
  isLocked: boolean;
  isClosed?: boolean;
}

interface RateRow {
  id: string;
  label: string;
  type: 'price' | 'inventory';
  data: Record<string, DailyData>;
}

interface Plan {
  id: string;
  name: string;
  rows: RateRow[];
}

interface RoomType {
  id: string;
  name: string;
  isExpanded: boolean;
  masterData: Record<string, DailyData>;
  plans: Plan[];
}

interface CalendarDate {
  dateStr: string;
  displayDate: string;
  displayHeader: string;
}

// --- CONSTANTS & MOCK DATA ---
const generateDates = (startDate: Date, days: number): CalendarDate[] => {
  const dates: CalendarDate[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    
    const day = d.getDate();
    const monthShort = d.toLocaleString('default', { month: 'short' });
    const weekdayShort = d.toLocaleString('default', { weekday: 'short' });
    const year = d.getFullYear();

    dates.push({
      dateStr: d.toISOString().split('T')[0],
      displayDate: `${monthShort} ${day}, ${weekdayShort}`,
      displayHeader: `${day} ${monthShort}, ${year}`,
    });
  }
  return dates;
};

const DATES = generateDates(new Date('2019-11-13'), 15); // Increased range slightly

const generateDailyData = (dates: CalendarDate[], baseInventory: number, basePrice: number): Record<string, DailyData> => {
  const data: Record<string, DailyData> = {};
  dates.forEach((d, index) => {
    const isWeekend = d.displayDate.includes('Sat') || d.displayDate.includes('Sun');
    const isLocked = index === 4 || index === 11;
    const isClosed = index === 5;
    
    data[d.dateStr] = {
      date: d.dateStr,
      inventory: Math.max(0, baseInventory - (index % 3)),
      price: basePrice + (isWeekend ? 500 : 0),
      available: Math.max(0, baseInventory + 2 - (index % 4)),
      isLocked: isLocked,
      isClosed: isClosed
    };
  });
  return data;
};

const MOCK_ROOMS: RoomType[] = [
  {
    id: 'room-1',
    name: 'Deluxe Room',
    isExpanded: true,
    masterData: generateDailyData(DATES, 5, 0),
    plans: [
      {
        id: 'plan-1',
        name: 'CP Plan',
        rows: [
          { id: 'p1-r1', label: '1 Adult', type: 'price', data: generateDailyData(DATES, 0, 2000) },
          { id: 'p1-r2', label: '2 Adults', type: 'price', data: generateDailyData(DATES, 0, 4000) },
          { id: 'p1-r3', label: 'Extra Person', type: 'price', data: generateDailyData(DATES, 0, 1500) },
          { id: 'p1-r4', label: 'Child', type: 'price', data: generateDailyData(DATES, 0, 800) },
        ]
      }
    ]
  },
  {
    id: 'room-2',
    name: 'Superior Executive Room',
    isExpanded: false,
    masterData: generateDailyData(DATES, 8, 0),
    plans: []
  },
  {
    id: 'room-3',
    name: 'Premium Room',
    isExpanded: false,
    masterData: generateDailyData(DATES, 3, 0),
    plans: []
  }
];

// --- UI COMPONENTS ---

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }> = ({ 
  children, className = '', variant = 'primary', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} h-9 px-4 py-2 ${className}`} {...props}>
      {children}
    </button>
  );
};

const GridCell: React.FC<{ type: 'master' | 'price'; data: DailyData; isEven?: boolean }> = ({ type, data, isEven }) => {
  if (type === 'master') {
    return (
      <div className={`border-r border-b border-gray-100 h-20 p-2 flex flex-col items-center justify-between min-w-[100px] ${isEven ? 'bg-gray-50/30' : 'bg-white'}`}>
        <div className="flex items-center gap-2 w-full justify-center">
          <input 
            type="text" 
            defaultValue={data.inventory} 
            className="w-10 h-7 text-center border border-gray-300 rounded text-xs focus:border-blue-500 focus:outline-none text-gray-600 font-medium"
          />
          <div className="bg-gray-100 text-gray-500 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-gray-200 whitespace-nowrap">
            AVL {data.available}
          </div>
        </div>
        
        <button className="focus:outline-none mt-1 hover:scale-110 transition-transform">
          {data.isLocked || data.isClosed ? (
             <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
               <Lock size={12} />
             </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-500">
              <Unlock size={12} />
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`border-r border-b border-gray-100 h-14 p-2 flex items-center justify-center min-w-[100px] ${isEven ? 'bg-gray-50/30' : 'bg-white'}`}>
      <input 
        type="text" 
        defaultValue={data.price?.toLocaleString()} 
        className="w-full h-8 text-center border border-gray-300 rounded text-sm text-gray-600 focus:border-blue-500 focus:outline-none hover:border-gray-400 transition-colors"
      />
    </div>
  );
};

const RoomRow: React.FC<{ room: RoomType; dates: CalendarDate[] }> = ({ room, dates }) => {
  const [isExpanded, setIsExpanded] = useState(room.isExpanded);

  return (
    <div className="contents">
      {/* Master Row */}
      <div className="contents group">
        {/* Sticky Sidebar Cell */}
        <div className="sticky left-0 z-10 bg-white border-b border-r border-gray-200 h-20 flex items-center justify-between px-4 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group-hover:text-blue-600 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
            <span className="font-semibold text-gray-800 text-sm">{room.name}</span>
          </div>
          <button className="text-orange-500 hover:text-orange-600 text-xs font-semibold px-2 py-1 hover:bg-orange-50 rounded transition-colors">
            Update
          </button>
        </div>

        {/* Data Cells */}
        {dates.map((date, idx) => (
          <GridCell 
            key={date.dateStr} 
            type="master" 
            data={room.masterData[date.dateStr]} 
            isEven={idx % 2 !== 0}
          />
        ))}
      </div>

      {/* Expanded Content */}
      {isExpanded && room.plans.map(plan => (
        <React.Fragment key={plan.id}>
          {/* Plan Header Row */}
          <div className="contents">
            <div className="sticky left-0 z-10 bg-white border-b border-r border-gray-200 h-10 flex items-center justify-between px-4 pl-12 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] bg-gray-50/50">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{plan.name}</span>
              <button className="text-blue-500 hover:text-blue-600 text-xs font-medium hover:underline">Edit</button>
            </div>
            {dates.map((_, idx) => (
              <div key={idx} className={`border-b border-r border-gray-100 h-10 ${idx % 2 !== 0 ? 'bg-gray-50/30' : 'bg-white'}`} />
            ))}
          </div>

          {/* Pricing Rows */}
          {plan.rows.map((row, rowIdx) => (
            <div key={row.id} className="contents">
              <div className="sticky left-0 z-10 bg-white border-b border-r border-gray-200 h-14 flex items-center justify-between px-4 pl-12 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                <span className="text-gray-600 text-sm font-medium">{row.label}</span>
                {rowIdx === plan.rows.length - 1 && (
                  <button className="text-gray-400 hover:text-gray-600 text-xs font-medium">More actions</button>
                )}
              </div>
              
              {dates.map((date, idx) => (
                <GridCell 
                  key={date.dateStr} 
                  type="price" 
                  data={row.data[date.dateStr]}
                  isEven={idx % 2 !== 0}
                />
              ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function HotelInventoryCalendar() {
  const [startDate, setStartDate] = useState("2019-11-13");
  const [endDate, setEndDate] = useState("2019-11-30");

  const dates = DATES;
  const rooms = MOCK_ROOMS;

  return (
    <div >
      
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory & Rates</h1>
          <p className="text-gray-500 text-sm">Manage your room availability, pricing, and restrictions across all channels.</p>
        </header>

        {/* Top Control Bar */}
        <div className="bg-white rounded-t-md border border-b-0 border-gray-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm">
          
          {/* Date Pickers */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
              <div className="relative group">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-transparent text-sm text-gray-700 focus:outline-none font-medium uppercase w-36 cursor-pointer"
                />
                <Calendar className="absolute left-2.5 top-2 text-gray-400 pointer-events-none" size={14} />
              </div>
              <span className="text-gray-400"><ArrowRight size={14} /></span>
              <div className="relative group">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-transparent text-sm text-gray-700 focus:outline-none font-medium uppercase w-36 cursor-pointer"
                />
                <Calendar className="absolute left-2.5 top-2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
            
           
            
          
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            

            <div className="flex items-center gap-3">
              <div className="relative">
                 <Button variant="outline" className="pr-8 border-gray-200 text-gray-600 font-medium h-9 shadow-sm">
                   Export Actions
                 </Button>
                 <span className="absolute right-3 top-3 border-l border-gray-300 h-3 w-0"></span>
                 <ChevronDown className="absolute right-2.5 top-3 text-gray-400" size={14} />
              </div>
              
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <button className="px-3 py-2 hover:bg-gray-50 text-gray-600 border-r border-gray-200 transition-colors flex items-center gap-1 text-xs font-medium">
                  <ArrowLeft size={14} /> Prev 15 Days
                </button>
                <button className="px-3 py-2 hover:bg-gray-50 text-gray-600 transition-colors flex items-center gap-1 text-xs font-medium">
                  Next 15 Days <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Container */}
        <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <div 
              className="grid min-w-max" 
              style={{ 
                gridTemplateColumns: `250px repeat(${dates.length}, 100px)` 
              }}
            >
              {/* Header Row */}
              <div className="sticky left-0 top-0 z-30 bg-gray-50 border-b border-r border-gray-200 h-16 min-w-[250px] flex items-center px-4">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Room Types & Plans</span>
              </div>
              
              {dates.map((d, i) => (
                <div 
                  key={d.dateStr} 
                  className={`sticky top-0 z-20 border-b border-r border-gray-200 h-16 flex gap-1 items-center justify-center text-xs bg-white min-w-[100px] ${i % 2 !== 0 ? 'bg-gray-50/50' : ''}`}
                >
                  
                  <span className="font-semibold text-gray-600">{d.displayDate.split(' ')[0]} {d.displayDate.split(' ')[1].replace(',', '')}</span>
                  <span className=" text-gray-600 font-semibold ">{d.displayDate.split(',')[1]}</span>
                </div>
              ))}

              {/* Room Rows (Recursive) */}
              {rooms.map(room => (
                <RoomRow key={room.id} room={room} dates={dates} />
              ))}

            </div>
          </div>
        </div>
        
        {/* Footer Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-500"><Unlock size={10} /></div>
              <span>Open for Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500"><Lock size={10} /></div>
              <span>Closed / Stopped</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-300 rounded bg-white"></div>
              <span>Editable Field</span>
            </div>
          </div>
          <div>
            Last updated: Today at 09:42 AM
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 12px;
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 6px;
          border: 3px solid #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}</style>
    </div>
  );
}