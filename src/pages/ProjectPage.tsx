import { useStore } from '../hooks/useStore';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ProjectPage() {
  const { projects, currentProject, generateProject, clearMessages, insights } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (currentProject) {
      await generateProject(currentProject.insightId);
    }
  };

  const getInsightContent = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    return insight?.content || '未知灵感';
  };

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[#6b7280]">
        <div className="text-center">
          <p className="text-lg mb-2">还没有生成方案</p>
          <p className="text-sm">在灵感库或图谱中点击生成方案</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#e4e4e7]">方案列表</h2>
          <button
            onClick={clearMessages}
            className="flex items-center gap-1 text-sm text-[#6b7280] hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
            清空
          </button>
        </div>

        {projects.map(project => (
          <div
            key={project.id}
            className={`bg-[#2a2a4a] rounded-lg p-4 ${
              currentProject?.id === project.id ? 'ring-2 ring-[#a78bfa]' : ''
            }`}
          >
            <div className="text-xs text-[#6b7280] mb-2">
              基于灵感：{getInsightContent(project.insightId).substring(0, 30)}...
            </div>

            <pre className="whitespace-pre-wrap text-[#e4e4e7] text-sm font-mono">
              {project.content}
            </pre>

            <div className="flex gap-2 mt-4 pt-4 border-t border-[#3a3a5a]">
              <button
                onClick={() => handleCopy(project.content)}
                className="flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#e4e4e7] transition-colors"
              >
                <Copy size={14} />
                {copied ? '已复制' : '复制'}
              </button>
              <button
                onClick={handleRegenerate}
                disabled={project.id !== currentProject?.id}
                className="flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#e4e4e7] disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={14} />
                重新生成
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
