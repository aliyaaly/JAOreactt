import React from 'react';
import { MailIcon, PhoneIcon, UserIcon } from '../components/Icons';

const ClassicTemplate = ({ resumeData, theme, t }) => (
    <div className="p-10 h-full w-full text-base bg-white text-gray-800 overflow-hidden">
        <header className="flex items-center mb-8 pb-4 border-b">
            <div className="w-36 h-36 rounded-lg mr-8 flex-shrink-0 bg-gray-200 flex items-center justify-center">
                {resumeData.header.photo ? (
                    <img src={resumeData.header.photo} alt="Profile" className="w-full h-full rounded-lg object-cover" />
                ) : (
                    <UserIcon className="w-20 h-20 text-gray-400" />
                )}
            </div>
            <div className="text-left flex-grow">
                <h1 className="font-extrabold text-gray-900 tracking-tight text-5xl leading-tight">{resumeData.header.name}</h1>
                <h2 className="font-medium tracking-wide mt-1 text-2xl" style={{ color: theme.color }}>{resumeData.header.jobposition}</h2>
                <div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-4">
                    <p className="flex items-center">
                        <MailIcon color={theme.color} className="w-4 h-4 mr-2" /> 
                        <span>{resumeData.header.email}</span>
                    </p>
                    <p className="flex items-center">
                        <PhoneIcon color={theme.color} className="w-4 h-4 mr-2" /> 
                        <span>{resumeData.header.phone}</span>
                    </p>
                </div>
            </div>
        </header>

        <main className="space-y-6">
            {resumeData.summary && (
                <section>
                    <h2 className="section-title font-bold text-gray-800 border-b-2 pb-1 mb-3 text-xl" style={{borderColor: theme.color}}>{t.summary}</h2>
                    <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </section>
            )}
            
            {resumeData.education && resumeData.education.length > 0 && (
                <section>
                    <h2 className="section-title font-bold text-gray-800 border-b-2 pb-1 mb-3 text-xl" style={{borderColor: theme.color}}>{t.education}</h2>
                    {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-800 text-lg">{edu.education}</h3>
                                <p className="font-medium text-gray-600 text-sm flex-shrink-0">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="font-semibold text-gray-700">{edu.school}, {edu.city}</p>
                            <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && (
                <section>
                    <h2 className="section-title font-bold text-gray-800 border-b-2 pb-1 mb-3 text-xl" style={{borderColor: theme.color}}>{t.experience}</h2>
                    {resumeData.experience.map((exp, index) => ( 
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-800 text-lg">{exp.title}</h3>
                                <p className="font-medium text-gray-600 text-sm flex-shrink-0">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="font-semibold text-gray-700">{exp.company}, {exp.location}</p>
                            <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        </div> 
                    ))}
                </section>
            )}

            {resumeData.skills && resumeData.skills.length > 0 && (
                <section>
                    <h2 className="section-title font-bold text-gray-800 border-b-2 pb-1 mb-3 text-xl" style={{borderColor: theme.color}}>{t.skills}</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {resumeData.skills.map((skill, index) => ( 
                            <p key={index}><strong className="font-semibold text-gray-700">{skill.name}:</strong> {skill.level}</p> 
                        ))}
                    </div>
                </section>
            )}
            
            {resumeData.languages && resumeData.languages.length > 0 && (
                <section>
                    <h2 className="section-title font-bold text-gray-800 border-b-2 pb-1 mb-3 text-xl" style={{borderColor: theme.color}}>{t.languages}</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {resumeData.languages.map((lang, index) => ( 
                            <p key={index}><strong className="font-semibold text-gray-700">{lang.name}:</strong> {lang.level}</p> 
                        ))}
                    </div>
                </section>
            )}
        </main>
    </div>
);

export default ClassicTemplate;

