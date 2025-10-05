
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

interface SOAPTemplate {
  id: string;
  title: string;
  description: string;
  specialty: string;
  template: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  example: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export default function SOAPGenerator() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'template' | 'practice' | 'review'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [soapNote, setSOAPNote] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [showExample, setShowExample] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [formData, setFormData] = useState({
    patientAge: '',
    patientGender: '',
    chiefComplaint: '',
    specialty: 'internal-medicine',
    difficulty: 'intermediate',
    additionalInfo: ''
  });
  const [generatedSOAP, setGeneratedSOAP] = useState<any>(null);
  const [aiCitations, setAiCitations] = useState<string[]>([]);

  const soapTemplates: SOAPTemplate[] = [
    {
      id: 'general-medicine',
      title: 'General Medicine',
      description: 'Standard internal medicine SOAP note format',
      specialty: 'Internal Medicine',
      template: {
        subjective: 'Chief Complaint:\nHistory of Present Illness:\nReview of Systems:\nPast Medical History:\nMedications:\nAllergies:\nSocial History:\nFamily History:',
        objective: 'Vital Signs:\nGeneral Appearance:\nHEENT:\nCardiovascular:\nPulmonary:\nAbdomen:\nExtremities:\nNeurologic:\nSkin:\nLaboratory/Imaging:',
        assessment: 'Primary Diagnosis:\nSecondary Diagnoses:\nDifferential Diagnosis:\nClinical Reasoning:',
        plan: 'Diagnostic:\nTherapeutic:\nMonitoring:\nPatient Education:\nFollow-up:\nDisposition:'
      },
      example: {
        subjective: 'Chief Complaint: 65-year-old male with chest pain for 3 hours.\n\nHistory of Present Illness: Patient reports sudden onset of crushing substernal chest pain that began 3 hours ago while climbing stairs. Pain is 8/10, radiates to left arm and jaw, associated with diaphoresis and nausea. No relief with rest.\n\nReview of Systems: Positive for dyspnea, diaphoresis, nausea. Negative for fever, palpitations, syncope.\n\nPast Medical History: Hypertension, hyperlipidemia, type 2 diabetes\nMedications: Metformin 1000mg BID, Lisinopril 10mg daily, Atorvastatin 40mg daily\nAllergies: NKDA\nSocial History: 30 pack-year smoking history, quit 5 years ago. Occasional alcohol use.\nFamily History: Father died of MI at age 58, mother with diabetes',
        objective: 'Vital Signs: BP 160/95, HR 105, Temp 98.6°F, RR 22, SpO2 96% on RA\n\nGeneral Appearance: Anxious, diaphoretic male in moderate distress\nHEENT: Normocephalic, atraumatic, PERRLA, no JVD\nCardiovascular: Tachycardic, regular rhythm, no murmurs, rubs, or gallops\nPulmonary: Clear to auscultation bilaterally, no wheezes or crackles\nAbdomen: Soft, non-tender, non-distended, normal bowel sounds\nExtremities: No edema, pulses 2+ bilaterally\nNeurologic: Alert and oriented x3, no focal deficits\nSkin: Diaphoretic, no rashes\n\nLaboratory/Imaging:\n- Troponin I: 3.2 ng/mL (elevated)\n- CK-MB: 18 ng/mL (elevated)\n- ECG: ST elevation in leads V2-V6\n- Chest X-ray: Normal heart size, clear lungs',
        assessment: 'Primary Diagnosis: ST-Elevation Myocardial Infarction (STEMI) - Anterior wall\n\nSecondary Diagnoses:\n1. Hypertension\n2. Type 2 diabetes mellitus\n3. Hyperlipidemia\n\nDifferential Diagnosis: Unstable angina, aortic dissection, pulmonary embolism, pericarditis\n\nClinical Reasoning: Patient presents with classic symptoms of acute coronary syndrome. Elevated cardiac biomarkers and ST elevations in anterior leads confirm STEMI. Risk factors include diabetes, hypertension, hyperlipidemia, and smoking history.',
        plan: 'Diagnostic:\n- Serial troponins and ECGs\n- Echoc cardiogram\n- Lipid panel, HbA1c\n\nTherapeutic:\n- Activate cardiac catheterization lab for primary PCI\n- Dual antiplatelet therapy: ASA 325mg chewed, Clopidogrel 600mg loading dose\n- Anticoagulation: Heparin per protocol\n- Beta-blocker: Metoprolol 25mg BID\n- Statin: Atorvastatin 80mg daily\n\nMonitoring:\n- Continuous cardiac monitoring\n- Hourly vital signs\n- Daily weights and I/Os\n\nPatient Education:\n- Smoking cessation counseling\n- Cardiac diet education\n- Activity restrictions\n\nFollow-up:\n- Cardiology consultation\n- Cardiac rehabilitation referral\n- Primary care follow-up in 1-2 weeks\n\nDisposition: Admit to CCU for monitoring and management'
      }
    },
    {
      id: 'emergency-medicine',
      title: 'Emergency Medicine',
      description: 'Emergency department focused SOAP note',
      specialty: 'Emergency Medicine',
      template: {
        subjective: 'Chief Complaint:\nHistory of Present Illness:\nPertinent Review of Systems:\nPast Medical History:\nMedications:\nAllergies:\nSocial History:',
        objective: 'Vital Signs:\nGeneral Appearance:\nPhysical Examination:\nDiagnostic Studies:',
        assessment: 'Emergency Department Diagnosis:\nDifferential Diagnosis:\nRisk Stratification:',
        plan: 'ED Management:\nDisposition:\nDischarge Instructions:\nFollow-up:\nReturn Precautions:'
      },
      example: {
        subjective: 'Chief Complaint: 28-year-old female with severe abdominal pain.\n\nHistory of Present Illness: Patient reports sudden onset of severe right lower quadrant pain that began 4 hours ago. Pain is sharp, constant, 9/10 severity, with associated nausea and vomiting. No fever, no urinary symptoms. Last menstrual period 2 weeks ago.\n\nPertinent Review of Systems: Positive for nausea, vomiting, anorexia. Negative for fever, dysuria, vaginal bleeding.\n\nPast Medical History: None significant\nMedications: Oral contraceptive pills\nAllergies: NKDA\nSocial History: Non-smoker, occasional alcohol use, sexually active',
        objective: 'Vital Signs: BP 110/70, HR 95, Temp 98.8°F, RR 18, SpO2 99%\n\nGeneral Appearance: Young female in moderate distress due to pain\n\nPhysical Examination:\n- Abdomen: Tender to palpation in RLQ with guarding, positive McBurney\'s point, negative Murphy\'s sign\n- Pelvic: Deferred pending imaging\n- Extremities: No edema\n\nDiagnostic Studies:\n- CBC: WBC 13,500 with left shift\n- BMP: Normal\n- Urinalysis: Normal\n- Beta-hCG: Negative\n- CT abdomen/pelvis: Appendiceal wall thickening with periappendiceal fat stranding',
        assessment: 'Emergency Department Diagnosis: Acute appendicitis\n\nDifferential Diagnosis: Ovarian cyst, ovarian torsion, PID, UTI, gastroenteritis\n\nRisk Stratification: Moderate risk for perforation given duration of symptoms',
        plan: 'ED Management:\n- IV access and fluid resuscitation\n- Pain control with morphine\n- Antiemetics as needed\n- NPO status\n- Surgery consultation\n\nDisposition: Admit for appendectomy\n\nDischarge Instructions: N/A - admitted\n\nFollow-up: Post-operative care per surgery\n\nReturn Precautions: N/A - admitted'
      }
    },
    {
      id: 'psychiatry',
      title: 'Psychiatry',
      description: 'Mental health focused SOAP note format',
      specialty: 'Psychiatry',
      template: {
        subjective: 'Chief Complaint:\nHistory of Present Illness:\nPsychiatric History:\nMedical History:\nMedications:\nSubstance Use:\nSocial History:\nFamily History:',
        objective: 'Vital Signs:\nGeneral Appearance:\nMental Status Examination:\n- Appearance:\n- Behavior:\n- Speech:\n- Mood:\n- Affect:\n- Thought Process:\n- Thought Content:\n- Perceptions:\n- Cognition:\n- Insight:\n- Judgment:',
        assessment: 'Psychiatric Diagnosis:\nMedical Diagnoses:\nRisk Assessment:\nFunctional Assessment:',
        plan: 'Psychopharmacology:\nPsychotherapy:\nSafety Planning:\nFollow-up:\nReferrals:'
      },
      example: {
        subjective: 'Chief Complaint: 32-year-old male with depression and anxiety.\n\nHistory of Present Illness: Patient reports 6-month history of persistent low mood, anhedonia, and excessive worry. Symptoms began after job loss. Reports difficulty sleeping, decreased appetite, fatigue, and concentration problems. Denies suicidal ideation currently but had passive thoughts 2 months ago.\n\nPsychiatric History: Previous episode of depression 5 years ago, treated with sertraline with good response. No hospitalizations.\nMedical History: None significant\nMedications: None currently\nSubstance Use: 2-3 beers on weekends, denies illicit drug use\nSocial History: Recently unemployed, lives alone, limited social support\nFamily History: Mother with depression, father with alcohol use disorder',
        objective: 'Vital Signs: BP 125/80, HR 78, Temp 98.6°F\n\nGeneral Appearance: Well-groomed male appearing stated age\n\nMental Status Examination:\n- Appearance: Casually dressed, good hygiene\n- Behavior: Cooperative, minimal eye contact\n- Speech: Soft, slow rate, normal volume\n- Mood: "Depressed and worried"\n- Affect: Dysthymic, congruent with mood\n- Thought Process: Linear, goal-directed\n- Thought Content: No delusions, denies current SI/HI\n- Perceptions: No hallucinations\n- Cognition: Alert, oriented x3, intact memory\n- Insight: Good - recognizes need for treatment\n- Judgment: Fair - seeking appropriate help',
        assessment: 'Psychiatric Diagnosis: Major Depressive Disorder, recurrent episode, moderate severity with anxious distress\n\nMedical Diagnoses: None\n\nRisk Assessment: Low suicide risk - no current ideation, good insight, seeking treatment\n\nFunctional Assessment: Moderate impairment in occupational and social functioning',
        plan: 'Psychopharmacology:\n- Restart sertraline 50mg daily (previously effective)\n- Monitor for side effects and efficacy\n- Consider dose adjustment in 4-6 weeks\n\nPsychotherapy:\n- Refer for cognitive behavioral therapy\n- Focus on coping skills and job search strategies\n\nSafety Planning:\n- Discussed warning signs and coping strategies\n- Emergency contacts provided\n- Crisis hotline numbers given\n\nFollow-up:\n- Return in 2 weeks for medication monitoring\n- Sooner if symptoms worsen\n\nReferrals:\n- Vocational rehabilitation services\n- Community mental health resources'
      }
    }
  ];

