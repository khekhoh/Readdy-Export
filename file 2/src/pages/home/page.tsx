
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'random' | 'custom'>('random');
  const [useAI, setUseAI] = useState<boolean>(true);
  const [customCase, setCustomCase] = useState({
    age: '',
    gender: '',
    diagnosis: '',
    chiefComplaint: '',
    medicalHistory: ''
  });

  const difficultyLevels = [
    {
      id: 'basic',
      title: 'Basic',
      description: 'Straightforward presentations with clear diagnoses',
      features: ['Single diagnosis focus', 'Standard treatment protocols', 'Basic monitoring requirements'],
      color: 'from-teal-400 to-teal-600',
      icon: 'ri-user-line'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Multiple comorbidities with treatment considerations',
      features: ['2-3 active problems', 'Drug interactions', 'Adjusted monitoring'],
      color: 'from-blue-400 to-blue-600',
      icon: 'ri-pulse-line'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Complex multi-system involvement with complications',
      features: ['Multiple organ systems', 'Treatment complications', 'Specialist coordination'],
      color: 'from-purple-400 to-purple-600',
      icon: 'ri-brain-line'
    },
    {
      id: 'extreme',
      title: 'Extreme',
      description: 'Critical care scenarios with multiple competing priorities',
      features: ['Life-threatening conditions', 'Conflicting treatment goals', 'Intensive monitoring'],
      color: 'from-red-400 to-red-600',
      icon: 'ri-heart-pulse-line'
    }
  ];

  const handleGenerateCase = () => {
    if (selectedDifficulty) {
      let url = `/case-builder?difficulty=${selectedDifficulty}`;
      
      if (useAI) {
        url += '&ai=true';
      }
      
      if (activeTab === 'custom') {
        const customData = encodeURIComponent(JSON.stringify(customCase));
        url += `&custom=${customData}`;
      }
      
      navigate(url);
    }
  };

  const isCustomCaseValid = customCase.age && customCase.gender && customCase.diagnosis && customCase.chiefComplaint;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
            Clinical Case Generator
          </h1>
          <p className="text-teal-100 text-sm">
            🤖 AI-Powered Evidence-Based Cases with Enhanced SOAP Notes & Clinical Reasoning
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-teal-600 px-6 py-3">
        <div className="max-w-4xl mx-auto flex gap-4 overflow-x-auto">
          {[
            { name: 'Case Builder', active: true },
            { name: 'SOAP Note Generator', path: '/soap-generator' },
            { name: 'Assessment Creator', path: '/assessment-creator' },
            { name: 'Evidence Validator', path: '/evidence-validator' },
            { name: 'Library', path: '/library' }
          ].map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => tab.path && navigate(tab.path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                index === 0 
                  ? 'bg-slate-800 text-white' 
                  : 'text-teal-100 hover:bg-teal-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* AI Toggle */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <i className="ri-robot-line"></i>
                    AI-Powered Content Generation
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Generate evidence-based clinical cases using Perplexity AI with real medical sources
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-purple-300">
                    <span className="flex items-center gap-1">
                      <i className="ri-check-line text-green-400"></i>
                      PubMed Research
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-check-line text-green-400"></i>
                      Clinical Guidelines
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-check-line text-green-400"></i>
                      Evidence Citations
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-purple-300">AI Generation</span>
                  <button
                    onClick={() => setUseAI(!useAI)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      useAI ? 'bg-purple-500' : 'bg-slate-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        useAI ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Case Type Selection */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('random')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'random'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <i className="ri-dice-line mr-2"></i>
                Random Case
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'custom'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <i className="ri-edit-line mr-2"></i>
                Custom Case
              </button>
            </div>

            {activeTab === 'random' ? (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-teal-400 mb-4">
                  {useAI ? '🤖 AI-Generated Clinical Case' : 'Random Clinical Case'}
                </h2>
                <p className="text-slate-400 mb-8">
                  {useAI 
                    ? 'Generate evidence-based cases using real medical research and clinical guidelines'
                    : 'Generate comprehensive, tiered-difficulty clinical cases with detailed reasoning and exact references'
                  }
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-teal-400 mb-4 text-center">
                  {useAI ? '🤖 AI-Powered Custom Case' : 'Create Custom Case'}
                </h2>
                <p className="text-slate-400 mb-8 text-center">
                  {useAI 
                    ? 'Input patient details and let AI generate evidence-based clinical scenarios'
                    : 'Input your own patient demographics and diagnosis to generate a personalized clinical case'
                  }
                </p>
                
                {/* Custom Case Form */}
                <div className="bg-slate-800 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <i className="ri-user-add-line text-teal-400"></i>
                    Patient Information
                    {useAI && <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI-Enhanced</span>}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                      <input
                        type="number"
                        value={customCase.age}
                        onChange={(e) => setCustomCase({...customCase, age: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="Enter patient age"
                        min="1"
                        max="120"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                      <select
                        value={customCase.gender}
                        onChange={(e) => setCustomCase({...customCase, gender: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Primary Diagnosis</label>
                      <input
                        type="text"
                        value={customCase.diagnosis}
                        onChange={(e) => setCustomCase({...customCase, diagnosis: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="e.g., Acute myocardial infarction, Pneumonia, Diabetes mellitus"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Chief Complaint</label>
                      <input
                        type="text"
                        value={customCase.chiefComplaint}
                        onChange={(e) => setCustomCase({...customCase, chiefComplaint: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="e.g., Chest pain for 2 hours, Shortness of breath, Abdominal pain"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Medical History (Optional)</label>
                      <textarea
                        value={customCase.medicalHistory}
                        onChange={(e) => setCustomCase({...customCase, medicalHistory: e.target.value})}
                        className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                        placeholder="e.g., Hypertension, diabetes, previous MI, medications..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Difficulty Level Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {difficultyLevels.map((level) => (
                <div
                  key={level.id}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`relative p-6 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedDifficulty === level.id
                      ? 'border-teal-400 bg-slate-800'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mb-4`}>
                    <i className={`${level.icon} text-white text-xl`}></i>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{level.title}</h4>
                  <p className="text-slate-400 text-sm mb-4">{level.description}</p>
                  <ul className="space-y-1">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                        <i className="ri-check-line text-teal-400 text-xs"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {selectedDifficulty === level.id && (
                    <div className="absolute top-3 right-3">
                      <i className="ri-check-circle-fill text-teal-400 text-xl"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleGenerateCase}
              disabled={!selectedDifficulty || (activeTab === 'custom' && !isCustomCaseValid)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              <i className={`${useAI ? 'ri-robot-line' : (activeTab === 'random' ? 'ri-dice-line' : 'ri-add-circle-line')} text-lg`}></i>
              {useAI ? '🤖 Generate AI Case' : (activeTab === 'random' ? 'Generate Random Case' : 'Generate Custom Case')}
            </button>
            {activeTab === 'custom' && !isCustomCaseValid && (
              <p className="text-red-400 text-sm mt-2">
                Please fill in age, gender, diagnosis, and chief complaint to generate a custom case.
              </p>
            )}
          </div>

          {/* Context Information */}
          {selectedDifficulty && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {difficultyLevels.find(l => l.id === selectedDifficulty)?.title} Level Context
                {useAI && <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI-Enhanced</span>}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-slate-400 font-medium">Complexity:</span>
                  <p className="text-slate-300 mt-1">
                    {selectedDifficulty === 'basic' && 'Single primary diagnosis with straightforward management'}
                    {selectedDifficulty === 'intermediate' && 'Multiple comorbidities requiring coordinated care'}
                    {selectedDifficulty === 'advanced' && 'Complex multi-system disease with complications'}
                    {selectedDifficulty === 'extreme' && 'Critical care with competing treatment priorities'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Learning Objective:</span>
                  <p className="text-slate-300 mt-1">
                    {selectedDifficulty === 'basic' && 'Apply basic clinical reasoning and standard treatment protocols'}
                    {selectedDifficulty === 'intermediate' && 'Manage multiple conditions with drug interactions'}
                    {selectedDifficulty === 'advanced' && 'Coordinate complex care across specialties'}
                    {selectedDifficulty === 'extreme' && 'Prioritize interventions in critical situations'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Assessment Focus:</span>
                  <p className="text-slate-300 mt-1">
                    {selectedDifficulty === 'basic' && 'Core knowledge application and guideline adherence'}
                    {selectedDifficulty === 'intermediate' && 'Clinical decision-making with multiple variables'}
                    {selectedDifficulty === 'advanced' && 'Advanced problem-solving and risk stratification'}
                    {selectedDifficulty === 'extreme' && 'Critical thinking under pressure with ethical considerations'}
                  </p>
                </div>
              </div>
              {useAI && (
                <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
                  <p className="text-purple-200 text-sm">
                    <i className="ri-sparkle-line mr-2"></i>
                    AI will generate evidence-based content using current medical literature, clinical guidelines, and research from trusted sources like PubMed, UpToDate, and major medical journals.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
