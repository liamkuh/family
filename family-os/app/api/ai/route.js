export async function POST(request) {
  const { command, meals, events, shopping } = await request.json()

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
      system: `You are a family assistant. Update meals, events, and shopping based on commands. Current meals: ${JSON.stringify(meals)}. Respond with JSON only: {"message": "confirmation text", "updates": {"meals": {0-6 index: {dinner, lunch}}}}. Only include what changed.`,
      messages: [{ role: 'user', content: command }]
    })
  })

  const data = await response.json()
  const text = data.content[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  const result = JSON.parse(clean)

  return Response.json(result)
}
