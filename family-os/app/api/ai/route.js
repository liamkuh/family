export async function POST(request) {
  try {
    const body = await request.json()
    const command = body.command
    const meals = body.meals

    const systemPrompt = "You are a family assistant. Respond with valid JSON only. No markdown. Example: {\"message\":\"Done!\",\"updates\":{\"meals\":{\"1\":{\"dinner\":\"Lasagne\",\"lunch\":\"\"}}}}. Days: 0=Mon,1=Tue,2=Wed,3=Thu,4=Fri,5=Sat,6=Sun. Current meals: " + JSON.stringify(meals)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: 'user', content: command }]
      })
    })

    const data = await response.json()
    const text = data.content[0].text.trim()
    const result = JSON.parse(text)
    return Response.json(result)

  } catch(err) {
    ret
