// Serverless function to proxy Claude API calls
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { apiKey, premise, genre, mood } = JSON.parse(event.body);

    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    // Build the prompt
    let prompt = `You are a professional songwriter. Create original song lyrics based on this description:\n\n${premise}\n\n`;

    if (genre) {
      prompt += `Genre: ${genre}\n`;
    }
    if (mood) {
      prompt += `Mood: ${mood}\n`;
    }

    prompt += `\nPlease provide:\n`;
    prompt += `1. A creative song title\n`;
    prompt += `2. Complete lyrics with the following structure:\n`;
    prompt += `   - Verse 1\n`;
    prompt += `   - Chorus\n`;
    prompt += `   - Verse 2\n`;
    prompt += `   - Chorus\n`;
    prompt += `   - Bridge (optional)\n`;
    prompt += `   - Final Chorus\n`;
    prompt += `3. A brief description of the musical style and instrumentation\n`;
    prompt += `4. Suggested tempo (BPM) and key\n\n`;
    prompt += `Format your response as JSON with these fields:\n`;
    prompt += `{\n`;
    prompt += `  "title": "Song Title",\n`;
    prompt += `  "lyrics": "Full lyrics with [Verse 1], [Chorus], etc. labels",\n`;
    prompt += `  "musicDescription": "Description of the musical style",\n`;
    prompt += `  "tempo": "120 BPM",\n`;
    prompt += `  "key": "C Major"\n`;
    prompt += `}`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.error?.message || 'Claude API error' })
      };
    }

    const data = await response.json();
    const text = data.content[0].text;

    // Parse the response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback
        result = {
          title: 'Untitled Song',
          lyrics: text,
          musicDescription: 'Original composition',
          tempo: '120 BPM',
          key: 'C Major'
        };
      }
    } catch (parseError) {
      result = {
        title: 'Untitled Song',
        lyrics: text,
        musicDescription: 'Original composition',
        tempo: '120 BPM',
        key: 'C Major'
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
