// Serverless function to proxy MusicGen API calls via Replicate
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { apiKey, description, duration = 8 } = JSON.parse(event.body);

    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    // Build the music prompt
    let prompt = description || 'A melodic instrumental track';

    // Step 1: Create prediction on Replicate
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: '7be0f12c54a8d033a0fbd14418c9af98962da9a86f5ff7811f9b3423a1f0b7d7',
        input: {
          prompt: prompt,
          duration: duration,
          model_version: 'melody',
          output_format: 'mp3',
          normalization_strategy: 'loudness'
        }
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      console.error('Replicate Create Error:', error);
      return {
        statusCode: createResponse.status,
        body: JSON.stringify({ error: error.detail || 'Failed to create prediction' })
      };
    }

    const prediction = await createResponse.json();
    const predictionUrl = prediction.urls.get;

    // Step 2: Poll for completion (with timeout)
    let attempts = 0;
    const maxAttempts = 60; // 60 attempts = ~2 minutes max
    let result = prediction;

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const pollResponse = await fetch(predictionUrl, {
        headers: {
          'Authorization': `Token ${apiKey}`
        }
      });

      if (!pollResponse.ok) {
        throw new Error('Failed to poll prediction status');
      }

      result = await pollResponse.json();
      attempts++;
    }

    if (result.status === 'failed') {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: result.error || 'Music generation failed' })
      };
    }

    if (result.status !== 'succeeded') {
      return {
        statusCode: 408,
        body: JSON.stringify({ error: 'Music generation timed out. Please try again.' })
      };
    }

    // Step 3: Download the audio file
    const audioUrl = result.output;
    const audioResponse = await fetch(audioUrl);

    if (!audioResponse.ok) {
      throw new Error('Failed to download generated audio');
    }

    const audioBuffer = await audioResponse.arrayBuffer();
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
        contentType: 'audio/mp3'
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
