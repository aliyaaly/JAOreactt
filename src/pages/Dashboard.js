import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TemplatesIcon, SunIcon, MoonIcon, FileTextIcon, 
    BarChartIcon, DownloadCloudIcon, EditIcon, MoreVerticalIcon
} from '../components/Icons';
import { LanguageSwitcher } from '../components/FormControls';
import { translations } from '../data/translations';
import '../App.css';

// --- MOCK DATA ---
const mockResumes = [
  { id: 1, title: "Software Engineer Resume", lastEdited: "2025-10-05" },
  { id: 2, title: "Data Analyst CV", lastEdited: "2025-10-02" },
  { id: 3, title: "Project Manager Application", lastEdited: "2025-09-28" },
  { id: 4, title: "UX Designer Portfolio CV", lastEdited: "2025-09-25" },
];

const chartData = [
  { name: 'May', value: 3 }, { name: 'Jun', value: 5 }, { name: 'Jul', value: 2 },
  { name: 'Aug', value: 8 }, { name: 'Sep', value: 6 }, { name: 'Oct', value: 4 }
];

// --- COMPONENTS ---
const StatCard = ({ icon, title, value, change }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                {change && <p className={`text-sm font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
            </div>
        </div>
    </div>
);

const ActivityChart = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">CV Creation Activity</h3>
        <div className="w-full h-64">
            <svg width="100%" height="100%" viewBox="0 0 500 250" preserveAspectRatio="xMidYMid meet">
                <line x1="50" y1="220" x2="480" y2="220" stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="2" />
                <line x1="50" y1="20" x2="50" y2="220" stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="2" />
                {chartData.map((d, i) => {
                    const barHeight = (d.value / 10) * 180;
                    return (
                        <g key={d.name}>
                            <rect
                                x={70 + i * 65}
                                y={220 - barHeight}
                                width="40"
                                height={barHeight}
                                className="text-blue-500"
                                fill="currentColor"
                                rx="4"
                            >
                              <animate attributeName="height" from="0" to={barHeight} dur="0.5s" fill="freeze" begin={`${i*0.1}s`} />
                              <animate attributeName="y" from="220" to={220 - barHeight} dur="0.5s" fill="freeze" begin={`${i*0.1}s`} />
                            </rect>
                            <text x={90 + i * 65} y="235" textAnchor="middle" className="text-xs fill-current text-gray-500 dark:text-gray-400">{d.name}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    </div>
);

const RecentResumesTable = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div className="p-6">
      <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Resumes</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Last Edited</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockResumes.map(resume => (
            <tr key={resume.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-semibold text-gray-900 dark:text-white">{resume.title}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(resume.lastEdited).toLocaleDateString()}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" aria-label="Edit"><EditIcon /></button>
                    <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" aria-label="More options"><MoreVerticalIcon /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

function Dashboard() {
    const [language, setLanguage] = useState('en');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
    const navigate = useNavigate();

    const t = translations[language]; 

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const handleLanguageSwitch = (event) => setLanguage(event.target.value);
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <header className="relative py-6 md:py-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Dashboard</h1>
                    <div className="flex items-center gap-4">
                         <LanguageSwitcher currentLang={language} onSwitch={handleLanguageSwitch} />
                         <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Toggle Dark Mode">
                             {isDarkMode ? <SunIcon /> : <MoonIcon />}
                         </button>
                         <button onClick={() => navigate('/builder')} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                             <span>Back to Builder</span>
                         </button>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
                    <p className="text-gray-500 dark:text-gray-400">Here's a summary of your resume activity.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={<FileTextIcon />} title="CVs Created" value="4" />
                    <StatCard icon={<TemplatesIcon />} title="Templates Used" value="3" />
                    <StatCard icon={<DownloadCloudIcon />} title="Total Downloads" value="12" />
                    <StatCard icon={<BarChartIcon />} title="Monthly Activity" value="+5%" change="+5%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <RecentResumesTable />
                    </div>
                    <div>
                        <ActivityChart />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;

