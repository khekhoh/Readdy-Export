import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EvidenceSource {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  pmid?: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  studyType: string;
  recommendation: string;
  clinicalRelevance: number;
  validated: boolean;
  notes?: string;
}

interface ValidationCriteria {
  studyDesign: boolean;
  sampleSize: boolean;
  methodology: boolean;
  statisticalSignificance: boolean;
  clinicalSignificance: boolean;
  applicability: boolean;
}

export default function EvidenceValidator() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'validate' | 'database' | 'guidelines'>('validate');
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceList, setEvidenceList] = useState<EvidenceSource[]>([]);
  const [currentEvidence, setCurrentEvidence] = useState<EvidenceSource>({
    id: '',
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    evidenceLevel: 'B',
    studyType: 'RCT',
    recommendation: '',
    clinicalRelevance: 5,
    validated: false
  });
  const [validationCriteria, setValidationCriteria] = useState<ValidationCriteria>({
    studyDesign: false,
    sampleSize: false,
    methodology: false,
    statisticalSignificance: false,
    clinicalSignificance: false,
    applicability: false
  });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const evidenceLevels = [
    { level: 'A', description: 'High-quality RCTs, systematic reviews, meta-analyses', color: 'text-green-400' },
    { level: 'B', description: 'Well-designed cohort studies, case-control studies', color: 'text-blue-400' },
    { level: 'C', description: 'Case series, expert opinion, consensus statements', color: 'text-yellow-400' },
    { level: 'D', description: 'Anecdotal evidence, case reports', color: 'text-red-400' }
  ];

  const studyTypes = [
    'Randomized Controlled Trial',
    'Systematic Review',
    'Meta-Analysis',
    'Cohort Study',
    'Case-Control Study',
    'Cross-Sectional Study',
    'Case Series',
    'Case Report',
    'Expert Opinion',
    'Clinical Practice Guideline'
  ];

  const pharmacyCategories = [
    'Drug Therapy Problems',
    'Medication Safety',
    'Clinical Pharmacokinetics',
    'Drug Interactions',
    'Adverse Drug Reactions',
    'Pharmaceutical Care',
    'Chronic Disease Management',
    'Pain Management',
    'Infectious Diseases',
    'Cardiology Pharmacy',
    'Oncology Pharmacy',
    'Pediatric Pharmacy',
    'Geriatric Pharmacy',
    'Critical Care Pharmacy'
  ];

  const sampleEvidenceDatabase: EvidenceSource[] = [
    {
      id: '1',
      title: 'Clinical Pharmacist Interventions in Heart Failure Management: A Systematic Review',
      authors: 'Johnson M, Smith K, Brown L, et al.',
      journal: 'Journal of Clinical Pharmacy and Therapeutics',
      year: 2023,
      doi: '10.1111/jcpt.13789',
      pmid: '37123456',
      evidenceLevel: 'A',
      studyType: 'Systematic Review',
      recommendation: 'Clinical pharmacist involvement in heart failure management significantly reduces hospital readmissions (RR 0.72, 95% CI 0.61-0.85) and improves medication adherence.',
      clinicalRelevance: 9,
      validated: true,
      notes: 'High-quality systematic review with 15 RCTs, n=3,247 patients. Strong evidence for pharmaceutical care interventions.'
    },
    {
      id: '2',
      title: 'Drug-Related Problems in Elderly Patients: Impact of Comprehensive Medication Review',
      authors: 'Anderson P, Wilson R, Davis C',
      journal: 'American Journal of Geriatric Pharmacotherapy',
      year: 2023,
      doi: '10.1016/j.amjopharm.2023.04.012',
      pmid: '37234567',
      evidenceLevel: 'B',
      studyType: 'Cohort Study',
      recommendation: 'Comprehensive medication reviews by clinical pharmacists reduce drug-related problems by 68% in elderly patients (p<0.001).',
      clinicalRelevance: 8,
      validated: true,
      notes: 'Large prospective cohort study (n=1,856) with 12-month follow-up. Significant reduction in adverse drug events.'
    },
    {
      id: '3',
      title: 'Warfarin Dosing Algorithms vs Clinical Pharmacist Management: Randomized Trial',
      authors: 'Thompson K, Lee S, Martinez A, et al.',
      journal: 'Clinical Pharmacology & Therapeutics',
      year: 2023,
      doi: '10.1002/cpt.2891',
      pmid: '37345678',
      evidenceLevel: 'A',
      studyType: 'Randomized Controlled Trial',
      recommendation: 'Clinical pharmacist-managed warfarin therapy achieves therapeutic INR faster (5.2 vs 8.1 days, p<0.001) with fewer bleeding complications compared to algorithm-based dosing.',
      clinicalRelevance: 9,
      validated: true,
      notes: 'Multi-center RCT (n=542) demonstrating superior outcomes with pharmacist-managed anticoagulation.'
    },
    {
      id: '4',
      title: 'Medication Reconciliation in Emergency Departments: Impact on Patient Safety',
      authors: 'Garcia R, Patel N, Johnson T',
      journal: 'Emergency Medicine Journal',
      year: 2023,
      doi: '10.1136/emermed-2023-213456',
      pmid: '37456789',
      evidenceLevel: 'B',
      studyType: 'Case-Control Study',
      recommendation: 'Pharmacist-led medication reconciliation in ED reduces medication errors by 73% and prevents potential adverse drug events.',
      clinicalRelevance: 8,
      validated: true,
      notes: 'Case-control study (n=1,200) showing significant improvement in medication accuracy and safety outcomes.'
    }
  ];

  const handleAddEvidence = () => {
    if (!currentEvidence.title.trim() || !currentEvidence.authors.trim()) return;

    const newEvidence = {
      ...currentEvidence,
      id: Date.now().toString(),
      validated: Object.values(validationCriteria).filter(Boolean).length >= 4
    };

    setEvidenceList([...evidenceList, newEvidence]);
    
    // Reset form
    setCurrentEvidence({
      id: '',
      title: '',
      authors: '',
      journal: '',
      year: new Date().getFullYear(),
      evidenceLevel: 'B',
      studyType: 'RCT',
      recommendation: '',
      clinicalRelevance: 5,
      validated: false
    });
    
    setValidationCriteria({
      studyDesign: false,
      sampleSize: false,
      methodology: false,
      statisticalSignificance: false,
      clinicalSignificance: false,
      applicability: false
    });
  };

  const handleValidateEvidence = (evidenceId: string) => {
    setEvidenceList(evidenceList.map(evidence => 
      evidence.id === evidenceId 
        ? { ...evidence, validated: !evidence.validated }
        : evidence
    ));
  };

  const handleExportEvidence = () => {
    const exportData = {
      validatedEvidence: evidenceList.filter(e => e.validated),
      totalEvidence: evidenceList.length,
      validationDate: new Date().toISOString(),
      categories: pharmacyCategories
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence-validation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEvidence = [...evidenceList, ...sampleEvidenceDatabase].filter(evidence => {
    const matchesSearch = evidence.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evidence.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         evidence.journal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const validationScore = Object.values(validationCriteria).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Pacifico", serif' }}>
              Clinical Evidence Validator
            </h1>
            <p className="text-teal-100 text-sm">
              Validate & Manage Pharmaceutical Care Evidence Base
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Home
          </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="bg-teal-600 px-6 py-3">
        <div className="max-w-6xl mx-auto flex gap-4">
          {[
            { id: 'validate', label: 'Evidence Validation', icon: 'ri-shield-check-line' },
            { id: 'database', label: 'Evidence Database', icon: 'ri-database-line' },
            { id: 'guidelines', label: 'Clinical Guidelines', icon: 'ri-book-open-line' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeMode === mode.id
                  ? 'bg-slate-800 text-white'
                  : 'text-teal-100 hover:bg-teal-700'
              }`}
            >
              <i className={mode.icon}></i>
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {activeMode === 'validate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Evidence Input Form */}
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="ri-add-circle-line text-teal-400"></i>
                    Add Evidence Source
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Study Title</label>
                      <input
                        type="text"
                        value={currentEvidence.title}
                        onChange={(e) => setCurrentEvidence({...currentEvidence, title: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="Enter study or guideline title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Authors</label>
                      <input
                        type="text"
                        value={currentEvidence.authors}
                        onChange={(e) => setCurrentEvidence({...currentEvidence, authors: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="Author names (e.g., Smith J, Johnson K, et al.)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Journal</label>
                        <input
                          type="text"
                          value={currentEvidence.journal}
                          onChange={(e) => setCurrentEvidence({...currentEvidence, journal: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                          placeholder="Journal name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                        <input
                          type="number"
                          value={currentEvidence.year}
                          onChange={(e) => setCurrentEvidence({...currentEvidence, year: parseInt(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                          min="1990"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">DOI (Optional)</label>
                        <input
                          type="text"
                          value={currentEvidence.doi || ''}
                          onChange={(e) => setCurrentEvidence({...currentEvidence, doi: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                          placeholder="10.1111/example"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">PMID (Optional)</label>
                        <input
                          type="text"
                          value={currentEvidence.pmid || ''}
                          onChange={(e) => setCurrentEvidence({...currentEvidence, pmid: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                          placeholder="PubMed ID"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Evidence Level</label>
                        <select
                          value={currentEvidence.evidenceLevel}
                          onChange={(e) => setCurrentEvidence({...currentEvidence, evidenceLevel: e.target.value as any})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          {evidenceLevels.map(level => (
                            <option key={level.level} value={level.level}>
                              Level {level.level} - {level.description.split(',')[0]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Study Type</label>
                        <select
                          value={currentEvidence.studyType}
                          onChange={(e) => setCurrentEvidence({...currentEvidence, studyType: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          {studyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Clinical Recommendation</label>
                      <textarea
                        value={currentEvidence.recommendation}
                        onChange={(e) => setCurrentEvidence({...currentEvidence, recommendation: e.target.value})}
                        className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                        placeholder="Key clinical recommendation or finding from this evidence"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Clinical Relevance: {currentEvidence.clinicalRelevance}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentEvidence.clinicalRelevance}
                        onChange={(e) => setCurrentEvidence({...currentEvidence, clinicalRelevance: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Validation Criteria */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="ri-shield-check-line text-teal-400"></i>
                    Validation Criteria
                    <span className={`ml-auto text-sm px-2 py-1 rounded ${
                      validationScore >= 4 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {validationScore}/6 Criteria Met
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(validationCriteria).map(([criterion, checked]) => (
                      <label key={criterion} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setValidationCriteria({
                            ...validationCriteria,
                            [criterion]: e.target.checked
                          })}
                          className="w-4 h-4 text-teal-500 bg-slate-700 border-slate-600 rounded focus:ring-teal-400"
                        />
                        <span className="text-slate-300 text-sm capitalize">
                          {criterion.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-information-line text-blue-400"></i>
                      <span className="text-blue-400 text-sm font-medium">Validation Status</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      {validationScore >= 4 
                        ? 'Evidence meets validation criteria and can be considered reliable for clinical practice.'
                        : 'Evidence requires additional validation before use in clinical decision-making.'}
                    </p>
                  </div>

                  <button
                    onClick={handleAddEvidence}
                    disabled={!currentEvidence.title.trim() || !currentEvidence.authors.trim()}
                    className="w-full mt-4 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Evidence Database
                  </button>
                </div>
              </div>

              {/* Evidence Levels Guide */}
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="ri-guide-line text-teal-400"></i>
                    Evidence Level Guide
                  </h3>

                  <div className="space-y-4">
                    {evidenceLevels.map(level => (
                      <div key={level.level} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-lg font-bold ${level.color}`}>
                            Level {level.level}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Validation Checklist</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-teal-400 mt-0.5"></i>
                      <div>
                        <span className="text-white font-medium">Study Design:</span>
                        <p className="text-slate-400">Appropriate methodology for research question</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-teal-400 mt-0.5"></i>
                      <div>
                        <span className="text-white font-medium">Sample Size:</span>
                        <p className="text-slate-400">Adequate power to detect clinically meaningful differences</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-teal-400 mt-0.5"></i>
                      <div>
                        <span className="text-white font-medium">Methodology:</span>
                        <p className="text-slate-400">Clear methods, appropriate controls, minimal bias</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-teal-400 mt-0.5"></i>
                      <div>
                        <span className="text-white font-medium">Statistical Significance:</span>
                        <p className="text-slate-400">Appropriate statistical analysis and interpretation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-teal-400 mt-0.5"></i>
                      <div>
                        <span className="text-white font-medium">Clinical Significance:</span>
                        <p className="text-slate-400">Results have meaningful clinical impact</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <i className="ri-check-line text-teal-400 mt-0.5"></i>
                      <div>
                        <span className="text-white font-medium">Applicability:</span>
                        <p className="text-slate-400">Results applicable to target patient population</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'database' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Evidence Database</h2>
                  <button
                    onClick={handleExportEvidence}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <i className="ri-download-line"></i>
                    Export Database
                  </button>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
                      placeholder="Search evidence by title, author, or journal..."
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="all">All Categories</option>
                    {pharmacyCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-teal-400">{filteredEvidence.length}</div>
                    <div className="text-slate-400 text-sm">Total Evidence</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {filteredEvidence.filter(e => e.validated).length}
                    </div>
                    <div className="text-slate-400 text-sm">Validated</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {filteredEvidence.filter(e => e.evidenceLevel === 'A').length}
                    </div>
                    <div className="text-slate-400 text-sm">Level A Evidence</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {filteredEvidence.filter(e => e.year >= 2020).length}
                    </div>
                    <div className="text-slate-400 text-sm">Recent (2020+)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEvidence.length === 0 ? (
                  <div className="bg-slate-800 rounded-xl p-12 text-center">
                    <i className="ri-database-line text-4xl text-slate-600 mb-4"></i>
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">No Evidence Found</h3>
                    <p className="text-slate-500">Add evidence sources or adjust your search criteria</p>
                  </div>
                ) : (
                  filteredEvidence.map((evidence) => (
                    <div key={evidence.id} className="bg-slate-800 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              evidence.evidenceLevel === 'A' ? 'bg-green-500/20 text-green-400' :
                              evidence.evidenceLevel === 'B' ? 'bg-blue-500/20 text-blue-400' :
                              evidence.evidenceLevel === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              Level {evidence.evidenceLevel}
                            </span>
                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                              {evidence.studyType}
                            </span>
                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                              {evidence.year}
                            </span>
                            {evidence.validated && (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center gap-1">
                                <i className="ri-shield-check-line"></i>
                                Validated
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white mb-2">{evidence.title}</h3>
                          <p className="text-slate-400 text-sm mb-2">{evidence.authors}</p>
                          <p className="text-slate-500 text-sm mb-3">
                            <span className="italic">{evidence.journal}</span> ({evidence.year})
                            {evidence.doi && (
                              <span className="ml-2">DOI: {evidence.doi}</span>
                            )}
                          </p>
                          
                          <div className="bg-slate-700 rounded-lg p-3 mb-3">
                            <p className="text-slate-300 text-sm">{evidence.recommendation}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Relevance:</span>
                              <div className="flex gap-1">
                                {[...Array(10)].map((_, i) => (
                                  <i key={i} className={`ri-star-${i < evidence.clinicalRelevance ? 'fill' : 'line'} text-xs ${
                                    i < evidence.clinicalRelevance ? 'text-yellow-400' : 'text-slate-600'
                                  }`}></i>
                                ))}
                              </div>
                              <span className="text-white ml-1">{evidence.clinicalRelevance}/10</span>
                            </div>
                          </div>
                          
                          {evidence.notes && (
                            <div className="mt-3 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                              <p className="text-blue-300 text-sm">{evidence.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleValidateEvidence(evidence.id)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              evidence.validated
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                            }`}
                          >
                            <i className={`ri-shield-${evidence.validated ? 'check' : 'line'}-line mr-1`}></i>
                            {evidence.validated ? 'Validated' : 'Validate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeMode === 'guidelines' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Clinical Practice Guidelines</h2>
                <p className="text-slate-400">
                  Evidence-based clinical practice guidelines for pharmaceutical care
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Heart Failure Medication Management',
                    organization: 'American College of Cardiology',
                    year: 2023,
                    level: 'A',
                    summary: 'Comprehensive guidelines for pharmacist-managed heart failure therapy including ACE inhibitors, beta-blockers, and diuretics optimization.',
                    keyRecommendations: [
                      'Clinical pharmacist involvement in medication titration',
                      'Regular monitoring of electrolytes and renal function',
                      'Patient education on medication adherence'
                    ]
                  },
                  {
                    title: 'Anticoagulation Management',
                    organization: 'American Society of Health-System Pharmacists',
                    year: 2023,
                    level: 'A',
                    summary: 'Evidence-based recommendations for pharmacist-managed anticoagulation services including warfarin and DOAC management.',
                    keyRecommendations: [
                      'Pharmacist-led anticoagulation clinics improve outcomes',
                      'Regular INR monitoring and dose adjustments',
                      'Patient counseling on drug interactions'
                    ]
                  },
                  {
                    title: 'Diabetes Medication Optimization',
                    organization: 'American Diabetes Association',
                    year: 2023,
                    level: 'A',
                    summary: 'Clinical pharmacist role in diabetes management including medication selection, dosing, and monitoring.',
                    keyRecommendations: [
                      'Individualized medication therapy management',
                      'Continuous glucose monitoring integration',
                      'Hypoglycemia prevention strategies'
                    ]
                  },
                  {
                    title: 'Pain Management Guidelines',
                    organization: 'American Pain Society',
                    year: 2023,
                    level: 'B',
                    summary: 'Pharmaceutical care approaches to chronic pain management with emphasis on opioid stewardship.',
                    keyRecommendations: [
                      'Multimodal pain management approaches',
                      'Opioid risk assessment and monitoring',
                      'Non-pharmacological therapy integration'
                    ]
                  },
                  {
                    title: 'Medication Reconciliation Standards',
                    organization: 'Joint Commission',
                    year: 2023,
                    level: 'A',
                    summary: 'Standards for medication reconciliation processes across care transitions with pharmacist involvement.',
                    keyRecommendations: [
                      'Comprehensive medication history collection',
                      'Discrepancy identification and resolution',
                      'Patient and provider communication'
                    ]
                  },
                  {
                    title: 'Infectious Disease Pharmacotherapy',
                    organization: 'Infectious Diseases Society of America',
                    year: 2023,
                    level: 'A',
                    summary: 'Clinical pharmacist role in antimicrobial stewardship and infectious disease management.',
                    keyRecommendations: [
                      'Antimicrobial stewardship program participation',
                      'Therapeutic drug monitoring',
                      'Resistance pattern monitoring'
                    ]
                  }
                ].map((guideline, index) => (
                  <div key={index} className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            guideline.level === 'A' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            Level {guideline.level}
                          </span>
                          <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                            {guideline.year}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{guideline.title}</h3>
                        <p className="text-slate-400 text-sm mb-3">{guideline.organization}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{guideline.summary}</p>
                    
                    <div>
                      <h4 className="text-white font-medium mb-2 text-sm">Key Recommendations:</h4>
                      <ul className="space-y-1">
                        {guideline.keyRecommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2 text-sm">
                            <i className="ri-check-line text-teal-400 mt-0.5 text-xs"></i>
                            <span className="text-slate-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <button className="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600 transition-colors">
                        <i className="ri-external-link-line mr-1"></i>
                        View Full Guideline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}