export async function POST(request) {
  try {
    const { command, meals } = await request.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a family assistant. The user will give you a command to update their family dashboard. Current meals: ${JSON.stringify(meals)}. You MUST respond with valid JSON only, no markdown, no explanation, just raw JSON like this: {"message":"Done! Tuesday dinner set to lasagne","updates":{"meals":{"1":{"dinner":"Lasagne","lunch":""}}}}. Days are 0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun.`,
        messages: [{ role: 'user
