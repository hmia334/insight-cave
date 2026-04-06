import Dexie, { Table } from 'dexie';
import { Insight, Project, ChatMessage } from '../types';

class InsightCaveDB extends Dexie {
  insights!: Table<Insight>;
  projects!: Table<Project>;
  messages!: Table<ChatMessage>;

  constructor() {
    super('InsightCaveDB');
    this.version(1).stores({
      insights: '++id, createdAt, *tags, *relatedIds',
      projects: '++id, insightId, createdAt',
      messages: '++id, createdAt'
    });
  }
}

export const db = new InsightCaveDB();

// 工具函数
export const generateId = () => crypto.randomUUID();

export const createInsight = (content: string, tags: string[] = []): Insight => {
  const now = Date.now();
  return {
    id: generateId(),
    content,
    createdAt: now,
    updatedAt: now,
    tags,
    relatedIds: [],
    aiSummary: undefined
  };
};

export const createProject = (insightId: string, content: string): Project => {
  const now = Date.now();
  return {
    id: generateId(),
    insightId,
    content,
    createdAt: now,
    updatedAt: now
  };
};

export const createMessage = (role: 'user' | 'assistant', content: string): ChatMessage => {
  return {
    id: generateId(),
    role,
    content,
    createdAt: Date.now()
  };
};
