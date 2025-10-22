import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    MailIcon, PhoneIcon, LocationIcon, TrashIcon, PlusCircleIcon, PrintIcon, PaletteIcon,
    TemplatesIcon, ChevronDownIcon, UserIcon, UploadIcon, ExpandIcon
} from './components/Icons';
import { initialData } from './data/initialData';
import { Input, Textarea, Section, AddButton, DeleteButton, LanguageSwitcher } from './components/FormControls';
import ImageEditorModal from './components/ImageEditorModal';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import { translations } from './data/translations';
import './App.css';

function App() {
    const [resumeData, setResumeData] = useState(initialData);
    const previewWrapperRef = useRef(null);
    const resumeContentRef = useRef(null);
    const scaleContainerRef = useRef(null);
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
    const NATURAL = { w: 827, h: 1169 };
    const [scale, setScale] = useState(1);
    const [language, setLanguage] = useState('en');

    const t = translations[language]; // Get current language strings

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
        if (isDownloading) return;

        const contentToCapture = resumeContentRef.current;
        if (!contentToCapture) {
            console.error("Resume content not found");
            return;
        }

        if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
            alert("PDF generation libraries are still loading. Please wait a moment and try again.");
            return;
        }

        setIsDownloading(true);
        
        const originalScale = resumeContentRef.current.style.transform;
        resumeContentRef.current.style.transform = 'scale(1)';

        try {
            const canvas = await window.html2canvas(contentToCapture, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: NATURAL.w,
                height: NATURAL.h,
            });

            resumeContentRef.current.style.transform = originalScale;

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [NATURAL.w, NATURAL.h] });
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            
            pdf.save('resume.pdf');

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error creating the PDF. Please try again.");
            resumeContentRef.current.style.transform = originalScale;
        } finally {
             setIsDownloading(false);
        }
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
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            setImageToEdit(reader.result);
            setIsEditorOpen(true);

            setIsParsing(true);
            setPreviewImage(reader.result);
            const base64ImageData = reader.result.split(',')[1];
            
            const schema = {
                type: "OBJECT",
                properties: {
                    header: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            jobposition: { type: "STRING" },
                            email: { type: "STRING" },
                            phone: { type: "STRING" },
                            address: { type: "STRING" },
                        }
                    },
                    summary: { type: "STRING" },
                    experience: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                title: { type: "STRING" },
                                company: { type: "STRING" },
                                location: { type: "STRING" },
                                startDate: { type: "STRING" },
                                endDate: { type: "STRING" },
                                description: { type: "STRING" }
                            }
                        }
                    },
                    education: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                education: { type: "STRING" },
                                school: { type: "STRING" },
                                city: { type: "STRING" },
                                startDate: { type: "STRING" },
                                endDate: { type: "STRING" },
                                description: { type: "STRING" }
                            }
                        }
                    },
                    skills: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                name: { type: "STRING" },
                                level: { type: "STRING" }
                            }
                        }
                    },
                    languages: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                name: { type: "STRING" },
                                level: { type: "STRING" }
                            }
                        }
                    },
                    hobbies: { type: "STRING" },
                    references: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                name: { type: "STRING" },
                                company: { type: "STRING" },
                                phone: { type: "STRING" },
                                email: { type: "STRING" }
                            }
                        }
                    }
                }
            };

            const payload = {
                contents: [
                    {
                        parts: [
                            { text: "Extract the following information from the resume image and return it as a JSON object matching the provided schema. Infer proficiency levels for skills and languages if not explicitly stated." },
                            {
                                inline_data: {
                                    mime_type: file.type,
                                    data: base64ImageData
                                }
                            }
                        ]
                    }
                ],
                generation_config: {
                    response_mime_type: "application/json",
                    response_schema: schema,
                },
            };
            
            try {
                // IMPORTANT: PASTE YOUR GOOGLE AI API KEY HERE
                const apiKey = "AIzaSyBKoMaMXuS5Vr13sEoeUsMn_G50kyiBd68"; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status: ${response.status}`);
                }

                const result = await response.json();
                const jsonText = result.candidates[0].content.parts[0].text;
                const parsedData = JSON.parse(jsonText);
                
                setResumeData(prev => {
                    const newState = { ...prev };
                    for (const key in parsedData) {
                        if (Object.prototype.hasOwnProperty.call(parsedData, key)) {
                            if ((key === 'header' || key === 'education') && typeof parsedData[key] === 'object' && parsedData[key] !== null && !Array.isArray(parsedData[key])) {
                                newState[key] = { ...prev[key], ...parsedData[key] };
                            } else if (parsedData[key] !== undefined) {
                                newState[key] = parsedData[key];
                            }
                        }
                    }
                    return newState;
                });

            } catch (error) {
                console.error("Error parsing CV:", error);
                alert("Sorry, there was an error processing your CV. Please check the image and try again.");
            } finally {
                setIsParsing(false);
                setPreviewImage(null);
                cvInputRef.current.value = null;
            }
        };
    };
    
    useLayoutEffect(() => {
        const wrapper = previewWrapperRef.current;
        if (!wrapper) return;

        const recalc = () => {
            const availableW = wrapper.clientWidth || 1;
            const top = wrapper.getBoundingClientRect().top;
            const availableH = Math.max(120, window.innerHeight - top - 80); 
            const s = Math.min((availableW / NATURAL.w) * 0.9, (availableH / NATURAL.h) * 0.9);
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
                <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2">
                    <input type="file" accept="image/*" ref={cvInputRef} onChange={handleCVFileChange} className="hidden" />
                    <button 
                        onClick={() => cvInputRef.current.click()}
                        disabled={isParsing}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                        title="Upload CV Image"
                    >
                        <UploadIcon />
                        <span>{isParsing ? t.parsing : t.uploadCV}</span>
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
            
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-8 pb-8">
                <div className="no-print">
                    <Section title={t.personalDetails} isOpen={openSections.personal} onToggle={() => handleToggleSection('personal')}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="md:col-span-1 flex flex-col items-center justify-center">
                                    <label className="text-sm font-medium text-gray-600 mb-2 self-center">{t.profilePhoto}</label>
                                    <div className="relative group w-36 h-36">
                                        <div className="w-36 h-36 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mb-2 shadow-inner">
                                            {resumeData.header.photo ? (
                                                <img src={resumeData.header.photo} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-20 h-20 text-gray-400" />
                                            )}
                                        </div>
                                        <label htmlFor="photo-upload" className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-opacity cursor-pointer">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                                {resumeData.header.photo ? t.change : t.upload}
                                            </span>
                                        </label>
                                        <input id="photo-upload" ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                         {resumeData.header.photo && (
                                            <button
                                                onClick={handleRemovePhoto}
                                                className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-md text-red-500 hover:bg-red-50"
                                                title={t.removePhoto}
                                            >
                                                <TrashIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                               <div className="md:col-span-2">
                                     <Input 
                                         label={t.fullName} 
                                         value={resumeData.header.name} 
                                         onChange={e => handleGenericChange('header', 'name', e.target.value)} />
                                     <Input 
                                         label={t.jobPosition} 
                                         value={resumeData.header.jobposition} 
                                         onChange={e => handleGenericChange('header', 'jobposition', e.target.value)} />
                                        
                               </div>
                            </div>
                            <Input 
                                 label={t.emailAddress} 
                                 value={resumeData.header.email} 
                                 onChange={e => handleGenericChange('header', 'email', e.target.value)} />
                                 
                            <Input 
                                 label={t.phoneNumber} 
                                 value={resumeData.header.phone} 
                                 onChange={e => handleGenericChange('header', 'phone', e.target.value)} />
                                
                            <Input 
                                 label={t.address} 
                                 value={resumeData.header.address} 
                                 onChange={e => handleGenericChange('header', 'address', e.target.value)} className="md:col-span-2" />
                                  
                        </div>
                    </Section>
                    
                    <Section title={t.summary} isOpen={openSections.summary} onToggle={() => handleToggleSection('summary')}>
                        <Textarea label={t.professionalSummary} value={resumeData.summary} onChange={handleSummaryChange} rows={5} />
                    </Section>

                    <Section title={t.education} isOpen={openSections.education} onToggle={() => handleToggleSection('education')}>
                        {resumeData.education.map((edu, index) => (
                             <div key={index} className="relative p-4 mb-4 border rounded-md bg-gray-50">
                                <DeleteButton onClick={() => deleteArrayItem('education', index)} />
                                <Input label={t.degree} value={edu.education} onChange={e => handleArrayChange('education', index, 'education', e.target.value)} />
                                <Input label={t.school} value={edu.school} onChange={e => handleArrayChange('education', index, 'school', e.target.value)} />
                                 <div className="grid grid-cols-3 gap-4">
                                    <Input label={t.city} value={edu.city} onChange={e => handleArrayChange('education', index, 'city', e.target.value)} />
                                    <Input label={t.startDate} value={edu.startDate} onChange={e => handleArrayChange('education', index, 'startDate', e.target.value)} />
                                    <Input label={t.endDate} value={edu.endDate} onChange={e => handleArrayChange('education', index, 'endDate', e.target.value)} />
                                </div>
                                <Textarea label={t.description} value={edu.description} onChange={e => handleArrayChange('education', index, 'description', e.target.value)} rows={2} />
                            </div>
                        ))}
                        <AddButton onClick={() => addArrayItem('education', { education: '', school: '', city: '', startDate: '', endDate: '', description: '' })}>{t.addEducation}</AddButton>
                    </Section>
                    
                    <Section title={t.experience} isOpen={openSections.experience} onToggle={() => handleToggleSection('experience')}>
                        {resumeData.experience.map((exp, index) => (
                            <div key={index} className="relative p-4 mb-4 border rounded-md bg-gray-50">
                                <DeleteButton onClick={() => deleteArrayItem('experience', index)} />
                                <Input label={t.jobTitle} value={exp.title} onChange={e => handleArrayChange('experience', index, 'title', e.target.value)} />
                                <Input label={t.company} value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} />
                                <Input label={t.location} value={exp.location} onChange={e => handleArrayChange('experience', index, 'location', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label={t.startDate} value={exp.startDate} onChange={e => handleArrayChange('experience', index, 'startDate', e.target.value)} />
                                    <Input label={t.endDate} value={exp.endDate} onChange={e => handleArrayChange('experience', index, 'endDate', e.target.value)} />
                                </div>
                                <Textarea label={t.description} value={exp.description} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} rows={3} />
                            </div>
                        ))}
                        <AddButton onClick={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}>{t.addExperience}</AddButton>
                    </Section>
                    
                    <Section title={t.languages} isOpen={openSections.languages} onToggle={() => handleToggleSection('languages')}>
                        {resumeData.languages.map((lang, index) => (
                            <div key={index} className="relative p-4 mb-2 border rounded-md bg-gray-50">
                                <DeleteButton onClick={() => deleteArrayItem('languages', index)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label={t.language} value={lang.name} onChange={e => handleArrayChange('languages', index, 'name', e.target.value)} />
                                    <div className="flex flex-col mb-4">
                                        <label className="text-sm font-medium text-gray-600 mb-1">{t.proficiencyLevel}</label>
                                        <select value={lang.level} onChange={e => handleArrayChange('languages', index, 'level', e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                            {proficiencyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <AddButton onClick={() => addArrayItem('languages', { name: '', level: 'Intermediate' })}>{t.addLanguage}</AddButton>
                    </Section>

                    <Section title={t.skills} isOpen={openSections.skills} onToggle={() => handleToggleSection('skills')}>
                        {resumeData.skills.map((skill, index) => (
                            <div key={index} className="relative p-4 mb-2 border rounded-md bg-gray-50">
                                <DeleteButton onClick={() => deleteArrayItem('skills', index)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label={t.skill} value={skill.name} onChange={e => handleArrayChange('skills', index, 'name', e.target.value)} />
                                    <div className="flex flex-col mb-4">
                                        <label className="text-sm font-medium text-gray-600 mb-1">{t.level}</label>
                                        <select value={skill.level} onChange={e => handleArrayChange('skills', index, 'level', e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                            {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <AddButton onClick={() => addArrayItem('skills', { name: '', level: 'Good' })}>{t.addSkill}</AddButton>
                    </Section>

                    <Section title={t.hobbies} isOpen={openSections.hobbies} onToggle={() => handleToggleSection('hobbies')}>
                        <Textarea 
                            label={t.hobbiesPlaceholder}
                            value={resumeData.hobbies} 
                            onChange={e => setResumeData(prev => ({ ...prev, hobbies: e.target.value }))}
                            rows={2}
                        />
                    </Section>
                    
                    <Section title={t.references} isOpen={openSections.references} onToggle={() => handleToggleSection('references')}>
                        {resumeData.references.map((ref, index) => (
                            <div key={index} className="relative p-4 mb-2 border rounded-md bg-gray-50">
                                <DeleteButton onClick={() => deleteArrayItem('references', index)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label={t.referenceName} value={ref.name} onChange={e => handleArrayChange('references', index, 'name', e.target.value)} />
                                    <Input label={t.company} value={ref.company} onChange={e => handleArrayChange('references', index, 'company', e.target.value)} />
                                    <Input label={t.phoneNumber} value={ref.phone} onChange={e => handleArrayChange('references', index, 'phone', e.target.value)} />
                                    <Input label={t.emailAddress} value={ref.email} onChange={e => handleArrayChange('references', index, 'email', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <AddButton onClick={() => addArrayItem('references', { name: '', company: '', phone: '', email: '' })}>{t.addReference}</AddButton>
                    </Section>
                </div>
                
                <div className="sticky top-8 resume-preview-container flex flex-col items-center min-w-0" ref={previewWrapperRef}>
                    <div 
                        ref={scaleContainerRef}
                        className="bg-white rounded-lg shadow-2xl relative overflow-hidden"
                        style={{
                            width: `${NATURAL.w * scale}px`,
                            height: `${NATURAL.h * scale}px`,
                        }}
                    >
                        {previewImage && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
                                <div className="text-center">
                                    <img src={previewImage} alt="Uploaded CV Preview" className="max-w-full max-h-full object-contain shadow-lg" style={{ maxHeight: `${NATURAL.h * scale}px` }} />
                                    {isParsing && <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">Parsing your CV...</p>}
                                </div>
                            </div>
                        )}
                        <div 
                           ref={resumeContentRef}
                           className={`resume-content origin-top-left break-words whitespace-pre-wrap ${previewImage ? 'invisible' : ''}`}
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
                        <div className="flex items-center flex-wrap gap-2">
                            <div className="relative flex items-center">
                                <TemplatesIcon />
                                <select onChange={handleTemplateChange} value={template} className="bg-transparent py-2 pl-2 pr-8 text-sm appearance-none focus:outline-none focus:ring-0 border-0 cursor-pointer">
                                    {templateOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <div className="border-l h-5 border-gray-300 mx-2 hidden sm:block"></div>
                            <div className="relative flex items-center">
                                <select onChange={(e) => handleThemeChange('font', e.target.value)} value={theme.font} className="bg-transparent py-2 pl-2 pr-8 text-sm appearance-none focus:outline-none focus:ring-0 border-0 cursor-pointer">
                                    {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <div className="border-l h-5 border-gray-300 mx-2 hidden sm:block"></div>
                            <div className="relative flex items-center p-2 rounded hover:bg-gray-100">
                                <PaletteIcon />
                                <input type="color" value={theme.color} onChange={(e) => handleThemeChange('color', e.target.value)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                            </div>
                        </div>
                         <div className="flex items-center">
                            <button onClick={toggleFullScreen} className="flex items-center p-2 rounded hover:bg-gray-100" title="Toggle Fullscreen">
                                <ExpandIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;

