export interface Insight {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  relatedIds: string[];
  aiSummary?: string;
}

export interface Project {
  id: string;
  insightId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}
