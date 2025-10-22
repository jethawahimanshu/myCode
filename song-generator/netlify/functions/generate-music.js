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

    // Clean and format lyrics to fit MiniMax requirements
    let lyrics = songData.lyrics.trim();

    // Remove any problematic characters and normalize
    lyrics = lyrics
      .replace(/[\r\n]+/g, '\n')           // Normalize line breaks to \n
      .replace(/["]/g, '')                  // Remove quotes that might break JSON
      .replace(/['']/g, "'")               // Normalize smart quotes to regular apostrophes
      .replace(/[""]/g, '')                 // Remove smart quotes
      .replace(/…/g, '...')                // Replace ellipsis character
      .replace(/—/g, '-')                   // Replace em dash
      .replace(/\t/g, ' ')                  // Replace tabs with spaces
      .replace(/\s+$/gm, '')               // Remove trailing whitespace from lines
      .trim();

    // Ensure structure tags are lowercase and properly formatted
    lyrics = lyrics
      .replace(/\[Verse\]/gi, '[verse]')
      .replace(/\[Chorus\]/gi, '[chorus]')
      .replace(/\[Bridge\]/gi, '[bridge]')
      .replace(/\[Intro\]/gi, '[intro]')
      .replace(/\[Outro\]/gi, '[outro]')
      .replace(/\[Pre-Chorus\]/gi, '[pre-chorus]')
      .replace(/\[Post-Chorus\]/gi, '[post-chorus]');

    // Check length after cleaning
    if (lyrics.length > 600) {
      lyrics = lyrics.substring(0, 590) + '...';
      console.log(`Lyrics truncated from ${lyrics.length} to 600 characters`);
    }
    if (lyrics.length < 10) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Lyrics too short after cleaning (minimum 10 characters)' })
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

    // Prepare the input payload
    const inputPayload = {
      prompt: lyricsPrompt,
      lyrics: lyrics
    };

    // Log what we're sending (for debugging)
    console.log('=== MiniMax API Request ===');
    console.log('prompt length:', lyricsPrompt.length);
    console.log('prompt:', lyricsPrompt);
    console.log('lyrics length:', lyrics.length);
    console.log('lyrics:', lyrics);
    console.log('===========================');

    // Step 1: Create prediction on Replicate using MiniMax Music-1.5
    const createResponse = await fetch('https://api.replicate.com/v1/models/minimax/music-1.5/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: inputPayload
      })
    });

    if (!createResponse.ok) {
      // Read response as text first (can only read body once!)
      const responseText = await createResponse.text();
      let error;

      // Try to parse as JSON
      try {
        error = JSON.parse(responseText);
      } catch (parseError) {
        // If JSON parsing fails, use the text as-is
        error = { message: responseText };
      }

      console.error('=== Replicate API Error ===');
      console.error('Status:', createResponse.status);
      console.error('Response text:', responseText);
      console.error('Parsed error:', JSON.stringify(error, null, 2));
      console.error('Sent payload:', JSON.stringify(inputPayload, null, 2));
      console.error('==========================');

      return {
        statusCode: createResponse.status,
        body: JSON.stringify({
          error: error.detail || error.message || 'Failed to create prediction',
          details: error
        })
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
