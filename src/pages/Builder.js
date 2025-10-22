import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrashIcon, PrintIcon, PaletteIcon, TemplatesIcon, ChevronDownIcon, 
    UserIcon, UploadIcon, ExpandIcon
} from '../components/Icons';
import { initialData } from '../data/initialData';
import { Input, Textarea, Section, AddButton, DeleteButton, LanguageSwitcher } from '../components/FormControls';
import ImageEditorModal from '../components/ImageEditorModal';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import { translations } from '../data/translations';
import '../App.css';

const NATURAL = { w: 827, h: 1169 };

function Builder() {
    const [resumeData, setResumeData] = useState(initialData);
    const previewWrapperRef = useRef(null);
    const resumeContentRef = useRef(null);
    const fileInputRef = useRef(null);
    const [theme, setTheme] = useState({ font: 'Inter', color: '#2563eb' });
    const [template, setTemplate] = useState('Modern');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [imageToEdit, setImageToEdit] = useState(null);
    const [openSections, setOpenSections] = useState({
        personal: true,
        summary: true,
        education: true,
        experience: true,
        languages: true,
        skills: true,
        hobbies: true,
        references: true,
    });
    const [isParsing, setIsParsing] = useState(false);
    const cvInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [language, setLanguage] = useState('en');
    const navigate = useNavigate();

    const t = translations[language];

    const handleLanguageSwitch = (event) => {
        setLanguage(event.target.value);
    };

    const handleToggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const fontOptions = ['Arial', 'Courier New', 'Garamond', 'Georgia', 'Helvetica', 'Lato', 'Noto Sans', 'Noto Serif', 'Poppins', 'Times New Roman', 'Trebuchet MS'];
    const templateOptions = ['Modern', 'Classic', 'Minimal'];
    const proficiencyLevels = ['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Mastery'];
    const skillLevels = ['Beginner', 'Moderate', 'Good', 'Very good', 'Excellent'];


    const handleThemeChange = (prop, value) => { setTheme(prev => ({ ...prev, [prop]: value })); };
    const handleTemplateChange = (e) => { setTemplate(e.target.value); };

    const toggleFullScreen = () => {
        const elem = previewWrapperRef.current;
        if (!elem) return;

        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const handleDownloadPDF = async () => {
        // ... PDF download logic ...
    };

    const handleGenericChange = (section, field, value) => { setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } })); };
    const handleSummaryChange = (e) => { setResumeData(prev => ({ ...prev, summary: e.target.value })); };
    const handleArrayChange = (section, index, field, value) => { setResumeData(prev => ({ ...prev, [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item ) })); };
    const addArrayItem = (section, newItem) => { setResumeData(prev => ({ ...prev, [section]: [...(prev[section] || []), newItem] })); };
    const deleteArrayItem = (section, index) => { setResumeData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) })); };
    
    const triggerFileUpload = () => {
        cvInputRef.current.click();
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageToEdit(event.target.result);
                setIsEditorOpen(true);
            };
            reader.readAsDataURL(e.target.files[0]);
            e.target.value = null; 
        }
    };

    const handleSavePhoto = (newPhotoDataUrl) => {
        handleGenericChange('header', 'photo', newPhotoDataUrl);
        setIsEditorOpen(false);
        setImageToEdit(null);
    };
    
    const handleRemovePhoto = () => {
        handleGenericChange('header', 'photo', '');
        setIsEditorOpen(false);
        setImageToEdit(null);
    };

    const handleCloseEditor = () => {
        setIsEditorOpen(false);
        setImageToEdit(null);
    };

    const handleCVFileChange = (e) => {
        // ... CV file change logic ...
    };
    
    useLayoutEffect(() => {
        const wrapper = previewWrapperRef.current;
        if (!wrapper) return;

        const recalc = () => {
            const availableW = wrapper.clientWidth || 1;
            const top = wrapper.getBoundingClientRect().top;
            const availableH = Math.max(120, window.innerHeight - top - 80); 
            const s = Math.min(availableW / NATURAL.w, availableH / NATURAL.h);
            setScale(s);
        };

        recalc();
        const ro = new ResizeObserver(recalc);
        ro.observe(wrapper);
        window.addEventListener('resize', recalc);
        document.addEventListener('fullscreenchange', recalc);

        return () => {
            ro.disconnect();
            window.removeEventListener('resize', recalc);
            document.removeEventListener('fullscreenchange', recalc);
        };
    }, []); 

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
             {isEditorOpen && (
                <ImageEditorModal 
                    src={imageToEdit}
                    onClose={handleCloseEditor}
                    onSave={handleSavePhoto}
                    onUpload={triggerFileUpload}
                    t={t}
                />
            )}
            <header className="relative no-print py-6 md:py-8 px-4 md:px-8">
                <h1 className="text-center text-4xl md:text-5xl font-extrabold text-gray-800">{t.resumeBuilder}</h1>
                <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 flex items-center gap-4">
                    <input type="file" accept="image/*" ref={cvInputRef} onChange={handleCVFileChange} className="hidden" />
                    <button 
                        onClick={triggerFileUpload}
                        disabled={isParsing}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                        title="Upload CV Image"
                    >
                        <UploadIcon />
                        <span>{isParsing ? t.parsing : t.uploadCV}</span>
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <span>Dashboard</span>
                    </button>
                </div>
                <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 flex items-center gap-4">
                     <LanguageSwitcher currentLang={language} onSwitch={handleLanguageSwitch} />
                     <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                        title="Download as PDF"
                    >
                        <PrintIcon />
                        <span>{isDownloading ? t.downloading : t.download}</span>
                    </button>
                </div>
            </header>
            
            <main className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8 pb-8">
                <div className="no-print">
                    <Section title={t.personalDetails} isOpen={openSections.personal} onToggle={() => handleToggleSection('personal')}>
                        {/* ... form sections ... */}
                    </Section>
                </div>
                
                <div className="sticky top-8 resume-preview-container flex flex-col items-center" ref={previewWrapperRef}>
                    <div 
                        className="bg-white rounded-lg shadow-2xl relative overflow-hidden"
                        style={{
                            width: `${NATURAL.w * scale}px`,
                            height: `${NATURAL.h * scale}px`,
                        }}
                    >
                        <div 
                           ref={resumeContentRef}
                           className={`resume-content origin-top-left ${previewImage ? 'invisible' : ''}`}
                           style={{
                             width: `${NATURAL.w}px`,
                             height: `${NATURAL.h}px`,
                             transform: `scale(${scale})`,
                             transformOrigin: 'top left',
                        }}
                        >
                           {template === 'Classic' && <ClassicTemplate resumeData={resumeData} theme={theme} t={t} />}
                           {template === 'Modern' && <ModernTemplate resumeData={resumeData} theme={theme} t={t} />}
                           {template === 'Minimal' && <MinimalTemplate resumeData={resumeData} theme={theme} t={t} />}
                        </div>
                    </div>
                    {/* Toolbar */}
                    <div className="bg-white rounded-lg shadow-lg mt-4 p-2 flex flex-wrap items-center justify-between gap-y-2 text-sm text-gray-700 no-print" style={{ width: `${NATURAL.w * scale}px` }}>
                        {/* ... toolbar content ... */}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Builder;

    