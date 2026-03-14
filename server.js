const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-9bed7db4b65040de93b4777da17c6028', // 已嵌入你的密钥
});

app.post('/api/chat', async (req, res) => {
  try {
    const { profession, values, cardName, cardDesc, question } = req.body;
    const valuesStr = values.join('、');
    const prompt = `你是一个未来学家，正在帮助一位青少年探索未来职业。他的理想职业是「${profession}」，价值观是「${valuesStr}」。他抽到了一张未来趋势卡：「${cardName}」——${cardDesc}。他问：${question}。请结合他的职业和价值观，给出有洞察力的、启发性的回答（约100-150字），帮助他思考这个趋势可能带来的机会或挑战。`;

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI服务出错' });
  }
});

app.listen(3000, () => {
  console.log('✅ AI代理服务器运行在 http://localhost:3000');
});