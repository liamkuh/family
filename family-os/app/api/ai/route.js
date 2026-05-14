import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  const { command, meals, events, shopping } = await request.json()

  const systemPrompt = `You are a helpful family assistant managing a family dashboard. 
You help update meals, calendar events, and shopping lists based on natural language commands.

Current state:
- Meals this week: ${JSON.stringify(meals)}
- Events: ${JSON.stringify(events)}
- Shopping list: ${JSON.stringify(shopping)}

When the user gives a command, respond with a JSON object containing:
1. "message": a short friendly confirmation of what you did (max 15 words)
2. "updates": an object with any of these optional fields:
   - "meals": updated meals object (same format as current)
   - "events": array of new events to add, each with {name, time, day (0-6, Mon=0), tag, color}
   - "shopping": array of new shopping items to add, each with {name, qty, category} where category is one of: Produce, Meat, Dairy, Pantry

Only include fields in "updates" that actually changed.
Respond with valid JSON only, no other text.

Tag options: kids, health, home, work, social
Color options: kids=#6B9AB8, health=#9E8A6A, home=#8B5E3C, work=#6B7A5E, social=#7A6E8A
Days: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: command }]
  })

  const text = response.content[0].text
  const clean = text.replace(/```json|```/g, '').trim()
  const result = JSON.parse(clean)

  return Response.json(result)
}
