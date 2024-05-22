// src/api/openaiApi.js
import axios from 'axios';

const { VITE_VUE_OPENAIAPI_KEY } = import.meta.env;

const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

const systemInstructions = "You are a helpful travel assistant. Your goal is to help users with travel-related questions, such as recommending destinations, providing information about flights and hotels, suggesting activities and attractions, and giving general travel advice. Make sure your responses are concise, informative, and friendly. and You have to answer in Korean";

export const getBotResponse = async (userMessage) => {
  try {
    const response = await axios.post(openaiEndpoint, {
      model: "gpt-4o",
      "messages": [
        {
          "role": "system",
          "content": `${systemInstructions}`
        },
        {
          "role": "user",
          "content": userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      top_p: 1.0,
      frequency_penalty: 0,
      presence_penalty: 0
    }, {
      headers: {
        'Authorization': `Bearer ${VITE_VUE_OPENAIAPI_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data.choices[0]);

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return 'Sorry, I couldn\'t process your request.';
  }
};
