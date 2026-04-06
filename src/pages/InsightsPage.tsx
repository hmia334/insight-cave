import { useStore } from '../hooks/useStore';
import { Trash2, Link2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function InsightsPage() {
  const { insights, deleteInsight, generateProject, isLoading, getRelatedInsights } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleGenerate = async (id: string) => {
    await generateProject(id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-3">
        {insights.length === 0 && (
          <div className="text-center text-[#6b7280] mt-8">
            <p>还没有灵感，快去聊天页记录吧</p>
            <p className="text-sm mt-2">可以说"记录：我的第一个灵感"</p>
          </div>
        )}

        {insights.map(insight => {
          const relatedCount = getRelatedInsights(insight.id).length;
          const isSelected = selectedId === insight.id;

          return (
            <div
              key={insight.id}
              onClick={() => setSelectedId(isSelected ? null : insight.id)}
              className={`bg-[#2a2a4a] rounded-lg p-4 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-[#a78bfa]' : 'hover:bg-[#32324a]'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <p className="flex-1 text-[#e4e4e7]">{insight.content}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteInsight(insight.id);
                  }}
                  className="text-[#6b7280] hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-[#6b7280]">
                <span>{formatDate(insight.createdAt)}</span>
                {relatedCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Link2 size={12} /> {relatedCount} 个关联
                  </span>
                )}
              </div>

              {/* 展开操作区域 */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-[#3a3a5a] flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerate(insight.id);
                    }}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#a78bfa] hover:bg-[#8b5cf6] disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    <Sparkles size={14} />
                    生成方案
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