  const specialties = [
    { value: 'internal-medicine', label: 'Internal Medicine' },
    { value: 'emergency-medicine', label: 'Emergency Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'pulmonology', label: 'Pulmonology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'geriatrics', label: 'Geriatrics' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = soapTemplates.find(t => t.id === templateId);
    if (template) {
      setSOAPNote(template.template);
    }
  };

  const handleShowExample = () => {
    const template = soapTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      setSOAPNote(template.example);
      setShowExample(true);
    }
  };

  const handleClearNote = () => {
    const template = soapTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      setSOAPNote(template.template);
      setShowExample(false);
    }
  };

  const handleExportNote = () => {
    const template = soapTemplates.find(t => t.id === selectedTemplate);
    const noteContent = `SOAP NOTE - ${template?.title || 'Clinical Note'}
Generated on: ${new Date().toLocaleDateString()}

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}`;

    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soap-note-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const parseSOAPResponse = (content: string) => {
    // Simple parsing - in production, you'd want more sophisticated parsing
    return {
      subjective: content.includes('Subjective:') ? 
        content.split('Subjective:')[1]?.split('Objective:')[0]?.trim() || 
        'AI-generated comprehensive subjective assessment based on current clinical evidence and guidelines.' :
        'AI-generated comprehensive subjective assessment based on current clinical evidence and guidelines.',
      
      objective: content.includes('Objective:') ? 
        content.split('Objective:')[1]?.split('Assessment:')[0]?.trim() || 
        'AI-generated objective findings based on evidence-based clinical examination protocols.' :
        'AI-generated objective findings based on evidence-based clinical examination protocols.',
      
      assessment: content.includes('Assessment:') ? 
        content.split('Assessment:')[1]?.split('Plan:')[0]?.trim() || 
        'AI-generated clinical assessment with differential diagnosis based on current medical literature.' :
        'AI-generated clinical assessment with differential diagnosis based on current medical literature.',
      
      plan: content.includes('Plan:') ? 
        content.split('Plan:')[1]?.trim() || 
        'AI-generated evidence-based treatment plan following current clinical guidelines and best practices.' :
        'AI-generated evidence-based treatment plan following current clinical guidelines and best practices.'
    };
  };

  const generateAISOAP = async () => {
    try {
      const prompt = `Generate a comprehensive SOAP note for a ${formData.patientAge}-year-old ${formData.patientGender.toLowerCase()} patient presenting with ${formData.chiefComplaint}. ${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}`;

      const { data, error } = await supabase.functions.invoke('perplexity-clinical-generator', {
        body: {
          type: 'soap',
          prompt: prompt,
          difficulty: formData.difficulty,
          specialty: formData.specialty
        }
      });

      if (error) throw error;

      if (data.success) {
        // Parse the AI response into SOAP format
        const soapContent = parseSOAPResponse(data.content);
        setGeneratedSOAP({
          ...soapContent,
          aiGenerated: true,
          specialty: formData.specialty,
          difficulty: formData.difficulty
        });
        setAiCitations(data.citations || []);
      } else {
        throw new Error(data.error || 'Failed to generate AI SOAP note');
      }
    } catch (error) {
      console.error('Error generating AI SOAP:', error);
      // Fallback to static generation
      generateStaticSOAP();
    }
  };

  const generateStaticSOAP = () => {
    // Static SOAP generation as fallback
    const staticSOAP = {
      subjective: `Chief Complaint: ${formData.patientAge}-year-old ${formData.patientGender.toLowerCase()} presents with ${formData.chiefComplaint}.\n\nHistory of Present Illness: Detailed history of the presenting complaint with timeline, associated symptoms, and relevant context.\n\nPast Medical History: Relevant medical history, medications, allergies, and social history.`,
      
      objective: `Vital Signs: Age-appropriate vital signs\nPhysical Examination: Comprehensive physical examination findings relevant to the chief complaint and specialty focus.\nDiagnostic Results: Relevant laboratory, imaging, and other diagnostic test results.`,
      
      assessment: `Primary Diagnosis: Clinical assessment based on presentation\nDifferential Diagnosis: Alternative diagnoses to consider\nClinical Reasoning: Evidence-based reasoning for the primary diagnosis.`,
      
      plan: `Diagnostic: Additional tests or studies needed\nTherapeutic: Treatment plan including medications, procedures, or interventions\nEducation: Patient education and counseling\nFollow-up: Monitoring and follow-up recommendations`
    };
    
    setGeneratedSOAP({
      ...staticSOAP,
      aiGenerated: false,
      specialty: formData.specialty,
      difficulty: formData.difficulty
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    if (useAI) {
      await generateAISOAP();
    } else {
      // Add delay for static generation
      setTimeout(() => {
        generateStaticSOAP();
      }, 1500);
    }
    
    setIsGenerating(false);
  };

  const isFormValid = formData.patientAge && formData.patientGender && formData.chiefComplaint;

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {useAI ? '🤖 AI Generating SOAP Note' : 'Generating SOAP Note'}
          </h2>
          <p className="text-slate-400">
            {useAI ? 'Using evidence-based medical sources and clinical guidelines...' : 'Creating comprehensive clinical documentation...'}
          </p>
          {useAI && (
            <div className="mt-4 text-xs text-slate-500">
              <p>Sources: Clinical Guidelines, Medical Literature, Best Practices</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: '"Pacifico", serif' }}>
              {useAI && <i className="ri-robot-line text-teal-200"></i>}
              SOAP Note Generator
            </h1>
            <p className="text-teal-100 text-sm">
              {useAI ? '🤖 AI-Powered Evidence-Based Documentation' : 'Professional Clinical Documentation'}
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
            { id: 'template', label: 'Template Builder', icon: 'ri-file-text-line' },
            { id: 'practice', label: 'Practice Mode', icon: 'ri-edit-line' },
            { id: 'review', label: 'Review & Export', icon: 'ri-download-line' }
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
          {activeMode === 'template' && !generatedSOAP && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Template Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Select Template</h2>
                {soapTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedTemplate === template.id
                        ? 'border-teal-400 bg-slate-800'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
                    <p className="text-slate-400 text-sm mb-2">{template.description}</p>
                    <span className="inline-block bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs">
                      {template.specialty}
                    </span>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-3 right-3">
                        <i className="ri-check-circle-fill text-teal-400 text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Template Preview */}
              <div className="lg:col-span-2">
                {selectedTemplate ? (
                  <div className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white">
                        {soapTemplates.find(t => t.id === selectedTemplate)?.title} Template
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={handleShowExample}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          <i className="ri-eye-line mr-1"></i>
                          Show Example
                        </button>
                        <button
                          onClick={handleClearNote}
                          className="bg-slate-600 text-white px-3 py-1 rounded text-sm hover:bg-slate-700 transition-colors"
                        >
                          <i className="ri-refresh-line mr-1"></i>
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {Object.entries(soapNote).map(([section, content]) => (
                        <div key={section}>
                          <label className="block text-sm font-medium text-slate-300 mb-2 uppercase">
                            {section}
                          </label>
                          <textarea
                            value={content}
                            onChange={(e) => setSOAPNote({...soapNote, [section]: e.target.value})}
                            className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                            placeholder={`Enter ${section} information...`}
                          />
                        </div>
                      ))}
                    </div>

                    {showExample && (
                      <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <i className="ri-lightbulb-line text-green-400"></i>
                          <span className="text-green-400 font-medium">Example Note Loaded</span>
                        </div>
                        <p className="text-green-300 text-sm">
                          This is a sample SOAP note for reference. You can modify it or use it as a starting point.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-800 rounded-xl p-12 text-center">
                    <i className="ri-file-text-line text-4xl text-slate-600 mb-4"></i>
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">Select a Template</h3>
                    <p className="text-slate-500">Choose a SOAP note template from the left to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMode === 'practice' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Practice Mode</h2>
                <p className="text-slate-400 mb-4">
                  Practice writing SOAP notes with guided prompts and real-time feedback.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Practice</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Practice with random clinical scenarios
                    </p>
                    <button
                      onClick={() => navigate('/case-builder?difficulty=basic')}
                      className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Start Practice Session
                    </button>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Guided Tutorial</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Step-by-step SOAP note writing guide
                    </p>
                    <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
                      Start Tutorial
                    </button>
                  </div>
                </div>
              </div>

              {/* Practice Tips */}
              <div className="bg-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">SOAP Note Writing Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Subjective</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Patient's own words and complaints</li>
                      <li>• History of present illness</li>
                      <li>• Review of systems</li>
                      <li>• Past medical/surgical history</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Objective</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Vital signs and measurements</li>
                      <li>• Physical examination findings</li>
                      <li>• Laboratory and imaging results</li>
                      <li>• Observable data only</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Assessment</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Primary and secondary diagnoses</li>
                      <li>• Differential diagnosis</li>
                      <li>• Clinical reasoning</li>
                      <li>• Problem prioritization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-400 mb-2">Plan</h4>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Diagnostic tests ordered</li>
                      <li>• Treatments and medications</li>
                      <li>• Patient education</li>
                      <li>• Follow-up arrangements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'review' && !generatedSOAP && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Review & Export</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportNote}
                      disabled={!selectedTemplate}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <i className="ri-download-line"></i>
                      Export Note
                    </button>
                  </div>
                </div>

                {selectedTemplate ? (
                  <div className="space-y-6">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {soapTemplates.find(t => t.id === selectedTemplate)?.title} Note
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Generated on: {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    {Object.entries(soapNote).map(([section, content]) => (
                      <div key={section} className="bg-slate-700 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-teal-400 mb-3 uppercase">
                          {section}
                        </h4>
                        <div className="bg-slate-800 rounded p-3">
                          <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                            {content || `No ${section} content entered`}
                          </pre>
                        </div>
                      </div>
                    ))}

                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="ri-information-line text-blue-400"></i>
                        <span className="text-blue-400 font-medium">Export Options</span>
                      </div>
                      <p className="text-blue-300 text-sm">
                        Your SOAP note will be exported as a text file that can be imported into EMR systems or used for documentation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="ri-file-text-line text-4xl text-slate-600 mb-4"></i>
                    <h3 className="text-lg font-semibold text-slate-400 mb-2">No Note to Review</h3>
                    <p className="text-slate-500 mb-4">Create a SOAP note using the Template Builder first</p>
                    <button
                      onClick={() => setActiveMode('template')}
                      className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Go to Template Builder
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI SOAP Generator - shown in all modes when generatedSOAP exists */}
          {generatedSOAP && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* AI Toggle when in template mode */}
              {activeMode === 'template' && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                          <i className="ri-robot-line"></i>
                          AI-Powered SOAP Generation
                        </h3>
                        <p className="text-purple-200 text-sm">
                          Generate evidence-based SOAP notes using current medical literature
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-purple-300">AI Mode</span>
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
              )}

              {/* Generated SOAP Note */}
              <div className="bg-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <i className="ri-file-text-line text-teal-400"></i>
                    Generated SOAP Note
                    {generatedSOAP.aiGenerated && <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI-Generated</span>}
                  </h2>
                  <button
                    onClick={() => {
                      setGeneratedSOAP(null);
                      if (activeMode !== 'template') {
                        setActiveMode('template');
                      }
                    }}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    Generate New
                  </button>
                </div>

                {generatedSOAP.aiGenerated && aiCitations.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                      <i className="ri-links-line"></i>
                      Evidence Sources
                    </h3>
                    <div className="text-xs text-purple-200 space-y-1">
                      {aiCitations.slice(0, 3).map((citation, index) => (
                        <p key={index}>• {citation}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {Object.entries(generatedSOAP).filter(([key]) => ['subjective', 'objective', 'assessment', 'plan'].includes(key)).map(([section, content]) => (
                    <div key={section} className="bg-slate-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-teal-300 mb-3 capitalize flex items-center gap-2">
                        <i className={`ri-${section === 'subjective' ? 'user-voice' : section === 'objective' ? 'stethoscope' : section === 'assessment' ? 'brain' : 'clipboard'}-line`}></i>
                        {section}
                      </h3>
                      <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode specific actions for generated SOAP */}
              {activeMode === 'template' && (
                <div className="max-w-6xl mx-auto">
                  <button
                    onClick={() => {
                      setGeneratedSOAP(null);
                      setActiveMode('review');
                    }}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="ri-download-line text-lg"></i>
                    Export This Note
                  </button>
                </div>
              )}

              {activeMode === 'review' && (
                <div className="max-w-4xl mx-auto">
                  <button
                    onClick={handleExportNote}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <i className="ri-download-line"></i>
                    Export Note
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Input Form - shown only in template mode when no generatedSOAP */}
          {activeMode === 'template' && !generatedSOAP && (
            <div className="max-w-6xl mx-auto mt-8">
              <div className="max-w-2xl mx-auto">
                {/* AI Toggle */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                          <i className="ri-robot-line"></i>
                          AI-Powered SOAP Generation
                        </h3>
                        <p className="text-purple-200 text-sm">
                          Generate evidence-based SOAP notes using current medical literature
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-purple-300">AI Mode</span>
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

                {/* Input Form */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <i className="ri-file-add-line text-teal-400"></i>
                    Generate AI SOAP Note
                    {useAI && <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI-Enhanced</span>}
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Patient Age</label>
                        <input
                          type="number"
                          value={formData.patientAge}
                          onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                          placeholder="Enter age"
                          min="1"
                          max="120"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                        <select
                          value={formData.patientGender}
                          onChange={(e) => setFormData({...formData, patientGender: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Chief Complaint</label>
                      <input
                        type="text"
                        value={formData.chiefComplaint}
                        onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        placeholder="e.g., Chest pain, Shortness of breath, Abdominal pain"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Specialty</label>
                        <select
                          value={formData.specialty}
                          onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          {specialties.map(specialty => (
                            <option key={specialty.value} value={specialty.value}>
                              {specialty.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Complexity</label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-400"
                        >
                          <option value="basic">Basic</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Additional Information (Optional)</label>
                      <textarea
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                        className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                        placeholder="Any additional context, medical history, or specific requirements..."
                      />
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={!isFormValid}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <i className={`${useAI ? 'ri-robot-line' : 'ri-file-text-line'} text-lg`}></i>
                      {useAI ? '🤖 Generate AI SOAP Note' : 'Generate SOAP Note'}
                    </button>

                    {!isFormValid && (
                      <p className="text-red-400 text-sm text-center">
                        Please fill in patient age, gender, and chief complaint.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
