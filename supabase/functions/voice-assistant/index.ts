import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  let openAISocket: WebSocket | null = null;
  let sessionConfig = {
    language: 'ar',
    context: ''
  };

  socket.onopen = () => {
    console.log("Client WebSocket connected");
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("Received from client:", message.type);

      if (message.type === 'config') {
        // Store configuration
        sessionConfig = {
          language: message.language || 'ar',
          context: message.context || ''
        };

        // Connect to OpenAI Realtime API
        openAISocket = new WebSocket(
          "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
          {
            headers: {
              "Authorization": `Bearer ${OPENAI_API_KEY}`,
              "OpenAI-Beta": "realtime=v1"
            }
          }
        );

        openAISocket.onopen = () => {
          console.log("Connected to OpenAI Realtime API");
          
          // Configure session after connection
          const languageInstructions: Record<string, string> = {
            'ar': 'أنت مساعد صوتي متخصص في تحليل المخططات الكهربائية. تحدث بالعربية بطريقة طبيعية واحترافية.',
            'fr': 'Vous êtes un assistant vocal spécialisé dans l\'analyse des schémas électriques. Parlez en français de manière naturelle et professionnelle.',
            'en': 'You are a voice assistant specialized in analyzing electrical schematics. Speak in English naturally and professionally.'
          };

          openAISocket?.send(JSON.stringify({
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: `${languageInstructions[sessionConfig.language]}\n\nContext: ${sessionConfig.context}\n\nYou can:\n- Read and explain the analysis\n- Answer questions about specific parts\n- Stop and repeat sections when asked\n- Correct errors in the analysis if found\n\nWhen correcting errors, use the 'correct_analysis' tool to update the text.`,
              voice: "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              tools: [
                {
                  type: "function",
                  name: "correct_analysis",
                  description: "Correct errors in the electrical schematic analysis",
                  parameters: {
                    type: "object",
                    properties: {
                      correctedText: {
                        type: "string",
                        description: "The corrected analysis text with errors fixed"
                      },
                      corrections: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of corrections made"
                      }
                    },
                    required: ["correctedText", "corrections"]
                  }
                }
              ],
              tool_choice: "auto",
              temperature: 0.8,
              max_response_output_tokens: "inf"
            }
          }));
        };

        openAISocket.onmessage = (aiEvent) => {
          try {
            const aiData = JSON.parse(aiEvent.data);
            console.log("Received from OpenAI:", aiData.type);

            // Handle function calls
            if (aiData.type === 'response.function_call_arguments.done') {
              const args = JSON.parse(aiData.arguments);
              
              if (aiData.name === 'correct_analysis') {
                // Send correction back to client
                socket.send(JSON.stringify({
                  type: 'analysis.updated',
                  updatedAnalysis: args.correctedText,
                  corrections: args.corrections
                }));

                // Send function response to OpenAI
                openAISocket?.send(JSON.stringify({
                  type: 'conversation.item.create',
                  item: {
                    type: 'function_call_output',
                    call_id: aiData.call_id,
                    output: JSON.stringify({ success: true })
                  }
                }));
              }
            }

            // Forward audio and transcripts to client
            if (
              aiData.type === 'response.audio.delta' ||
              aiData.type === 'response.audio_transcript.delta' ||
              aiData.type === 'response.audio.done' ||
              aiData.type === 'response.done'
            ) {
              socket.send(aiEvent.data);
            }
          } catch (error) {
            console.error("Error processing OpenAI message:", error);
          }
        };

        openAISocket.onerror = (error) => {
          console.error("OpenAI WebSocket error:", error);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Connection to AI failed'
          }));
        };

        openAISocket.onclose = () => {
          console.log("OpenAI WebSocket closed");
        };

      } else if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
        // Forward audio input to OpenAI
        openAISocket.send(event.data);
      }
    } catch (error) {
      console.error("Error handling client message:", error);
    }
  };

  socket.onclose = () => {
    console.log("Client WebSocket closed");
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});
