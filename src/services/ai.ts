import axios from 'axios';
import { Insight } from '../types';

// TODO: 替换为实际的 API Key（在 .env 文件中配置 VITE_AI_API_KEY）
const API_KEY = import.meta.env.VITE_AI_API_KEY || '';
const BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

// 智谱 GLM 调用
export const callAI = async (messages: { role: string; content: string }[]): Promise<string> => {
  if (!API_KEY) {
    return '请配置 AI API Key';
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: 'glm-4',
        messages
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI 调用失败:', error);
    return 'AI 调用失败，请稍后重试';
  }
};

// 分析灵感关联
export const analyzeRelations = async (
  newInsight: Insight,
  existingInsights: Insight[]
): Promise<string[]> => {
  if (existingInsights.length === 0) return [];

  const context = existingInsights
    .slice(0, 20)
    .map(i => `- ${i.content}`)
    .join('\n');

  const prompt = `
我有一个新灵感："${newInsight.content}"

现有灵感库：
${context}

请分析新灵感与现有灵感的关联性，返回关联的灵感ID列表（最多10个），格式要求：
- 只返回ID，多个用逗号分隔
- 如果没有明显关联，返回空

现有灵感ID对应关系：
${existingInsights.map(i => `${i.id}: ${i.content.substring(0, 30)}...`).join('\n')}
`;

  const result = await callAI([
    { role: 'user', content: prompt }
  ]);

  // 解析返回的 ID
  const ids = result
    .split(/[,，]/)
    .map(s => s.trim())
    .filter(s => s && existingInsights.some(i => i.id === s))
    .slice(0, 10);

  return ids;
};

// 生成方案
export const generateProject = async (
  mainInsight: Insight,
  relatedInsights: Insight[]
): Promise<string> => {
  const relatedContent = relatedInsights
    .map(i => `- ${i.content}`)
    .join('\n');

  const prompt = `
我有一个核心灵感想法：【${mainInsight.content}】

已关联的相关灵感：
${relatedContent || '无'}

请基于以上灵感，帮我生成一个完整的、可执行的方案。
方案需要包含：
1. 项目目标
2. 实施步骤（可执行的具体动作）
3. 可能的风险与对策
4. 需要的资源

请根据灵感内容自行判断最合适的方案框架（可以是用OKR、SWOT、商业画布或其他适合的方式）。
`;

  const result = await callAI([
    { role: 'user', content: prompt }
  ]);

  return result;
};
