import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, FileText, Info, LayoutDashboard, Stethoscope, Download, Search, PanelRight, X, PenLine, Type, Sparkles, Image as ImageIcon, Loader2, Link2, Plus, Trash2 } from 'lucide-react';
import { trialData, reportOutline, structuralRationale, guidelines } from './data';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'outline' | 'rationale' | 'guidelines'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [hasGeneratedDiagram, setHasGeneratedDiagram] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('medwrite_notes');
    return saved ? JSON.parse(saved) : { overview: '', outline: '', rationale: '', guidelines: '' };
  });
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('medwrite_checklist');
    return saved ? JSON.parse(saved) : {};
  });
  const [citations, setCitations] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('medwrite_citations');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('medwrite_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('medwrite_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('medwrite_citations', JSON.stringify(citations));
  }, [citations]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addCitation = (id: string, citation: string) => {
    if (!citation.trim()) return;
    setCitations(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), citation.trim()]
    }));
  };

  const removeCitation = (id: string, index: number) => {
    setCitations(prev => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index)
    }));
  };

  const exportCurrentView = () => {
    let content = '';
    let filename = '';

    switch (activeTab) {
      case 'overview':
        filename = 'Trial_Overview.txt';
        content += `Clinical Trial Report Planning - Trial Overview\n\n`;
        content += `Title: ${trialData.title}\n`;
        content += `Phase: ${trialData.phase}\n`;
        content += `Investigational Product: ${trialData.drugName}\n\n`;
        content += `Objective:\n${trialData.objective}\n\n`;
        content += `Methodology:\n${trialData.methodology.map(m => `- ${m}`).join('\n')}\n\n`;
        content += `Patient Population:\n${trialData.population.map(p => `- ${p}`).join('\n')}\n\n`;
        content += `Primary Endpoints:\n${trialData.primaryEndpoints.map(e => `- ${e}`).join('\n')}\n\n`;
        content += `Secondary Endpoints:\n${trialData.secondaryEndpoints.map(e => `- ${e}`).join('\n')}\n`;
        break;
      case 'outline':
        filename = 'Report_Outline.txt';
        content += `Clinical Trial Report Planning - Report Outline\n\n`;
        filteredOutline.forEach((section) => {
          content += `${section.title}\n`;
          content += `Description: ${section.description}\n`;
          section.subsections.forEach((sub, idx) => {
            const itemId = `${section.id}-${idx}`;
            const isChecked = checklist[itemId] ? '[x]' : '[ ]';
            content += `  ${isChecked} ${sub}\n`;
            if (citations[itemId] && citations[itemId].length > 0) {
              content += `      Citations:\n`;
              citations[itemId].forEach(cit => {
                content += `      - ${cit}\n`;
              });
            }
          });
          content += '\n';
        });
        break;
      case 'rationale':
        filename = 'Structure_Rationale.txt';
        content += `Clinical Trial Report Planning - Structure Rationale\n\n`;
        content += `Why structure matters in medical writing:\nA well-structured clinical study report (CSR) is critical for regulatory review. It must present complex clinical data accurately, objectively, and transparently, ensuring that reviewers can assess the drug's safety and efficacy without ambiguity.\n\n`;
        structuralRationale.forEach(item => {
          content += `${item.section}\n`;
          content += `${item.rationale}\n\n`;
        });
        break;
      case 'guidelines':
        filename = 'Regulatory_Guidelines.txt';
        content += `Clinical Trial Report Planning - Regulatory Guidelines\n\n`;
        filteredGuidelines.forEach(guide => {
          content += `${guide.name}\n`;
          content += `${guide.description}\n`;
          const guideId = `guide-${guide.id}`;
          if (citations[guideId] && citations[guideId].length > 0) {
            content += `  Citations:\n`;
            citations[guideId].forEach(cit => {
              content += `  - ${cit}\n`;
            });
          }
          content += `Key Principles:\n`;
          guide.keyPoints.forEach((point, idx) => {
            const pointId = `${guide.id}-pt-${idx}`;
            content += `  - ${point}\n`;
            if (citations[pointId] && citations[pointId].length > 0) {
              content += `      Citations:\n`;
              citations[pointId].forEach(cit => {
                content += `      - ${cit}\n`;
              });
            }
          });
          content += '\n';
        });
        break;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerateDiagram = () => {
    setIsGeneratingDiagram(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGeneratingDiagram(false);
      setHasGeneratedDiagram(true);
    }, 2500);
  };

  const filteredOutline = reportOutline.map(section => {
    const matchesSection = section.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedSubsections = section.subsections.filter(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (matchesSection || matchedSubsections.length > 0) {
      return {
        ...section,
        subsections: matchesSection ? section.subsections : matchedSubsections
      };
    }
    return null;
  }).filter(Boolean) as typeof reportOutline;

  const filteredGuidelines = guidelines.map(guide => {
    const matchesGuide = guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedKeyPoints = guide.keyPoints.filter(point => point.toLowerCase().includes(searchQuery.toLowerCase()));

    if (matchesGuide || matchedKeyPoints.length > 0) {
      return {
        ...guide,
        keyPoints: matchesGuide ? guide.keyPoints : matchedKeyPoints
      };
    }
    return null;
  }).filter(Boolean) as typeof guidelines;

  const tSize = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl') => {
    if (fontSize === 'sm') {
      return { xs: 'text-[10px]', sm: 'text-xs', base: 'text-sm', lg: 'text-base', xl: 'text-lg', '2xl': 'text-xl' }[size] || `text-${size}`;
    }
    if (fontSize === 'lg') {
      return { xs: 'text-sm', sm: 'text-base', base: 'text-lg', lg: 'text-xl', xl: 'text-2xl', '2xl': 'text-3xl' }[size] || `text-${size}`;
    }
    return `text-${size}`;
  };

  const getMockAIInsights = (data: typeof trialData) => {
    return [
      `Methodological Rigor: Strong trial architecture utilizing a ${data.methodology[0].toLowerCase()} design across multiple centers to minimize bias.`,
      `Efficacy Focus: Primary endpoint (${data.primaryEndpoints[0].split(' at ')[0]}) directly measures clinical progression, providing a clear efficacy signal.`,
      `Targeted Population: Biomarker-based inclusion criteria (${data.population.find(p => p.includes('PET')) || 'specific imaging'}) enhances the probability of enrolling the correct target population.`,
      `Appropriate Timeline: The ${data.methodology[3].split(' ')[0]} treatment duration is adequate for observing slow-progressing neurodegenerative changes.`
    ];
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-slate-900 text-slate-100 p-6 flex flex-col shadow-xl z-10 shrink-0 md:min-h-screen">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Stethoscope className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">MedWrite</h1>
            <p className="text-xs text-slate-400 font-medium">Intern Workspace</p>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <NavButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="Trial Overview" 
          />
          <NavButton 
            active={activeTab === 'outline'} 
            onClick={() => setActiveTab('outline')} 
            icon={<FileText className="w-4 h-4" />} 
            label="Report Outline" 
          />
          <NavButton 
            active={activeTab === 'rationale'} 
            onClick={() => setActiveTab('rationale')} 
            icon={<Info className="w-4 h-4" />} 
            label="Structure Rationale" 
          />
          <NavButton 
            active={activeTab === 'guidelines'} 
            onClick={() => setActiveTab('guidelines')} 
            icon={<BookOpen className="w-4 h-4" />} 
            label="Regulatory Guidelines" 
          />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
              MW
            </div>
            <div className="text-sm">
              <p className="font-medium">Medical Writer</p>
              <p className="text-xs text-slate-400">Week 1 Task</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto">
          
          <header className="mb-10 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                  Clinical Trial Report Planning
                </h2>
                <p className="text-slate-500">
                  Hypothetical study data and preliminary research outline for clinical reporting.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm shrink-0 h-fit">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-1 rounded text-xs font-medium ${fontSize === 'sm' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Small text"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-1 rounded text-sm font-medium ${fontSize === 'base' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Medium text"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-1 rounded text-base font-medium ${fontSize === 'lg' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Large text"
                  >
                    A
                  </button>
                </div>
                <button
                  onClick={() => setIsNotesOpen(!isNotesOpen)}
                  className={`inline-flex items-center space-x-2 border px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0 h-fit ${isNotesOpen ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <PanelRight className="w-4 h-4" />
                  <span>Notes</span>
                </button>
                <button
                  onClick={exportCurrentView}
                  className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm shrink-0 h-fit"
                >
                  <Download className="w-4 h-4" />
                  <span>Export View</span>
                </button>
              </div>
            </div>
            
            {(activeTab === 'outline' || activeTab === 'guidelines') && (
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search in ${activeTab === 'outline' ? 'Report Outline' : 'Regulatory Guidelines'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                />
              </div>
            )}
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* AI Insight Section */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-indigo-900">AI Insight Analysis</h3>
                  </div>
                  <ul className="space-y-3">
                    {getMockAIInsights(trialData).map((insight, idx) => (
                      <li key={idx} className={`flex items-start space-x-3 text-indigo-800 ${tSize('sm')}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                        <span className="leading-relaxed">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className={`inline-block px-3 py-1 mb-4 ${tSize('xs')} font-semibold text-blue-700 bg-blue-100 rounded-full`}>
                    {trialData.phase} Study
                  </div>
                  <h3 className={`${tSize('2xl')} font-bold mb-1`}>{trialData.title}</h3>
                  <p className={`text-slate-500 font-medium mb-8 ${tSize('sm')}`}>Investigational Product: {trialData.drugName}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <SectionTitle tSize={tSize}>Objective</SectionTitle>
                      <p className={`text-slate-700 leading-relaxed ${tSize('sm')}`}>{trialData.objective}</p>
                    </div>

                    <div>
                      <SectionTitle tSize={tSize}>Methodology</SectionTitle>
                      <ul className="space-y-2">
                        {trialData.methodology.map((item, idx) => (
                          <li key={idx} className={`flex items-start space-x-2 ${tSize('sm')} text-slate-700`}>
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <SectionTitle tSize={tSize}>Patient Population</SectionTitle>
                      <ul className="space-y-2">
                        {trialData.population.map((item, idx) => (
                          <li key={idx} className={`flex items-start space-x-2 ${tSize('sm')} text-slate-700`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <SectionTitle tSize={tSize}>Key Endpoints</SectionTitle>
                      <div className="space-y-4">
                        <div>
                          <h5 className={`${tSize('xs')} font-bold text-slate-900 uppercase tracking-wider mb-2`}>Primary</h5>
                          <ul className="space-y-1">
                            {trialData.primaryEndpoints.map((item, idx) => (
                              <li key={idx} className={`${tSize('sm')} text-slate-700 border-l-2 border-blue-500 pl-3`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className={`${tSize('xs')} font-bold text-slate-900 uppercase tracking-wider mb-2`}>Secondary</h5>
                          <ul className="space-y-2">
                            {trialData.secondaryEndpoints.map((item, idx) => (
                              <li key={idx} className={`${tSize('sm')} text-slate-700 border-l-2 border-slate-200 pl-3`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <SectionTitle tSize={tSize}>Methodology Flowchart</SectionTitle>
                  
                  {!hasGeneratedDiagram && !isGeneratingDiagram && (
                    <div className="mt-4 p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50">
                      <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
                      <p className={`text-slate-600 mb-6 text-center ${tSize('sm')}`}>
                        Generate a visual conceptual flowchart of the methodology using AI.
                      </p>
                      <button
                        onClick={handleGenerateDiagram}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Flowchart</span>
                      </button>
                    </div>
                  )}

                  {isGeneratingDiagram && (
                    <div className="mt-4 p-12 border border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                      <p className={`text-slate-600 font-medium ${tSize('sm')} animate-pulse`}>
                        Synthesizing methodology data and rendering flowchart...
                      </p>
                    </div>
                  )}

                  {hasGeneratedDiagram && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4"
                    >
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex justify-center">
                        <img 
                          src="https://picsum.photos/seed/trialflowchart123/1200/600" 
                          alt="Trial Methodology Conceptual Flowchart" 
                          className="w-full h-auto object-cover opacity-90 mix-blend-multiply"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className={`text-center mt-3 text-slate-500 ${tSize('xs')} italic flex items-center justify-center gap-1.5`}>
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        Conceptual flowchart representing the {trialData.phase} trial methodology (Generated Asset)
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'outline' && (
              <motion.div
                key="outline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filteredOutline.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">No matching sections found.</div>
                ) : filteredOutline.map((section, index) => (
                  <div key={section.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`${tSize('lg')} font-bold text-slate-900`}>{section.title}</h3>
                        <p className={`${tSize('sm')} text-slate-500`}>{section.description}</p>
                      </div>
                    </div>
                    
                    <div className="ml-14 mt-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <ul className="space-y-3">
                        {section.subsections.map((sub, idx) => {
                          const itemId = `${section.id}-${idx}`;
                          const isChecked = checklist[itemId] || false;
                          return (
                            <li key={idx} className="flex flex-col">
                              <div className="flex items-start space-x-3">
                                <button 
                                  onClick={() => toggleChecklistItem(itemId)}
                                  className="focus:outline-none shrink-0 mt-0.5 hover:scale-110 transition-transform"
                                >
                                  {isChecked ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-400 transition-colors" />
                                  )}
                                </button>
                                <span className={`${tSize('sm')} font-medium transition-colors duration-200 ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {sub}
                                </span>
                              </div>
                              <CitationManager
                                itemId={itemId}
                                citations={citations[itemId] || []}
                                onAdd={addCitation}
                                onRemove={removeCitation}
                                tSize={tSize}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'rationale' && (
              <motion.div
                key="rationale"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6"
              >
                <div className={`bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-900 ${tSize('sm')} leading-relaxed mb-4`}>
                  <p className="font-medium flex items-center mb-2">
                    <Info className="w-4 h-4 mr-2" />
                    Why structure matters in medical writing
                  </p>
                  A well-structured clinical study report (CSR) is critical for regulatory review. It must present complex clinical data accurately, objectively, and transparently, ensuring that reviewers can assess the drug's safety and efficacy without ambiguity.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {structuralRationale.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
                      <h4 className={`${tSize('sm')} font-bold text-slate-900 uppercase tracking-wider mb-3`}>{item.section}</h4>
                      <p className={`${tSize('sm')} text-slate-600 flex-1 leading-relaxed`}>{item.rationale}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'guidelines' && (
              <motion.div
                key="guidelines"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {filteredGuidelines.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">No matching guidelines found.</div>
                ) : filteredGuidelines.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <BookOpen className="w-5 h-5 text-indigo-500" />
                      <h3 className={`${tSize('lg')} font-bold text-slate-900`}>{guide.name}</h3>
                    </div>
                    <p className={`${tSize('sm')} text-slate-600 mb-2`}>{guide.description}</p>
                    <div className="mb-5">
                      <CitationManager
                        itemId={`guide-${guide.id}`}
                        citations={citations[`guide-${guide.id}`] || []}
                        onAdd={addCitation}
                        onRemove={removeCitation}
                        tSize={tSize}
                      />
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className={`${tSize('xs')} font-bold text-slate-900 uppercase tracking-wider mb-3`}>Key Principles</h4>
                      <ul className="space-y-4">
                        {guide.keyPoints.map((point, idx) => {
                          const pointId = `${guide.id}-pt-${idx}`;
                          return (
                            <li key={idx} className="flex flex-col">
                              <div className={`flex items-start space-x-2 ${tSize('sm')} text-slate-700`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                <span className="leading-relaxed">{point}</span>
                              </div>
                              <CitationManager
                                itemId={pointId}
                                citations={citations[pointId] || []}
                                onAdd={addCitation}
                                onRemove={removeCitation}
                                tSize={tSize}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Notes Sidebar */}
      <AnimatePresence>
        {isNotesOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-l border-slate-200 shadow-xl flex flex-col shrink-0 overflow-hidden z-20 absolute right-0 top-0 bottom-0 md:relative"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between w-[320px]">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-blue-500" />
                Research Notes
              </h3>
              <button onClick={() => setIsNotesOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 flex flex-col w-[320px]">
              <label className="text-sm font-semibold text-slate-800 mb-2 capitalize">
                {activeTab} Notes
              </label>
              <textarea
                className="flex-1 w-full resize-none p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none shadow-inner transition-colors"
                placeholder={`Type your thoughts, summaries, or questions about ${activeTab} here...`}
                value={notes[activeTab] || ''}
                onChange={(e) => setNotes(prev => ({ ...prev, [activeTab]: e.target.value }))}
              />
              <p className="text-xs text-slate-400 mt-3 text-center">
                Notes are saved automatically to your browser.
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
        active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SectionTitle({ children, tSize }: { children: React.ReactNode, tSize: (size: any) => string }) {
  return (
    <h4 className={`${tSize('sm')} font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2`}>
      {children}
    </h4>
  );
}

function CitationManager({ itemId, citations, onAdd, onRemove, tSize }: { itemId: string, citations: string[], onAdd: (id: string, text: string) => void, onRemove: (id: string, idx: number) => void, tSize: (size: any) => string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCitation, setNewCitation] = useState('');

  const handleAdd = () => {
    if (newCitation.trim()) {
      onAdd(itemId, newCitation);
      setNewCitation('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-2 ml-7 pl-3 border-l-2 border-slate-200">
      {citations.length > 0 && (
        <ul className="space-y-1 mb-2">
          {citations.map((cit, idx) => (
            <li key={idx} className={`flex items-start space-x-2 text-slate-500 ${tSize('xs')}`}>
              <Link2 className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="flex-1 break-words">{cit}</span>
              <button onClick={() => onRemove(itemId, idx)} className="text-slate-400 hover:text-red-500 shrink-0">
                <Trash2 className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {isAdding ? (
        <div className="flex items-center space-x-2 mt-2">
          <input 
            type="text" 
            value={newCitation}
            onChange={(e) => setNewCitation(e.target.value)}
            placeholder="Enter citation (e.g., DOI, URL, or Title)"
            className={`flex-1 border border-slate-200 rounded px-2 py-1 ${tSize('xs')} focus:outline-none focus:border-blue-400`}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button onClick={handleAdd} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Save</button>
          <button onClick={() => { setIsAdding(false); setNewCitation(''); }} className="text-slate-400 hover:text-slate-600 font-medium text-xs">Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)} className={`flex items-center space-x-1 text-slate-400 hover:text-blue-500 ${tSize('xs')} font-medium transition-colors`}>
          <Plus className="w-3 h-3" />
          <span>Add Citation</span>
        </button>
      )}
    </div>
  );
}
