import React from 'react';
import { ChevronDownIcon, PlusCircleIcon, TrashIcon } from './Icons';

export const Input = ({ label, value, onChange, placeholder }) => ( <div className="flex flex-col mb-4"> <label className="text-sm font-medium text-gray-600 mb-1">{label}</label> <input type="text" value={value} onChange={onChange} placeholder={placeholder || label} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/> </div> );
export const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => ( <div className="flex flex-col mb-4"> <label className="text-sm font-medium text-gray-600 mb-1">{label}</label> <textarea value={value} onChange={onChange} placeholder={placeholder || label} rows={rows} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/> </div> );

export const Section = ({ title, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-lg shadow-md mb-6 transition-all duration-300">
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
        >
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <div className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full text-gray-500 flex-shrink-0">
                <ChevronDownIcon className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </button>
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6 pt-0">
                <div className="border-t border-gray-200 -mx-6 mb-6"></div>
                {children}
            </div>
        </div>
    </div>
);

export const AddButton = ({ onClick, children }) => ( <button onClick={onClick} className="flex items-center justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"> <PlusCircleIcon /> <span className="ml-2">{children}</span> </button> );
export const DeleteButton = ({ onClick }) => ( <button onClick={onClick} className="text-red-500 hover:text-red-700 transition absolute top-2 right-2"> <TrashIcon /> </button> );

// --- UPDATED COMPONENT FOR LANGUAGE SWITCHING ---
export const LanguageSwitcher = ({ currentLang, onSwitch }) => (
    <div className="relative">
        <select
            value={currentLang}
            onChange={onSwitch}
            className="bg-gray-200 text-gray-800 font-bold py-2 pl-4 pr-8 rounded-lg hover:bg-gray-300 transition-colors appearance-none cursor-pointer focus:outline-none"
            title="Switch Language"
        >
            <option value="en">English</option>
            <option value="lo">ພາສາລາວ</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDownIcon />
        </div>
    </div>
);

