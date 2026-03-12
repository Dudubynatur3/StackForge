const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stackforge-backend.onrender.com';

console.log('API_BASE_URL being used:', API_BASE_URL);

export async function analyseJD(jdText: string, userId?: string) {
  console.log(`Calling analyseJD at ${API_BASE_URL}/analyse/ with userId: ${userId}`);
  const response = await fetch(`${API_BASE_URL}/analyse/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jd_text: jdText, user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('analyseJD error:', errorData);
    throw new Error(errorData.detail || 'Failed to analyse job description');
  }

  const data = await response.json();
  console.log('analyseJD success:', data);
  return data;
}

export async function getAnalysisHistory(userId: string) {
  console.log(`Fetching history for ${userId} at ${API_BASE_URL}/analyse/history/${userId}`);
  const response = await fetch(`${API_BASE_URL}/analyse/history/${userId}`);
  if (!response.ok) {
    const errorData = await response.json();
    console.error('getAnalysisHistory error:', errorData);
    throw new Error(errorData.detail || 'Failed to fetch history');
  }
  return response.json();
}

export async function recommendProjects(jdText: string, currentSkills?: string[], userId?: string) {
  console.log(`Calling recommendProjects at ${API_BASE_URL}/recommend/`);
  const response = await fetch(`${API_BASE_URL}/recommend/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jd_text: jdText, current_skills: currentSkills, user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('recommendProjects error:', errorData);
    throw new Error(errorData.detail || 'Failed to get recommendations');
  }

  return response.json();
}

export async function generateImplementationPlan(projectTitle: string, projectDescription?: string, techStack?: string, userId?: string) {
  console.log(`Calling generateImplementationPlan at ${API_BASE_URL}/implement/`);
  const response = await fetch(`${API_BASE_URL}/implement/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      project_title: projectTitle, 
      project_description: projectDescription,
      tech_stack: techStack,
      user_id: userId
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('generateImplementationPlan error:', errorData);
    throw new Error(errorData.detail || 'Failed to generate implementation plan');
  }

  return response.json();
}

export async function generateUpgradeAdvice(projectDescription: string, currentTechStack?: string) {
  console.log(`Calling generateUpgradeAdvice at ${API_BASE_URL}/upgrade/`);
  const response = await fetch(`${API_BASE_URL}/upgrade/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      project_description: projectDescription, 
      current_tech_stack: currentTechStack 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('generateUpgradeAdvice error:', errorData);
    throw new Error(errorData.detail || 'Failed to generate upgrade advice');
  }

  return response.json();
}
