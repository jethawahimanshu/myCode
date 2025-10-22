// Serverless function to proxy MusicGen API calls
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { apiKey, description, duration = 20 } = JSON.parse(event.body);

    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    // Build the music prompt
    let prompt = description || 'A melodic instrumental track';

    // Call Hugging Face MusicGen API
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/musicgen-small', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: Math.floor(duration * 50)
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MusicGen Error:', error);

      // Check if model is loading
      if (response.status === 503) {
        return {
          statusCode: 503,
          body: JSON.stringify({
            error: 'Model is loading. Please wait 30 seconds and try again.',
            retry: true
          })
        };
      }

      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `MusicGen API error: ${response.status}` })
      };
    }

    // Get audio blob
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        audio: base64Audio,
        contentType: response.headers.get('content-type') || 'audio/wav'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
