
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY
);

interface CaseData {
  patientInfo: {
    age: number;
    gender: string;
    chiefComplaint: string;
  };
  history: string;
  physicalExam: string;
  vitals: {
    bp: string;
    hr: number;
    temp: number;
    rr: number;
    spo2: number;
  };
  labResults: string;
  imaging: string;
  difficulty: string;
  aiGenerated?: boolean;
  citations?: string[];
}

interface CustomCaseData {
  age: string;
  gender: string;
  diagnosis: string;
  chiefComplaint: string;
  medicalHistory: string;
}

export default function CaseBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = searchParams.get('difficulty') || 'basic';
  const customData = searchParams.get('custom');
  const useAI = searchParams.get('ai') === 'true';
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [userAnswer, setUserAnswer] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [showAnswer, setShowAnswer] = useState(false);
  const [aiCitations, setAiCitations] = useState<string[]>([]);

  const generateAICase = async (customInfo?: CustomCaseData) => {
    try {
      let prompt = '';
      
      if (customInfo) {
        prompt = `Generate a comprehensive clinical case for a ${customInfo.age}-year-old ${customInfo.gender.toLowerCase()} patient with ${customInfo.diagnosis}. Chief complaint: ${customInfo.chiefComplaint}. ${customInfo.medicalHistory ? `Medical history: ${customInfo.medicalHistory}` : ''}`;
      } else {
        // Generate random case based on difficulty
        const scenarios = {
          basic: 'acute myocardial infarction in a middle-aged patient with chest pain',
          intermediate: 'heart failure exacerbation in an elderly patient with multiple comorbidities',
          advanced: 'sepsis with multi-organ dysfunction in a complex patient',
          extreme: 'acute pancreatitis with systemic complications and alcohol withdrawal'
        };
        prompt = `Generate a comprehensive clinical case involving ${scenarios[difficulty as keyof typeof scenarios]}`;
      }

      const { data, error } = await supabase.functions.invoke('perplexity-clinical-generator', {
        body: {
          type: 'case',
          prompt: prompt,
          difficulty: difficulty,
          specialty: 'internal medicine'
        }
      });

      if (error) throw error;

      if (data.success) {
        const aiContent = data.content;
        const citations = data.citations || [];
        const parsedCase = parseAIResponse(aiContent, difficulty);
        parsedCase.aiGenerated = true;
        parsedCase.citations = citations;
        setCaseData(parsedCase);
        setAiCitations(citations);
      } else {
        throw new Error(data.error || 'Failed to generate AI case');
      }
    } catch (error) {
      console.error('Error generating AI case:', error);
      generateStaticCase(customInfo);
    }
  };

  const parseAIResponse = (content: string, difficulty: string): CaseData => {
    const ageMatch = content.match(/(\d+)[-\s]year[-\s]old/i);
    const genderMatch = content.match(/(male|female|man|woman)/i);
    const complaintMatch = content.match(/chief complaint[:\s]+([^\.]+)/i);
    
    return {
      patientInfo: {
        age: ageMatch ? parseInt(ageMatch[1]) : 65,
        gender: genderMatch ? (genderMatch[1].toLowerCase().includes('f') ? 'Female' : 'Male') : 'Male',
        chiefComplaint: complaintMatch ? complaintMatch[1].trim() : 'Generated from AI clinical case'
      },
      history: content.substring(0, Math.min(500, content.length)) + '...',
      physicalExam: 'AI-generated comprehensive physical examination findings based on current medical evidence and clinical guidelines.',
      vitals: {
        bp: difficulty === 'extreme' ? '85/50' : difficulty === 'advanced' ? '90/60' : '130/80',
        hr: difficulty === 'extreme' ? 135 : difficulty === 'advanced' ? 125 : 95,
        temp: difficulty === 'extreme' ? 102.8 : difficulty === 'advanced' ? 101.2 : 98.6,
        rr: difficulty === 'extreme' ? 32 : difficulty === 'advanced' ? 28 : 20,
        spo2: difficulty === 'extreme' ? 88 : difficulty === 'advanced' ? 90 : 96
      },
      labResults: 'AI-generated laboratory results based on evidence-based clinical scenarios and current diagnostic standards.',
      imaging: 'AI-generated imaging findings consistent with clinical presentation and evidence-based diagnostic approaches.',
      difficulty: difficulty,
      aiGenerated: true
    };
  };

  const generateStaticCase = (customInfo?: CustomCaseData) => {
    if (customInfo) {
      const generatedCase = generateCustomCase(customInfo, difficulty);
      setCaseData(generatedCase);
    } else {
      const cases = {
        basic: {
          patientInfo: {
            age: 45,
            gender: 'Male',
            chiefComplaint: 'Chest pain for 2 hours'
          },
          history: 'Patient presents with sudden onset of crushing chest pain that started 2 hours ago while watching TV. Pain is substernal, radiates to left arm, associated with diaphoresis and nausea. No previous cardiac history. Smokes 1 pack per day for 20 years.',
          physicalExam: 'Alert, anxious appearing male in mild distress. Diaphoretic. Heart sounds regular, no murmurs. Lungs clear bilaterally. No peripheral edema.',
          vitals: {
            bp: '150/95',
            hr: 102,
            temp: 98.6,
            rr: 20,
            spo2: 98
          },
          labResults: 'Troponin I: 2.5 ng/mL (elevated), CK-MB: 15 ng/mL (elevated), CBC: WNL, BMP: Glucose 140 mg/dL, otherwise normal',
          imaging: 'ECG: ST elevation in leads II, III, aVF. Chest X-ray: Normal heart size, clear lungs',
          difficulty: 'basic'
        },
        intermediate: {
          patientInfo: {
            age: 68,
            gender: 'Female',
            chiefComplaint: 'Shortness of breath and leg swelling'
          },
          history: 'Patient with history of diabetes mellitus type 2, hypertension, and previous MI (2 years ago) presents with progressive dyspnea on exertion over 3 weeks, now occurring at rest. Reports 10-pound weight gain, bilateral leg swelling, and orthopnea. Takes metformin, lisinopril, and aspirin.',
          physicalExam: 'Elderly female in moderate respiratory distress. JVD to 8 cm. Heart sounds: S3 gallop present, 2/6 systolic murmur. Lungs: bilateral crackles to mid-lung fields. Extremities: 2+ pitting edema to knees bilaterally.',
          vitals: {
            bp: '110/70',
            hr: 110,
            temp: 98.2,
            rr: 24,
            spo2: 92
          },
          labResults: 'BNP: 850 pg/mL (elevated), Creatinine: 1.8 mg/dL (elevated from baseline 1.2), HbA1c: 8.2%, Troponin: negative',
          imaging: 'Chest X-ray: Cardiomegaly, bilateral pulmonary edema. Echo: EF 35%, regional wall motion abnormalities',
          difficulty: 'intermediate'
        },
        advanced: {
          patientInfo: {
            age: 72,
            gender: 'Male',
            chiefComplaint: 'Confusion and difficulty breathing'
          },
          history: 'Patient with COPD, CHF (EF 30%), CKD stage 3, and recent pneumonia (treated 2 weeks ago) presents with altered mental status for 2 days. Family reports increased confusion, decreased oral intake, and worsening dyspnea. Recent medications include antibiotics, prednisone taper, and usual cardiac medications.',
          physicalExam: 'Elderly male, lethargic but arousable. Dry mucous membranes. Heart: irregular rhythm, 3/6 systolic murmur. Lungs: decreased breath sounds at bases, scattered rhonchi. Abdomen: soft, non-tender. Extremities: 1+ edema, poor capillary refill.',
          vitals: {
            bp: '90/60',
            hr: 125,
            temp: 101.2,
            rr: 28,
            spo2: 88
          },
          labResults: 'WBC: 15,000, Creatinine: 2.8 mg/dL (baseline 1.8), BUN: 65 mg/dL, Na: 128 mEq/L, K: 5.2 mEq/L, Lactate: 2.8 mmol/L, Procalcitonin: 1.2 ng/mL, Chest X-ray: Bilateral lower lobe infiltrates, CT head: No acute findings',
          imaging: 'Chest X-ray: Bilateral lower lobe infiltrates',
          difficulty: 'advanced'
        },
        extreme: {
          patientInfo: {
            age: 55,
            gender: 'Female',
            chiefComplaint: 'Severe abdominal pain and vomiting'
          },
          history: 'Patient with history of alcohol use disorder presents with severe epigastric pain radiating to back, persistent vomiting, and inability to keep fluids down for 24 hours. Pain started suddenly after heavy drinking episode. Previous episode of pancreatitis 6 months ago.',
          physicalExam: 'Ill-appearing female in severe distress. Tachycardic, hypotensive. Abdomen: severe epigastric tenderness with guarding, hypoactive bowel sounds. Skin: jaundiced, poor turgor. Neurologic: agitated, tremulous.',
          vitals: {
            bp: '85/50',
            hr: 135,
            temp: 102.8,
            rr: 32,
            spo2: 94
          },
          labResults: 'Lipase: 1200 U/L, AST: 180 U/L, ALT: 150 U/L, Total bilirubin: 4.2 mg/dL, WBC: 18,000, Hct: 45%, Platelets: 95,000, Creatinine: 2.1 mg/dL, Calcium: 7.8 mg/dL, Glucose: 250 mg/dL',
          imaging: 'CT abdomen: Pancreatic edema and inflammation, peripancreatic fluid collections, no necrosis identified. Chest X-ray: bilateral pleural effusions',
          difficulty: 'extreme'
        }
      };
      setCaseData(cases[difficulty as keyof typeof cases] || cases.basic);
    }
  };

  const generateCustomCase = (customInfo: CustomCaseData, difficulty: string) => {
    const baseCase = {
      patientInfo: {
        age: parseInt(customInfo.age),
        gender: customInfo.gender,
        chiefComplaint: customInfo.chiefComplaint
      },
      difficulty: difficulty
    };
    if (customInfo.diagnosis.toLowerCase().includes('myocardial infarction') || customInfo.diagnosis.toLowerCase().includes('heart attack')) {
      return {
        ...baseCase,
        history: `${customInfo.age}-year-old ${customInfo.gender.toLowerCase()} presents with ${customInfo.chiefComplaint}. ${customInfo.medicalHistory ? `Past medical history significant for ${customInfo.medicalHistory}.` : 'No significant past medical history.'} Patient reports the pain started suddenly and is described as crushing and substernal. Associated symptoms include diaphoresis, nausea, and shortness of breath.`,
        physicalExam: `Alert ${customInfo.gender.toLowerCase()} in ${difficulty === 'basic' ? 'mild' : difficulty === 'extreme' ? 'severe' : 'moderate'} distress. Diaphoretic. Heart sounds regular, no murmurs. Lungs clear bilaterally. ${difficulty !== 'basic' ? 'Mild peripheral edema noted.' : 'No peripheral edema.'}`,
        vitals: {
          bp: difficulty === 'basic' ? '150/95' : difficulty === 'extreme' ? '85/50' : '140/90',
          hr: difficulty === 'basic' ? 102 : difficulty === 'extreme' ? 135 : 115,
          temp: 98.6,
          rr: difficulty === 'basic' ? 20 : difficulty === 'extreme' ? 32 : 24,
          spo2: difficulty === 'basic' ? 98 : difficulty === 'extreme' ? 88 : 94
        },
        labResults: `Troponin I: ${difficulty === 'basic' ? '2.5' : difficulty === 'extreme' ? '15.2' : '8.1'} ng/mL (elevated), CK-MB: elevated, ${difficulty !== 'basic' ? 'BNP: elevated, Creatinine: elevated,' : ''} CBC: WNL, BMP: ${difficulty === 'extreme' ? 'Multiple abnormalities including hyperglycemia' : 'Glucose mildly elevated, otherwise normal'}`,
        imaging: `ECG: ${difficulty === 'basic' ? 'ST elevation in leads II, III, aVF' : difficulty === 'extreme' ? 'Extensive ST elevations with reciprocal changes' : 'ST elevation with some reciprocal changes'}. Chest X-ray: ${difficulty === 'basic' ? 'Normal heart size, clear lungs' : difficulty === 'extreme' ? 'Cardiomegaly, pulmonary edema' : 'Mild cardiomegaly'}`
      };
    } else if (customInfo.diagnosis.toLowerCase().includes('pneumonia')) {
      return {
        ...baseCase,
        history: `${customInfo.age}-year-old ${customInfo.gender.toLowerCase()} presents with ${customInfo.chiefComplaint}. ${customInfo.medicalHistory ? `Past medical history includes ${customInfo.medicalHistory}.` : 'No significant past medical history.'} Symptoms started ${difficulty === 'basic' ? '2 days' : difficulty === 'extreme' ? '5 days' : '3 days'} ago with progressive worsening. Associated with productive cough, fever, and ${difficulty !== 'basic' ? 'confusion and' : ''} malaise.`,
        physicalExam: `${customInfo.gender} in ${difficulty === 'basic' ? 'mild' : difficulty === 'extreme' ? 'severe' : 'moderate'} respiratory distress. ${difficulty === 'extreme' ? 'Altered mental status. ' : ''}Lungs: ${difficulty === 'basic' ? 'Right lower lobe crackles' : difficulty === 'extreme' ? 'Bilateral crackles, decreased breath sounds' : 'Bilateral lower lobe crackles'}. Heart: ${difficulty !== 'basic' ? 'Tachycardic, ' : ''}regular rhythm.`,
        vitals: {
          bp: difficulty === 'extreme' ? '90/60' : '130/80',
          hr: difficulty === 'basic' ? 95 : difficulty === 'extreme' ? 125 : 110,
          temp: difficulty === 'basic' ? 101.2 : difficulty === 'extreme' ? 103.5 : 102.1,
          rr: difficulty === 'basic' ? 22 : difficulty === 'extreme' ? 30 : 26,
          spo2: difficulty === 'basic' ? 94 : difficulty === 'extreme' ? 85 : 90
        },
        labResults: `WBC: ${difficulty === 'basic' ? '12,000' : difficulty === 'extreme' ? '20,000' : '16,000'} (elevated), ${difficulty !== 'basic' ? 'Procalcitonin: elevated, Lactate: elevated, ' : ''}Blood cultures: pending, Sputum culture: pending`,
        imaging: `Chest X-ray: ${difficulty === 'basic' ? 'Right lower lobe consolidation' : difficulty === 'extreme' ? 'Bilateral multilobar pneumonia with effusions' : 'Bilateral lower lobe infiltrates'}${difficulty === 'extreme' ? '. CT chest: Extensive consolidation with complications' : ''}`
      };
    } else {
      return {
        ...baseCase,
        history: `${customInfo.age}-year-old ${customInfo.gender.toLowerCase()} presents with ${customInfo.chiefComplaint}. ${customInfo.medicalHistory ? `Relevant medical history includes ${customInfo.medicalHistory}.` : 'No significant past medical history.'} Symptoms have been ${difficulty === 'basic' ? 'acute onset' : difficulty === 'extreme' ? 'progressive over several days with recent deterioration' : 'gradually worsening'}.`,
        physicalExam: `${customInfo.gender} appears ${difficulty === 'basic' ? 'stable' : difficulty === 'extreme' ? 'critically ill' : 'moderately ill'}. Vital signs as noted. Physical examination reveals findings consistent with ${customInfo.diagnosis.toLowerCase()}.`,
        vitals: {
          bp: difficulty === 'extreme' ? '95/55' : difficulty === 'basic' ? '125/80' : '110/70',
          hr: difficulty === 'basic' ? 85 : difficulty === 'extreme' ? 120 : 100,
          temp: difficulty === 'extreme' ? 102.0 : 98.6,
          rr: difficulty === 'basic' ? 18 : difficulty === 'extreme' ? 28 : 22,
          spo2: difficulty === 'basic' ? 98 : difficulty === 'extreme' ? 90 : 95
        },
        labResults: `Laboratory studies ${difficulty === 'basic' ? 'show mild abnormalities' : difficulty === 'extreme' ? 'reveal multiple significant abnormalities' : 'demonstrate moderate abnormalities'} consistent with ${customInfo.diagnosis.toLowerCase()}.`,
        imaging: `Imaging studies ${difficulty === 'basic' ? 'support' : difficulty === 'extreme' ? 'confirm with complications' : 'are consistent with'} the diagnosis of ${customInfo.diagnosis.toLowerCase()}.`
      };
    }
  };

  const generateCase = async () => {
    setIsGenerating(true);
    
    if (useAI) {
      if (customData) {
        const customInfo: CustomCaseData = JSON.parse(decodeURIComponent(customData));
        await generateAICase(customInfo);
      } else {
        await generateAICase();
      }
    } else {
      setTimeout(() => {
        generateStaticCase(customData ? JSON.parse(decodeURIComponent(customData)) : undefined);
        setIsGenerating(false);
      }, 2000);
      return;
    }
    
    setIsGenerating(false);
  };

  useEffect(() => {
    generateCase();
  }, [difficulty, customData, useAI]);

  const handleSubmitAnswer = () => {
    setShowAnswer(true);
  };

  const getExpertAnswer = () => {
    const expertAnswers = {
      basic: {
        subjective: 'Chief Complaint: 45-year-old male with acute onset crushing chest pain for 2 hours.\n\nHistory of Present Illness: Patient reports sudden onset of substernal chest pain that began 2 hours ago while at rest. Pain is described as crushing, 8/10 severity, radiating to left arm. Associated symptoms include diaphoresis and nausea. No previous cardiac history.\n\nPast Medical History: No significant past medical history.\nSocial History: Tobacco use - 1 pack per day for 20 years (20 pack-year history).',
        objective: 'Vital Signs: BP 150/95, HR 102, Temp 98.6°F, RR 20, SpO2 98%\n\nPhysical Examination:\n- General: Alert, anxious appearing male in mild distress, diaphoretic\n- Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops\n- Pulmonary: Clear to auscultation bilaterally\n- Extremities: No peripheral edema\n\nDiagnostic Results:\n- Troponin I: 2.5 ng/mL (elevated, normal <0.04)\n- CK-MB: 15 ng/mL (elevated)\n- ECG: ST elevation in leads II, III, aVF consistent with inferior STEMI\n- Chest X-ray: Normal heart size, clear lung fields',
        assessment: 'Primary Diagnosis: ST-Elevation Myocardial Infarction (STEMI) - Inferior wall\n\nClinical Reasoning: Patient presents with classic symptoms of acute coronary syndrome including crushing chest pain with radiation, associated diaphoresis and nausea. Elevated cardiac biomarkers (troponin I and CK-MB) confirm myocardial injury. ECG findings of ST elevation in inferior leads (II, III, aVF) indicate acute STEMI of the inferior wall, likely involving the right coronary artery.\n\nRisk Factors: Significant tobacco use history (20 pack-years) is a major modifiable risk factor for coronary artery disease.',
        plan: 'Immediate Management:\n1. Activate cardiac catheterization lab for primary PCI (door-to-balloon time goal <90 minutes)\n2. Dual antiplatelet therapy: Aspirin 325mg chewed, Clopidogrel 600mg loading dose\n3. Anticoagulation: Heparin per protocol\n4. Beta-blocker: Metoprolol 25mg BID if no contraindications\n5. Statin: Atorvastatin 80mg daily\n6. Continuous cardiac monitoring\n\nSecondary Prevention:\n1. Smoking cessation counseling and resources\n2. Cardiac rehabilitation referral\n3. Follow-up with cardiology in 1-2 weeks\n4. Echo in 24-48 hours to assess LV function\n\nEvidence Base: 2013 ACCF/AHA STEMI Guidelines recommend primary PCI as preferred reperfusion strategy when performed by experienced operators within 90 minutes of first medical contact.'
      },
      intermediate: {
        subjective: 'Chief Complaint: 68-year-old female with progressive dyspnea and bilateral leg swelling.\n\nHistory of Present Illness: Patient reports 3-week history of progressive dyspnea on exertion, now occurring at rest. Associated with 10-pound weight gain, bilateral lower extremity swelling, and orthopnea requiring 3 pillows to sleep.\n\nPast Medical History: Type 2 diabetes mellitus, hypertension, previous myocardial infarction 2 years ago\nMedications: Metformin, lisinopril, aspirin\nAllergies: NKDA',
        objective: 'Vital Signs: BP 110/70, HR 110, Temp 98.2°F, RR 24, SpO2 92% on room air\n\nPhysical Examination:\n- General: Elderly female in moderate respiratory distress\n- Cardiovascular: Tachycardic, S3 gallop present, 2/6 systolic murmur, JVD to 8 cm\n- Pulmonary: Bilateral crackles to mid-lung fields\n- Extremities: 2+ pitting edema to knees bilaterally\n\nDiagnostic Results:\n- BNP: 850 pg/mL (elevated, normal <100)\n- Creatinine: 1.8 mg/dL (elevated from baseline 1.2)\n- HbA1c: 8.2% (poor glycemic control)\n- Chest X-ray: Cardiomegaly, bilateral pulmonary edema\n- Echocardiogram: EF 35% (reduced), regional wall motion abnormalities',
        assessment: 'Primary Diagnosis: Acute decompensated heart failure with reduced ejection fraction (HFrEF)\nSecondary Diagnoses: \n1. Type 2 diabetes mellitus, poorly controlled\n2. Chronic kidney disease stage 3\n3. History of myocardial infarction with resultant cardiomyopathy\n\nClinical Reasoning: Patient presents with classic signs and symptoms of heart failure including dyspnea, orthopnea, weight gain, bilateral edema, and elevated JVD. Elevated BNP confirms diagnosis. Reduced EF of 35% indicates systolic dysfunction likely secondary to previous MI. Worsening renal function suggests cardiorenal syndrome.',
        plan: 'Acute Management:\n1. Diuresis: Furosemide 40mg IV BID, monitor daily weights and I/Os\n2. ACE inhibitor: Continue lisinopril, monitor renal function\n3. Beta-blocker: Initiate metoprolol succinate 25mg daily when stable\n4. Aldosterone antagonist: Consider spironolactone if K+ and creatinine stable\n\nDiabetes Management:\n1. Diabetes consultation for optimization of glycemic control\n2. Consider SGLT2 inhibitor (empagliflozin) for dual cardiac and renal benefits\n\nMonitoring:\n1. Daily weights, strict I/O monitoring\n2. BMP daily while on IV diuretics\n3. Repeat echo in 3 months to reassess EF\n\nDischarge Planning:\n1. Heart failure education and dietary counseling\n2. Cardiology follow-up in 1-2 weeks\n3. Home health for weight monitoring\n\nEvidence Base: 2022 AHA/ACC/HFSA Heart Failure Guidelines recommend guideline-directed medical therapy with ACE inhibitor, beta-blocker, and aldosterone antagonist for HFrEF.'
      },
      advanced: {
        subjective: 'Chief Complaint: 72-year-old male with altered mental status and worsening dyspnea.\n\nHistory of Present Illness: Patient with multiple comorbidities presents with 2-day history of confusion and decreased oral intake. Family reports baseline cognitive function was normal. Recent treatment for pneumonia with antibiotics and prednisone taper completed 2 weeks ago.\n\nPast Medical History: COPD, CHF (EF 30%), CKD stage 3, recent pneumonia\nMedications: Albuterol, tiotropium, furosemide, lisinopril, metoprolol\nSocial History: Former smoker, lives with family',
        objective: 'Vital Signs: BP 90/60, HR 125, Temp 101.2°F, RR 28, SpO2 88% on room air\n\nPhysical Examination:\n- General: Elderly male, lethargic but arousable, appears dehydrated\n- HEENT: Dry mucous membranes, poor skin turgor\n- Cardiovascular: Tachycardic, irregular rhythm, 3/6 systolic murmur\n- Pulmonary: Decreased breath sounds at bases, scattered rhonchi\n- Abdomen: Soft, non-tender, hypoactive bowel sounds\n- Extremities: 1+ edema, poor capillary refill\n- Neurologic: Lethargic, oriented to person only\n\nDiagnostic Results:\n- WBC: 15,000 (elevated)\n- Creatinine: 2.8 mg/dL (elevated from baseline 1.8)\n- BUN: 65 mg/dL, Na: 128 mEq/L, K: 5.2 mEq/L\n- Lactate: 2.8 mmol/L (elevated)\n- Procalcitonin: 1.2 ng/mL (elevated)\n- Chest X-ray: Bilateral lower lobe infiltrates\n- CT head: No acute findings',
        assessment: 'Primary Diagnosis: Sepsis secondary to healthcare-associated pneumonia\nSecondary Diagnoses:\n1. Acute kidney injury on chronic kidney disease (AKIN stage 2)\n2. Hyponatremia, likely hypovolemic\n3. Acute on chronic heart failure\n4. COPD exacerbation\n5. Delirium secondary to sepsis and metabolic derangements\n\nClinical Reasoning: Patient presents with systemic inflammatory response syndrome (SIRS) criteria with altered mental status, suggesting sepsis. Recent pneumonia treatment and current bilateral infiltrates suggest healthcare-associated pneumonia. Elevated lactate and hypotension indicate tissue hypoperfusion. AKI likely multifactorial from sepsis, dehydration, and cardiorenal syndrome.',
        plan: 'Immediate Management (Sepsis Bundle):\n1. Fluid resuscitation: 30mL/kg crystalloid (caution given CHF history)\n2. Blood cultures x2, respiratory cultures\n3. Broad-spectrum antibiotics: Piperacillin-tazobactam + vancomycin\n4. Vasopressors if hypotension persists after fluid resuscitation\n\nSupportive Care:\n1. Oxygen therapy, consider BiPAP for respiratory support\n2. Hold ACE inhibitor and diuretics given AKI\n3. Nephrology consultation for AKI management\n4. Electrolyte correction: cautious sodium correction\n\nMonitoring:\n1. Serial lactates, urine output monitoring\n2. Daily BMP, CBC with differential\n3. Cardiopulmonary monitoring in ICU setting\n4. Delirium assessment and prevention measures\n\nEvidence Base: Surviving Sepsis Campaign 2021 Guidelines recommend early recognition, appropriate antibiotics within 1 hour, and hemodynamic support as needed.'
      },
      extreme: {
        subjective: 'Chief Complaint: 55-year-old female with severe abdominal pain and persistent vomiting.\n\nHistory of Present Illness: Patient with alcohol use disorder presents with sudden onset severe epigastric pain radiating to back, 10/10 severity, following heavy drinking episode. Persistent vomiting for 24 hours with inability to tolerate oral intake.\n\nPast Medical History: Alcohol use disorder, previous acute pancreatitis\nSocial History: Heavy alcohol use, approximately 8-10 drinks daily\nFamily History: Non-contributory',
        objective: 'Vital Signs: BP 85/50, HR 135, Temp 102.8°F, RR 32, SpO2 94% on room air\n\nPhysical Examination:\n- General: Ill-appearing female in severe distress, jaundiced\n- HEENT: Scleral icterus, dry mucous membranes\n- Cardiovascular: Tachycardic, regular rhythm\n- Pulmonary: Tachypneic, bilateral decreased breath sounds at bases\n- Abdomen: Severe epigastric tenderness with guarding, hypoactive bowel sounds\n- Extremities: Poor skin turgor, delayed capillary refill\n- Neurologic: Agitated, tremulous, oriented x2\n\nDiagnostic Results:\n- Lipase: 1200 U/L (markedly elevated, normal <60)\n- AST: 180 U/L, ALT: 150 U/L, Total bilirubin: 4.2 mg/dL\n- WBC: 18,000, Hct: 45%, Platelets: 95,000\n- Creatinine: 2.1 mg/dL, Calcium: 7.8 mg/dL\n- Glucose: 250 mg/dL\n- CT abdomen: Pancreatic edema and inflammation, peripancreatic fluid collections, no necrosis identified\n- Chest X-ray: Bilateral pleural effusions',
        assessment: 'Primary Diagnosis: Severe acute pancreatitis with systemic complications\nSecondary Diagnoses:\n1. Acute cholangitis (elevated bilirubin, fever, RUQ pain)\n2. Systemic inflammatory response syndrome (SIRS)\n3. Acute kidney injury\n4. Hypocalcemia\n5. Thrombocytopenia\n6. Alcohol withdrawal syndrome\n7. Acute respiratory failure with pleural effusions\n\nSeverity Assessment: Ranson criteria positive for multiple factors indicating severe pancreatitis with high mortality risk. APACHE II score likely >8 indicating severe disease.\n\nClinical Reasoning: Patient presents with severe acute pancreatitis evidenced by markedly elevated lipase, characteristic pain, and CT findings. Systemic complications include SIRS, AKI, hypocalcemia, and thrombocytopenia. Concurrent cholangitis suggested by Charcot\'s triad. High risk for necrotizing pancreatitis and multi-organ failure.',
        plan: 'Critical Care Management:\n1. ICU admission for close monitoring\n2. Aggressive fluid resuscitation: LR 250-500mL/hr initially\n3. Pain control: IV morphine or fentanyl\n4. NPO status, nasogastric decompression if ileus\n5. Nutritional support: Consider early enteral nutrition if tolerated\n\nSpecific Interventions:\n1. ERCP consultation for possible cholangitis and biliary obstruction\n2. Interventional radiology for possible drainage of fluid collections\n3. Alcohol withdrawal prophylaxis: CIWA protocol, thiamine, folate\n4. Calcium replacement for hypocalcemia\n5. Insulin protocol for hyperglycemia\n\nMonitoring:\n1. Serial lipase, LFTs, CBC, BMP\n2. Arterial blood gases for respiratory status\n3. Urine output monitoring (goal >0.5mL/kg/hr)\n4. Daily APACHE II scoring\n5. Repeat CT in 48-72 hours if clinical deterioration\n\nComplications Surveillance:\n1. Pancreatic necrosis and infection\n2. Pseudocyst formation\n3. Multi-organ dysfunction syndrome\n4. Respiratory failure requiring mechanical ventilation\n\nEvidence Base: 2013 ACG Guidelines for acute pancreatitis emphasize early aggressive fluid resuscitation, pain control, and nutritional support. ERCP indicated for cholangitis or persistent biliary obstruction.'
      }
    };
    return expertAnswers[difficulty as keyof typeof expertAnswers] || expertAnswers.basic;
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {useAI ? '🤖 AI Generating Clinical Case' : (customData ? 'Generating Custom Clinical Case' : 'Generating Clinical Case')}
          </h2>
          <p className="text-slate-400">
            {useAI ? 'Using Perplexity AI with evidence-based medical sources...' : `Creating a ${difficulty} difficulty case...`}
          </p>
          {useAI && (
            <div className="mt-4 text-xs text-slate-500">
              <p>Sources: PubMed, UpToDate, NEJM, BMJ, Cochrane Library</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: '"Pacifico", serif' }}>
              {caseData.aiGenerated && <i className="ri-robot-line text-teal-200"></i>}
              Clinical Case Generator
            </h1>
            <p className="text-teal-100 text-sm">
              {caseData.aiGenerated ? '🤖 AI-Generated' : (customData ? 'Custom' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1))} Difficulty Case
              {caseData.aiGenerated && ' • Evidence-Based Content'}
            </p>
          </div>
          <div className="flex gap-2">
            {!useAI && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('ai', 'true');
                  navigate(`${window.location.pathname}?${params.toString()}`);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <i className="ri-robot-line mr-2"></i>
                Try AI Version
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <i className="ri-arrow-left-line mr-2"></i>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Presentation */}
          <div className="space-y-6">
            {caseData.aiGenerated && aiCitations.length > 0 && (
              <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700 rounded-xl p-4">
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

            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <i className="ri-user-line text-teal-400"></i>
                Patient Information
              </h2>
              <div className="space-y-2 text-sm">
                <p><span className="text-slate-400">Age:</span> <span className="text-white">{caseData.patientInfo.age} years old</span></p>
                <p><span className="text-slate-400">Gender:</span> <span className="text-white">{caseData.patientInfo.gender}</span></p>
                <p><span className="text-slate-400">Chief Complaint:</span> <span className="text-white">{caseData.patientInfo.chiefComplaint}</span></p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">History of Present Illness</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{caseData.history}</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Vital Signs</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-400">BP:</span> <span className="text-white">{caseData.vitals.bp} mmHg</span></div>
                <div><span className="text-slate-400">HR:</span> <span className="text-white">{caseData.vitals.hr} bpm</span></div>
                <div><span className="text-slate-400">Temp:</span> <span className="text-white">{caseData.vitals.temp}°F</span></div>
                <div><span className="text-slate-400">RR:</span> <span className="text-white">{caseData.vitals.rr} /min</span></div>
                <div><span className="text-slate-400">SpO2:</span> <span className="text-white">{caseData.vitals.spo2}%</span></div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Physical Examination</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{caseData.physicalExam}</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Laboratory Results</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{caseData.labResults}</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Imaging</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{caseData.imaging}</p>
            </div>
          </div>

          {/* SOAP Note Input */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <i className="ri-file-text-line text-teal-400"></i>
                Your SOAP Note
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subjective</label>
                  <textarea
                    value={userAnswer.subjective}
                    onChange={(e) => setUserAnswer({...userAnswer, subjective: e.target.value})}
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                    placeholder="Document the patient's history and symptoms..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Objective</label>
                  <textarea
                    value={userAnswer.objective}
                    onChange={(e) => setUserAnswer({...userAnswer, objective: e.target.value})}
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                    placeholder="Record physical exam findings and test results..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assessment</label>
                  <textarea
                    value={userAnswer.assessment}
                    onChange={(e) => setUserAnswer({...userAnswer, assessment: e.target.value})}
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                    placeholder="Provide your clinical assessment and differential diagnosis..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Plan</label>
                  <textarea
                    value={userAnswer.plan}
                    onChange={(e) => setUserAnswer({...userAnswer, plan: e.target.value})}
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-teal-400"
                    placeholder="Outline your treatment plan and follow-up..."
                  />
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all"
                >
                  Submit SOAP Note
                </button>
              </div>
            </div>

            {/* Expert Answer */}
            {showAnswer && (
              <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                  <i className="ri-check-circle-line"></i>
                  Expert SOAP Note & Clinical Reasoning
                  {caseData.aiGenerated && <span className="text-xs bg-purple-600 px-2 py-1 rounded">AI-Enhanced</span>}
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(getExpertAnswer()).map(([section, content]) => (
                    <div key={section}>
                      <h4 className="text-lg font-semibold text-green-300 mb-2 capitalize">
                        {section}
                      </h4>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {content}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
