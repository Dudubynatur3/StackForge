const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stackforge-backend.onrender.com';

export async function analyseJD(jdText: string, userId?: string) {
  const response = await fetch(`${API_BASE_URL}/analyse/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jd_text: jdText, user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to analyse job description');
  }

  return response.json();
}

export async function getAnalysisHistory(userId: string) {
  const response = await fetch(`${API_BASE_URL}/analyse/history/${userId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch history');
  }
  return response.json();
}

export async function recommendProjects(jdText: string, currentSkills?: string[], userId?: string) {
  const response = await fetch(`${API_BASE_URL}/recommend/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jd_text: jdText, current_skills: currentSkills, user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to get recommendations');
  }

  return response.json();
}

export async function generateImplementationPlan(projectTitle: string, projectDescription?: string, techStack?: string, userId?: string) {
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
    throw new Error(errorData.detail || 'Failed to generate implementation plan');
  }

  return response.json();
}

export async function generateUpgradeAdvice(projectDescription: string, currentTechStack?: string) {
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
    throw new Error(errorData.detail || 'Failed to generate upgrade advice');
  }

  return response.json();
}
