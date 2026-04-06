import { useState, useEffect } from 'react';
import { useStore } from './hooks/useStore';
import ChatPage from './pages/ChatPage';
import InsightsPage from './pages/InsightsPage';
import GraphPage from './pages/GraphPage';
import ProjectPage from './pages/ProjectPage';
import { MessageSquare, BookOpen, Network, FileText } from 'lucide-react';

type Tab = 'chat' | 'insights' | 'graph' | 'project';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const loadInsights = useStore(state => state.loadInsights);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const tabs = [
    { id: 'chat', label: '聊天', icon: MessageSquare },
    { id: 'insights', label: '灵感库', icon: BookOpen },
    { id: 'graph', label: '图谱', icon: Network },
    { id: 'project', label: '方案', icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-[#1e1e2e]/80 backdrop-blur-sm border-b border-[#3a3a5a] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
            💭 灵感树洞
          </h1>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'insights' && <InsightsPage />}
        {activeTab === 'graph' && <GraphPage />}
        {activeTab === 'project' && <ProjectPage />}
      </main>

      {/* 底部导航栏 */}
      <nav className="bg-[#1e1e2e]/80 backdrop-blur-sm border-t border-[#3a3a5a] px-6 py-2">
        <div className="max-w-6xl mx-auto flex justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-[#a78bfa] bg-[#a78bfa]/10'
                  : 'text-[#9ca3af] hover:text-[#e4e4e7]'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
