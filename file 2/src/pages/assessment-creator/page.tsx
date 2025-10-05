import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'short-answer' | 'case-analysis' | 'differential';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'extreme';
  category: string;
}

interface Assessment {
  title: string;
  description: string;
  timeLimit: number;
  difficulty: string;
  category: string;
  questions: AssessmentQuestion[];
}

export default function AssessmentCreator() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'create' | 'templates' | 'preview'>('create');
  const [assessment, setAssessment] = useState<Assessment>({
    title: '',
    description: '',
    timeLimit: 30,
    difficulty: 'intermediate',
    category: 'drug-therapy-problems',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion>({
    id: '',
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'intermediate',
    category: 'drug-therapy-problems'
  });
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const assessmentTemplates = [
    {
      id: 'drug-therapy-problems',
      title: 'Drug Therapy Problems Assessment',
      description: 'Identify and resolve medication-related problems in patient care',
      category: 'Clinical Pharmacy',
      difficulty: 'Intermediate',
      questions: 20,
      timeLimit: 35
    },
    {
      id: 'medication-reconciliation',
      title: 'Medication Reconciliation & Safety',
      description: 'Comprehensive medication history and safety evaluation',
      category: 'Pharmaceutical Care',
      difficulty: 'Advanced',
      questions: 25,
      timeLimit: 40
    },
    {
      id: 'pharmacokinetics-dosing',
      title: 'Clinical Pharmacokinetics & Dosing',
      description: 'Dose optimization and therapeutic drug monitoring',
      category: 'Clinical Pharmacology',
      difficulty: 'Advanced',
      questions: 18,
      timeLimit: 45
    },
    {
      id: 'drug-interactions',
      title: 'Drug Interactions & Contraindications',
      description: 'Identify and manage clinically significant drug interactions',
      category: 'Drug Safety',
      difficulty: 'Intermediate',
      questions: 22,
      timeLimit: 30
    },
    {
      id: 'patient-counseling',
      title: 'Patient Counseling & Education',
      description: 'Effective pharmaceutical care communication skills',
      category: 'Patient Care',
      difficulty: 'Basic',
      questions: 15,
      timeLimit: 25
    },
    {
      id: 'specialty-pharmacy',
      title: 'Specialty Pharmacy Practice',
      description: 'Complex disease state management and specialty medications',
      category: 'Specialty Care',
      difficulty: 'Extreme',
      questions: 30,
      timeLimit: 50
    }
  ];

  const questionTypes = [
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Single best answer for clinical scenarios',
      icon: 'ri-checkbox-circle-line'
    },
    {
      id: 'short-answer',
      title: 'Short Answer',
      description: 'Brief clinical reasoning response',
      icon: 'ri-edit-line'
    },
    {
      id: 'case-analysis',
      title: 'Case Analysis',
      description: 'Comprehensive pharmaceutical care plan',
      icon: 'ri-file-text-line'
    },
    {
      id: 'differential',
      title: 'Drug Problem Identification',
      description: 'List potential drug-related problems',
      icon: 'ri-list-check'
    }
  ];

  const categories = [
    'Drug Therapy Problems', 'Medication Reconciliation', 'Clinical Pharmacokinetics', 
    'Drug Interactions', 'Patient Counseling', 'Specialty Pharmacy', 'Pharmacoeconomics',
    'Drug Safety & Monitoring', 'Chronic Disease Management', 'Pain Management',
    'Infectious Diseases', 'Cardiology Pharmacy', 'Oncology Pharmacy', 'Pediatric Pharmacy'
  ];

  const handleAddQuestion = () => {
    if (!currentQuestion.question.trim()) return;

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString()
    };

    if (editingIndex >= 0) {
      const updatedQuestions = [...assessment.questions];
      updatedQuestions[editingIndex] = newQuestion;
      setAssessment({ ...assessment, questions: updatedQuestions });
      setEditingIndex(-1);
    } else {
      setAssessment({
        ...assessment,
        questions: [...assessment.questions, newQuestion]
      });
    }

    // Reset form
    setCurrentQuestion({
      id: '',
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'intermediate',
      category: 'drug-therapy-problems'
    });
  };

  const handleEditQuestion = (index: number) => {
    setCurrentQuestion(assessment.questions[index]);
    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = assessment.questions.filter((_, i) => i !== index);
    setAssessment({ ...assessment, questions: updatedQuestions });
  };

  const handleExportAssessment = () => {
    const assessmentData = {
      ...assessment,
      createdAt: new Date().toISOString(),
      id: Date.now().toString()
    };

    const blob = new Blob([JSON.stringify(assessmentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pharmacy-assessment-${assessment.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (templateId: string) => {
    // Clinical pharmacy focused sample questions
    const sampleQuestions: AssessmentQuestion[] = [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'A 65-year-old patient with heart failure is prescribed furosemide 40mg daily and lisinopril 10mg daily. Lab results show K+ 3.2 mEq/L, Cr 1.8 mg/dL, and BUN 45 mg/dL. What is the most appropriate pharmaceutical care intervention?',
        options: [
          'Increase furosemide dose to 80mg daily',
          'Add potassium chloride 20 mEq daily and monitor electrolytes',
          'Discontinue lisinopril due to elevated creatinine',
          'Switch to hydrochlorothiazide for better potassium sparing'
        ],
        correctAnswer: 'Add potassium chloride 20 mEq daily and monitor electrolytes',
        explanation: 'The patient has hypokalemia (K+ 3.2 mEq/L) likely due to furosemide therapy. Potassium supplementation is indicated with close monitoring. The elevated creatinine may be related to dehydration or ACE inhibitor therapy but discontinuation is not immediately warranted without further assessment.',
        difficulty: 'intermediate',
        category: 'Drug Therapy Problems'
      },
      {
        id: '2',
        type: 'case-analysis',
        question: 'A 45-year-old diabetic patient presents with the following medications: metformin 1000mg BID, glipizide 10mg BID, atorvastatin 40mg daily, lisinopril 20mg daily, and aspirin 81mg daily. Recent labs: HbA1c 9.2%, LDL 95 mg/dL, BP 145/90 mmHg, eGFR 55 mL/min/1.73m². Patient reports frequent hypoglycemic episodes. Identify drug therapy problems and provide pharmaceutical care recommendations.',
        correctAnswer: 'Drug Therapy Problems: 1) Uncontrolled diabetes (HbA1c 9.2%) 2) Hypoglycemia risk with sulfonylurea 3) Uncontrolled hypertension 4) Potential need for renal dose adjustment. Recommendations: Consider reducing glipizide dose or switching to DPP-4 inhibitor, add long-acting insulin, increase lisinopril or add second antihypertensive, monitor renal function closely.',
        explanation: 'Multiple drug therapy problems exist requiring comprehensive pharmaceutical care intervention including medication optimization, dose adjustments, and enhanced monitoring.',
        difficulty: 'advanced',
        category: 'Chronic Disease Management'
      },
      {
        id: '3',
        type: 'multiple-choice',
        question: 'A patient is prescribed warfarin 5mg daily with an INR goal of 2.0-3.0. Current INR is 4.2. The patient reports no bleeding symptoms. What is the most appropriate clinical pharmacy recommendation?',
        options: [
          'Continue current dose and recheck INR in 1 week',
          'Hold warfarin for 1-2 doses, then resume at reduced dose',
          'Administer vitamin K 2.5mg orally',
          'Discontinue warfarin and start dabigatran'
        ],
        correctAnswer: 'Hold warfarin for 1-2 doses, then resume at reduced dose',
        explanation: 'For INR 4.2 without bleeding, the appropriate management is to hold warfarin for 1-2 doses and resume at a lower dose. Vitamin K is reserved for higher INRs or bleeding complications.',
        difficulty: 'intermediate',
        category: 'Drug Safety & Monitoring'
      },
      {
        id: '4',
        type: 'differential',
        question: 'A 72-year-old patient with multiple comorbidities is taking 12 different medications. During medication reconciliation, you identify several potential issues. List the top 5 drug-related problems you would prioritize for intervention.',
        correctAnswer: 'Drug interactions, Inappropriate dosing for age/renal function, Duplicate therapy, Medication adherence issues, Adverse drug reactions',
        explanation: 'In elderly patients with polypharmacy, these are the most common and clinically significant drug-related problems requiring immediate pharmaceutical care intervention.',
        difficulty: 'advanced',
        category: 'Medication Reconciliation'
      }
    ];

    setAssessment({
      ...assessment,
      title: assessmentTemplates.find(t => t.id === templateId)?.title || '',
      questions: sampleQuestions
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Pacifico", serif' }}>
              Clinical Pharmacy Assessment Creator
            </h1>
            <p className="text-teal-100 text-sm">
              Create Pharmaceutical Care & Drug Therapy Problem Assessments
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
            { id: 'create', label: 'Create Assessment', icon: 'ri-add-circle-line' },
            { id: 'templates', label: 'Pharmacy Templates', icon: 'ri-file-copy-line' },
            { id: 'preview', label: 'Preview & Export', icon: 'ri-eye-line' }
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
          {activeMode === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Assessment Settings */}
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="ri-settings-line text-teal-400"></i>
                    Pharmacy Assessment Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Assessment Title</label>
                      <input
                        type="text"
                        value={assessment.title}
                        onChange={(e) => setAssessment({...assessment, title: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="e.g., Drug Therapy Problems in Heart Failure"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea
                        value={assessment.description}
                        onChange={(e) => setAssessment({...assessment, description: e.target.value})}
                        className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                        placeholder="Describe the pharmaceutical care focus and learning objectives"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Time Limit (minutes)</label>
                        <input
                          type="number"
                          value={assessment.timeLimit}
                          onChange={(e) => setAssessment({...assessment, timeLimit: parseInt(e.target.value)})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                          min="10"
                          max="120"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                        <select
                          value={assessment.difficulty}
                          onChange={(e) => setAssessment({...assessment, difficulty: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          <option value="basic">Basic (PharmD Student)</option>
                          <option value="intermediate">Intermediate (PGY1 Resident)</option>
                          <option value="advanced">Advanced (PGY2/Clinical Pharmacist)</option>
                          <option value="extreme">Expert (Board Certification)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Pharmacy Practice Area</label>
                      <select
                        value={assessment.category}
                        onChange={(e) => setAssessment({...assessment, category: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                      >
                        {categories.map(category => (
                          <option key={category} value={category.toLowerCase().replace(' ', '-')}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Question Builder */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <i className="ri-question-line text-teal-400"></i>
                    Add Pharmacy Question
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Question Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {questionTypes.map(type => (
                          <button
                            key={type.id}
                            onClick={() => setCurrentQuestion({...currentQuestion, type: type.id as any})}
                            className={`p-3 rounded-lg text-left transition-colors border ${
                              currentQuestion.type === type.id
                                ? 'border-teal-400 bg-teal-500/20'
                                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <i className={`${type.icon} text-teal-400`}></i>
                              <span className="text-white text-sm font-medium">{type.title}</span>
                            </div>
                            <p className="text-slate-400 text-xs">{type.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Clinical Scenario/Question</label>
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                        className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                        placeholder="Enter your pharmaceutical care scenario or question..."
                      />
                    </div>

                    {currentQuestion.type === 'multiple-choice' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Answer Options</label>
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(currentQuestion.options || [])];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion({...currentQuestion, options: newOptions});
                              }}
                              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: option})}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                currentQuestion.correctAnswer === option
                                  ? 'bg-green-500 text-white'
                                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                              }`}
                            >
                              <i className="ri-check-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type !== 'multiple-choice' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Correct Answer/Key Points</label>
                        <textarea
                          value={currentQuestion.correctAnswer as string}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                          className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                          placeholder="Enter the correct pharmaceutical care intervention or key evaluation points"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Clinical Explanation</label>
                      <textarea
                        value={currentQuestion.explanation}
                        onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                        className="w-full h-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                        placeholder="Provide clinical rationale and pharmaceutical care reasoning"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty Level</label>
                        <select
                          value={currentQuestion.difficulty}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: e.target.value as any})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          <option value="basic">Basic</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="extreme">Expert</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Practice Area</label>
                        <select
                          value={currentQuestion.category}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          {categories.map(category => (
                            <option key={category} value={category.toLowerCase().replace(' ', '-')}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleAddQuestion}
                      disabled={!currentQuestion.question.trim()}
                      className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingIndex >= 0 ? 'Update Question' : 'Add Question'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <i className="ri-list-check text-teal-400"></i>
                    Pharmacy Questions ({assessment.questions.length})
                  </h3>
                  {assessment.questions.length > 0 && (
                    <button
                      onClick={() => setActiveMode('preview')}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      <i className="ri-eye-line mr-1"></i>
                      Preview
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {assessment.questions.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="ri-capsule-line text-4xl text-slate-600 mb-2"></i>
                      <p className="text-slate-400">No pharmacy questions added yet</p>
                      <p className="text-slate-500 text-sm">Create pharmaceutical care questions using the form</p>
                    </div>
                  ) : (
                    assessment.questions.map((question, index) => (
                      <div key={question.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">
                                Q{index + 1}
                              </span>
                              <span className="bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded">
                                {question.type.replace('-', ' ')}
                              </span>
                              <span className="bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded">
                                {question.difficulty}
                              </span>
                            </div>
                            <p className="text-white text-sm font-medium mb-2">
                              {question.question.length > 100 
                                ? question.question.substring(0, 100) + '...' 
                                : question.question}
                            </p>
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="text-slate-400 text-xs">
                                Options: {question.options.filter(opt => opt.trim()).length}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => handleEditQuestion(index)}
                              className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600 transition-colors"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(index)}
                              className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600 transition-colors"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeMode === 'templates' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Clinical Pharmacy Assessment Templates</h2>
                <p className="text-slate-400">
                  Pre-built assessment templates focused on pharmaceutical care and drug therapy management
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessmentTemplates.map((template) => (
                  <div key={template.id} className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                        <p className="text-slate-400 text-sm mb-3">{template.description}</p>
                        <div className="flex gap-2">
                          <span className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs">
                            {template.category}
                          </span>
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                            {template.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-slate-400">Questions:</span>
                        <span className="text-white ml-2">{template.questions}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Time:</span>
                        <span className="text-white ml-2">{template.timeLimit} min</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        loadTemplate(template.id);
                        setActiveMode('create');
                      }}
                      className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeMode === 'preview' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Pharmacy Assessment Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportAssessment}
                      disabled={!assessment.title || assessment.questions.length === 0}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <i className="ri-download-line"></i>
                      Export Assessment
                    </button>
                  </div>
                </div>

                {assessment.title ? (
                  <div className="space-y-6">
                    {/* Assessment Info */}
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{assessment.title}</h3>
                      <p className="text-slate-300 text-sm mb-3">{assessment.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Questions:</span>
                          <span className="text-white ml-2">{assessment.questions.length}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Time Limit:</span>
                          <span className="text-white ml-2">{assessment.timeLimit} min</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Difficulty:</span>
                          <span className="text-white ml-2 capitalize">{assessment.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Practice Area:</span>
                          <span className="text-white ml-2 capitalize">{assessment.category.replace('-', ' ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Questions Preview */}
                    <div className="space-y-4">
                      {assessment.questions.map((question, index) => (
                        <div key={question.id} className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded">
                              Question {index + 1}
                            </span>
                            <span className="bg-slate-600 text-slate-300 text-xs px-2 py-1 rounded">
                              {question.type.replace('-', ' ')}
                            </span>
                            <span className="bg-slate-600 text-slate-3

00 text-xs px-2 py-1 rounded">
                              {question.difficulty}
                            </span>
                          </div>
                          
                          <p className="text-white mb-3">{question.question}</p>
                          
                          {question.type === 'multiple-choice' && question.options && (
                            <div className="space-y-2 mb-3">
                              {question.options.filter(opt => opt.trim()).map((option, optIndex) => (
                                <div key={optIndex} className={`p-2 rounded text-sm ${
                                  option === question.correctAnswer 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                    : 'bg-slate-600 text-slate-300'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {option === question.correctAnswer && (
                                    <i className="ri-check-line ml-2"></i>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.explanation && (
                            <div className="bg-blue-900/20 border border-blue-700 rounded p-3 mt-3">
                              <div className="flex items-center gap-2 mb-1">
                                <i className="ri-lightbulb-line text-blue-400"></i>
                                <span className="text-blue-400 text-sm font-medium">Clinical Explanation</span>
                              </div>
                              <p className="text-blue-300 text-sm">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="ri-capsule-line text-4xl text-slate-600 mb-4"></i>
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">No Assessment to Preview</h3>
                    <p className="text-slate-500 mb-4">Create a pharmacy assessment first to see the preview</p>
                    <button
                      onClick={() => setActiveMode('create')}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Create Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
