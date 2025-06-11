import React from "react";
import { ChevronDown } from "lucide-react";

export default function StatsCard({ title, value, isActive = false, isPlaceholder = false }: {
  title: string;
  value?: number | string;
  isActive?: boolean;
  isPlaceholder?: boolean;
}) {
  return (
    <div 
      className={`
        bg-white p-6 rounded-xl border border-gray-200 text-center relative
        transition-all duration-200 hover:shadow-lg hover:-translate-y-1
        ${isActive ? 'bg-yellow-300 border-yellow-400' : ''}
        ${isPlaceholder ? 'bg-gray-100 border-gray-300' : ''}
      `}
    >
      <div className="absolute top-4 left-5 text-gray-400">
        <ChevronDown size={16} />
      </div>
      
      <div className="card-content">
        {isPlaceholder ? (
          <h3 className="text-xl font-medium text-gray-500">
            {title}
          </h3>
        ) : (
          <>
            <span className="text-5xl font-extrabold block mb-2">
              {value}
            </span>
            <p className="text-gray-600 text-base">
              {title}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
