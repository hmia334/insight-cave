import { create } from 'zustand';
import { Insight, Project, ChatMessage } from '../types';
import { db, createInsight, createProject, createMessage } from '../services/database';
import { analyzeRelations, generateProject, callAI } from '../services/ai';

interface AppState {
  // 数据
  insights: Insight[];
  projects: Project[];
  messages: ChatMessage[];
  currentProject: Project | null;
  isLoading: boolean;

  // Actions
  loadInsights: () => Promise<void>;
  addInsight: (content: string) => Promise<void>;
  deleteInsight: (id: string) => Promise<void>;
  getRelatedInsights: (insightId: string) => Insight[];
  generateProject: (insightId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  insights: [],
  projects: [],
  messages: [],
  currentProject: null,
  isLoading: false,

  loadInsights: async () => {
    const insights = await db.insights.orderBy('createdAt').reverse().toArray();
    set({ insights });
  },

  addInsight: async (content: string) => {
    set({ isLoading: true });

    // 创建新灵感
    const newInsight = createInsight(content);
    const existingInsights = get().insights;

    // AI 分析关联
    const relatedIds = await analyzeRelations(newInsight, existingInsights);
    newInsight.relatedIds = relatedIds;

    // 保存到数据库
    await db.insights.add(newInsight);

    // 更新状态
    set(state => ({
      insights: [newInsight, ...state.insights],
      isLoading: false
    }));
  },

  deleteInsight: async (id: string) => {
    await db.insights.delete(id);
    set(state => ({
      insights: state.insights.filter(i => i.id !== id)
    }));
  },

  getRelatedInsights: (insightId: string) => {
    const { insights } = get();
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return [];

    return insights.filter(i => insight.relatedIds.includes(i.id));
  },

  generateProject: async (insightId: string) => {
    set({ isLoading: true });

    const { insights } = get();
    const mainInsight = insights.find(i => i.id === insightId);
    if (!mainInsight) {
      set({ isLoading: false });
      return;
    }

    const relatedInsights = get().getRelatedInsights(insightId);
    const content = await generateProject(mainInsight, relatedInsights);

    const project = createProject(insightId, content);
    await db.projects.add(project);

    set(state => ({
      projects: [project, ...state.projects],
      currentProject: project,
      isLoading: false
    }));
  },

  sendMessage: async (content: string) => {
    const userMsg = createMessage('user', content);
    await db.messages.add(userMsg);

    set(state => ({
      messages: [...state.messages, userMsg]
    }));

    // 调用 AI
    const allMessages = get().messages.map(m => ({
      role: m.role,
      content: m.content
    }));
    allMessages.push({ role: 'user', content });

    const reply = await callAI(allMessages);

    const assistantMsg = createMessage('assistant', reply);
    await db.messages.add(assistantMsg);

    set(state => ({
      messages: [...state.messages, assistantMsg]
    }));
  },

  clearMessages: async () => {
    await db.messages.clear();
    set({ messages: [], currentProject: null });
  }
}));
