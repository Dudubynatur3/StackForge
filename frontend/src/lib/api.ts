// HARD-CODED TEST (Temporary for Proof of Concept)
const API_BASE_URL = 'https://stackforge-backend.onrender.com';

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
  // Increased timeout for complex elite plans
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 60000); // 60 seconds

  try {
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
      signal: controller.signal
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate implementation plan');
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('The AI is taking a while to architect your elite plan. Please refresh and try again in 30 seconds.');
    }
    throw error;
  }
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
