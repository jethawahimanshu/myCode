// Serverless function to proxy MiniMax Music-1.5 API calls via Replicate
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { apiKey, songData, genre, mood } = JSON.parse(event.body);

    if (!apiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'API key is required' })
      };
    }

    if (!songData || !songData.lyrics) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Lyrics are required' })
      };
    }

    // Truncate lyrics to fit MiniMax requirements (10-600 characters)
    let lyrics = songData.lyrics.trim();
    if (lyrics.length > 600) {
      // Truncate to 590 chars and add ellipsis
      lyrics = lyrics.substring(0, 590) + '...';
      console.log(`Lyrics truncated from ${songData.lyrics.length} to 600 characters`);
    }
    if (lyrics.length < 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Lyrics too short (minimum 10 characters)' })
      };
    }

    // Build the style/genre prompt (lyrics_prompt parameter, 10-300 chars)
    let lyricsPrompt = '';
    if (genre && mood) {
      lyricsPrompt = `${genre}, ${mood}`;
    } else if (genre) {
      lyricsPrompt = genre;
    } else if (mood) {
      lyricsPrompt = mood;
    } else {
      lyricsPrompt = 'pop, melodic';
    }

    // Add music description if available
    if (songData.musicDescription) {
      lyricsPrompt += `, ${songData.musicDescription}`;
    }

    // Ensure lyrics_prompt is within 10-300 character limit
    if (lyricsPrompt.length > 300) {
      lyricsPrompt = lyricsPrompt.substring(0, 297) + '...';
    }
    if (lyricsPrompt.length < 10) {
      lyricsPrompt = 'pop, melodic, upbeat';
    }

    // Step 1: Create prediction on Replicate using MiniMax Music-1.5
    const createResponse = await fetch('https://api.replicate.com/v1/models/minimax/music-1.5/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          lyrics_prompt: lyricsPrompt,
          lyrics: lyrics
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
        contentType: 'audio/wav'
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
