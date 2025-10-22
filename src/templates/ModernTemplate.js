import React from 'react';
import { MailIcon, PhoneIcon, LocationIcon, UserIcon } from '../components/Icons';

const ModernTemplate = ({ resumeData, theme, t }) => (
    <div className="flex h-full text-sm bg-white overflow-hidden" style={{ fontFamily: `'${theme.font}', sans-serif`}}>
        <div className="w-2/5 p-6 text-white" style={{ backgroundColor: theme.color }}>
             <div className="w-36 h-36 rounded-full mx-auto mb-6 border-4 border-white shadow-lg bg-white/20 flex items-center justify-center">
                {resumeData.header.photo ? (
                    <img src={resumeData.header.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                    <UserIcon className="w-20 h-20 text-white/50" />
                )}
            </div>
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-white/50 pb-1 mb-3">{t.myContact}</h3>
                    <div className="space-y-2 text-xs">
                        <p className="flex items-center"><MailIcon color="white" className="w-4 h-4 mr-2" /> {resumeData.header.email}</p>
                        <p className="flex items-center"><PhoneIcon color="white" className="w-4 h-4 mr-2" /> {resumeData.header.phone}</p>
                        <p className="flex items-center"><LocationIcon color="white" className="w-4 h-4 mr-2" /> {resumeData.header.address}</p>
                    </div>
                </section>
                {resumeData.skills && resumeData.skills.length > 0 && <section>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-white/50 pb-1 mb-3">{t.skills}</h3>
                    <div className="space-y-2 text-xs">
                        {resumeData.skills.map((skill, i) => <p key={i}>{skill.name} <span className="opacity-75">({skill.level})</span></p>)}
                    </div>
                </section>}
                {resumeData.languages && resumeData.languages.length > 0 && <section>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-white/50 pb-1 mb-3">{t.languages}</h3>
                    <div className="space-y-2 text-xs">
                        {resumeData.languages.map((lang, i) => <p key={i}>{lang.name} <span className="opacity-75">({lang.level})</span></p>)}
                    </div>
                </section>}
                {resumeData.hobbies && <section>
                    <h3 className="text-lg font-bold uppercase border-b-2 border-white/50 pb-1 mb-3">{t.hobbies}</h3>
                    <ul className="list-disc list-inside text-xs space-y-1">
                        {typeof resumeData.hobbies === 'string' && resumeData.hobbies.split(',').map(s => s.trim()).map((hobby, i) => <li key={i}>{hobby}</li>)}
                    </ul>
                </section>}
            </div>
        </div>
        
        <div className="w-3/5 p-8 text-gray-800 bg-white flex flex-col">
            <header className="mb-8 text-center" style={{color: theme.color}}>
                 <h1 className="text-5xl font-bold" style={{color: '#333'}}>{resumeData.header.name}</h1>
                 <h2 className="text-2xl font-light">{resumeData.header.jobposition}</h2>
            </header>
            <main className="flex-grow">
                {resumeData.summary && <section className="mb-6">
                    <h3 className="text-xl font-bold uppercase mb-2" style={{color: theme.color}}>{t.aboutMe}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </section>}
                 {resumeData.education && resumeData.education.length > 0 && (
                    <section className="mb-6">
                        <h3 className="text-xl font-bold uppercase mb-2" style={{color: theme.color}}>{t.education}</h3>
                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="text-sm mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold">{edu.education}</h4>
                                    <p className="text-xs text-gray-500 flex-shrink-0">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                <p>{edu.school}, {edu.city}</p>
                                <p className="mt-1 text-gray-600">{edu.description}</p>
                            </div>
                        ))}
                    </section>
                )}
                {resumeData.experience && resumeData.experience.length > 0 && <section className="mb-6">
                    <h3 className="text-xl font-bold uppercase mb-2" style={{color: theme.color}}>{t.experience}</h3>
                    {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                              <div className="flex justify-between items-baseline">
                                  <h4 className="text-md font-bold text-gray-800">{exp.title} | {exp.company}</h4>
                                  <p className="text-xs font-light text-gray-600 flex-shrink-0">{exp.startDate} - {exp.endDate}</p>
                              </div>
                            <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                        </div>
                    ))}
                </section>}
                {resumeData.references && resumeData.references.length > 0 && <section>
                    <h3 className="text-xl font-bold uppercase mb-2" style={{color: theme.color}}>{t.references}</h3>
                    <div className="space-y-3">{resumeData.references.map((ref, index) => (<div key={index}><p className="font-bold">{ref.name}, {ref.company}</p><p className="text-xs text-gray-600">{ref.email} | {ref.phone}</p></div>))}</div>
                </section>}
            </main>
        </div>
    </div>
);

export default ModernTemplate;

