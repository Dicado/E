export const createFeedbackTask = async (email, message) => {
  const response = await fetch('http://localhost:5000/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  
  return response.json();
};
