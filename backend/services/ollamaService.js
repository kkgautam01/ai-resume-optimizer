const axios = require('axios');
const env = require('dotenv')
const model = 'gemma3:1b';
const ollamaBaseURL = env.OLLAMA_URL || 'http://ollama:11434';

const promptBuilder = (text, keywords, action) => {
    console.log(action)
  switch (action) {
    case 'format':
      return `Format and correct grammar in this text:\n\n${text}`;
    case 'suggest':
      return `Suggest improvements and rewrite this:\n\n${text}`;
    case 'keywords':
      return `Match exact occurance of keywords : \n\n ${keywords}
       \n\n in the article : \n\n ${text} `;
    default:
      return text;
  }
};

async function processRequest(text, keywords, action, res) {
    const prompt = promptBuilder(text, keywords, action);
    const url = ollamaBaseURL+ "/api/generate";
    console.log(prompt);

    const response = await axios.post(url, {
        model,
        prompt,
        stream: true
    },
    {
        responseType: 'stream',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    res.setHeader('Content-Type', 'application/json');
    response.data.pipe(res);
}

module.exports = { processRequest };
