import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      type, 
      prompt, 
      difficulty = 'intermediate', 
      specialty = 'general',
      age,
      gender,
      diagnosis,
      chiefComplaint,
      medicalHistory
    } = await req.json()

    // Get Perplexity API key from secrets
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured')
    }

    // Create specialized prompts based on content type
    let systemPrompt = ""
    let userPrompt = ""

    switch (type) {
      case 'case':
        systemPrompt = `You are an expert clinical educator creating realistic medical cases for healthcare professionals. Generate comprehensive, evidence-based clinical cases with accurate medical information, proper diagnostic workup, and appropriate treatment plans. Include relevant vital signs, lab values, imaging results, and clinical reasoning.`
        
        // Check if custom demographic/medical fields are provided
        if (age || gender || diagnosis || chiefComplaint || medicalHistory) {
          // Build custom case prompt using ALL provided fields
          let customDetails = [];
          
          if (age) customDetails.push(`Age: ${age}`);
          if (gender) customDetails.push(`Gender: ${gender}`);
          if (diagnosis) customDetails.push(`Diagnosis: ${diagnosis}`);
          if (chiefComplaint) customDetails.push(`Chief Complaint: ${chiefComplaint}`);
          if (medicalHistory) customDetails.push(`Medical History: ${medicalHistory}`);
          
          userPrompt = `Create a ${difficulty} level clinical case for ${specialty} practice based on the following patient details:

${customDetails.join('\n')}

${prompt ? `Additional instructions: ${prompt}\n\n` : ''}
Please include:
1. Patient demographics (use the provided age: ${age || 'appropriate age'} and gender: ${gender || 'appropriate gender'})
2. Chief complaint (expand on: ${chiefComplaint || 'relevant complaint'})
3. History of present illness with timeline
4. Past medical history (incorporate: ${medicalHistory || 'relevant history'})
5. Current medications and allergies
6. Physical examination findings
7. Vital signs (realistic values for age ${age || 'adult'})
8. Laboratory results and imaging (if applicable for ${diagnosis || 'the condition'})
9. Assessment and differential diagnosis (centered around ${diagnosis || 'the primary diagnosis'})
10. Treatment plan with evidence-based rationale
11. Follow-up recommendations
12. Learning objectives

Make it realistic and clinically accurate with proper medical terminology. Ensure ALL the provided patient details (age, gender, diagnosis, chief complaint, medical history) are fully integrated into the case presentation.`
        } else {
          // Use standard prompt when no custom fields provided
          userPrompt = `Create a ${difficulty} level clinical case for ${specialty} practice. ${prompt}

Please include:
1. Patient demographics and chief complaint
2. History of present illness with timeline
3. Past medical history, medications, allergies
4. Physical examination findings
5. Vital signs (realistic values)
6. Laboratory results and imaging (if applicable)
7. Assessment and differential diagnosis
8. Treatment plan with rationale
9. Follow-up recommendations
10. Learning objectives

Make it realistic and clinically accurate with proper medical terminology.`
        }
        break

      case 'soap':
        systemPrompt = `You are a clinical documentation expert. Create professional, comprehensive SOAP notes that follow proper medical documentation standards. Include detailed subjective and objective findings, thorough assessment with clinical reasoning, and evidence-based treatment plans.`
        userPrompt = `Generate a detailed SOAP note for: ${prompt}
Difficulty level: ${difficulty}
Specialty: ${specialty}

Include:
- Subjective: Chief complaint, HPI, ROS, PMH, medications, allergies, social history
- Objective: Vital signs, physical exam, diagnostic results
- Assessment: Primary/secondary diagnoses with ICD-10 codes, clinical reasoning
- Plan: Diagnostic tests, treatments, medications with dosing, follow-up, patient education

Use proper medical terminology and evidence-based recommendations.`
        break

      case 'assessment':
        systemPrompt = `You are a medical education specialist creating clinical assessments. Generate challenging, evidence-based questions that test clinical reasoning, diagnostic skills, and treatment knowledge. Include detailed explanations with current medical guidelines and research.`
        userPrompt = `Create a clinical assessment question about: ${prompt}
Difficulty: ${difficulty}
Specialty: ${specialty}

Include:
1. Clinical scenario with patient presentation
2. Multiple choice options (4-5 choices)
3. Correct answer with detailed explanation
4. Clinical reasoning and evidence base
5. Key learning points
6. References to current guidelines

Make it challenging but fair, testing practical clinical knowledge.`
        break

      case 'evidence':
        systemPrompt = `You are a clinical research expert and evidence-based medicine specialist. Provide comprehensive, accurate information about medical evidence, research findings, and clinical guidelines. Include proper citations and evidence levels.`
        userPrompt = `Provide evidence-based information about: ${prompt}

Focus on:
1. Current research findings and clinical trials
2. Evidence quality and level (A, B, C, D)
3. Clinical practice guidelines
4. Systematic reviews and meta-analyses
5. Clinical recommendations with rationale
6. Limitations and areas needing more research
7. Practical clinical applications

Include proper medical references and evidence grading.`
        break

      case 'drug_info':
        systemPrompt = `You are a clinical pharmacist and drug information specialist. Provide comprehensive, accurate pharmaceutical information including mechanisms, dosing, interactions, monitoring, and clinical considerations.`
        userPrompt = `Provide comprehensive drug information about: ${prompt}

Include:
1. Mechanism of action
2. Clinical indications and evidence
3. Dosing and administration
4. Contraindications and precautions
5. Drug interactions (major ones)
6. Adverse effects and monitoring
7. Clinical pearls and considerations
8. Patient counseling points
9. Cost considerations if relevant

Focus on clinically relevant, evidence-based information.`
        break

      default:
        systemPrompt = `You are a clinical expert providing evidence-based medical information for healthcare professionals. Ensure all information is accurate, current, and clinically relevant.`
        userPrompt = prompt
    }

    // Call Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.2,
        top_p: 0.9,
        return_citations: true,
        search_domain_filter: ["pubmed.ncbi.nlm.nih.gov", "uptodate.com", "nejm.org", "jamanetwork.com", "thelancet.com", "bmj.com", "cochranelibrary.com", "guideline.gov", "acc.org", "heart.org", "diabetes.org", "cdc.gov", "fda.gov", "who.int"],
        search_recency_filter: "month"
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Perplexity API error:', errorData)
      throw new Error(`Perplexity API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract content and citations
    const content = data.choices[0]?.message?.content || ''
    const citations = data.citations || []

    // Store the generated content in Supabase for future reference
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabase
      .from('generated_content')
      .insert({
        content_type: type,
        prompt: prompt,
        difficulty: difficulty,
        specialty: specialty,
        generated_content: content,
        citations: citations,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error storing content:', insertError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: content,
        citations: citations,
        type: type,
        difficulty: difficulty,
        specialty: specialty
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
