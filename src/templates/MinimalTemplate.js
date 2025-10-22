import React from 'react';

const MinimalTemplate = ({ resumeData, theme, t }) => (
    <div className="p-10 h-full w-full bg-white text-gray-800 text-sm overflow-hidden" style={{ fontFamily: `'${theme.font}', sans-serif` }}>
        <header className="text-center mb-8 border-b pb-4">
            <h1 className="text-5xl font-bold tracking-wider uppercase" style={{ color: theme.color }}>{resumeData.header.name}</h1>
            <h2 className="text-xl font-light tracking-widest mt-2">{resumeData.header.jobposition}</h2>
            <div className="flex justify-center items-center gap-x-6 text-xs mt-4 text-gray-600">
                <span>{resumeData.header.email}</span>
                <span>{resumeData.header.phone}</span>
                <span>{resumeData.header.address}</span>
            </div>
        </header>

        <main className="space-y-6">
            {resumeData.summary && <section>
                <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.summary}</h3>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </section>}
            
            {resumeData.education && resumeData.education.length > 0 && (
                <section>
                    <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.education}</h3>
                    {resumeData.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h4 className="font-bold">{edu.education}</h4>
                                <p className="text-xs text-gray-500 flex-shrink-0">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="text-gray-700">{edu.school}</p>
                            <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {resumeData.experience && resumeData.experience.length > 0 && <section>
                <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.experience}</h3>
                {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-bold">{exp.title} at {exp.company}</h4>
                            <p className="text-xs text-gray-500 flex-shrink-0">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                    </div>
                ))}
            </section>}
            
            {resumeData.languages && resumeData.languages.length > 0 && <section>
                <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.languages}</h3>
                 <div className="flex flex-wrap gap-4">
                    {resumeData.languages.map((lang, i) => (
                        <p key={i} className="text-gray-700"><strong className="font-bold">{lang.name}:</strong> {lang.level}</p>
                    ))}
                </div>
            </section>}

            {resumeData.skills && resumeData.skills.length > 0 && <section>
                <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.skills}</h3>
                 <div className="flex flex-wrap gap-4">
                    {resumeData.skills.map((skill, i) => (
                        <p key={i} className="text-gray-700"><strong className="font-bold">{skill.name}:</strong> {skill.level}</p>
                    ))}
                </div>
            </section>}

            {resumeData.hobbies && <section>
                <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.hobbies}</h3>
                <p className="text-gray-700 leading-relaxed">{resumeData.hobbies}</p>
            </section>}
            
            {resumeData.references && resumeData.references.length > 0 && <section>
                <h3 className="text-lg font-semibold uppercase tracking-widest mb-2" style={{ color: theme.color }}>{t.references}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {resumeData.references.map((ref, i) => (
                        <div key={i}>
                            <p className="font-bold">{ref.name}</p>
                            <p className="text-gray-700">{ref.company}</p>
                            <p className="text-xs text-gray-600">{ref.email} | {ref.phone}</p>
                        </div>
                    ))}
                </div>
            </section>}
        </main>
    </div>
);

export default MinimalTemplate;

