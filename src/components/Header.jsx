import { Filter, Search } from "lucide-react";
import React from "react";

const Header = ({ pageTitle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">{pageTitle}</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
