import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Send } from 'lucide-react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, addInsight, isLoading } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const content = input.trim();
    setInput('');

    // 判断是保存灵感还是普通对话
    if (content.startsWith('记录:') || content.startsWith('保存:')) {
      const insightContent = content.replace(/^(记录:|保存:)\s*/, '');
      await addInsight(insightContent);
    } else {
      await sendMessage(content);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-[#6b7280] mt-8">
            <p className="text-lg mb-2">你好！我是灵感树洞 🦞</p>
            <p className="text-sm">随时把灵感丢给我，也可以说"记录：xxx"保存灵感</p>
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-[#a78bfa] text-white'
                  : 'bg-[#2a2a4a] text-[#e4e4e7]'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#2a2a4a] px-4 py-2 rounded-lg">
              <span className="animate-pulse">思考中...</span>
            </div>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="输入消息，或用「记录：xxx」保存灵感..."
          className="flex-1 bg-[#2a2a4a] border border-[#3a3a5a] rounded-lg px-4 py-3 text-[#e4e4e7] placeholder-[#6b7280] focus:outline-none focus:border-[#a78bfa]"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-[#a78bfa] hover:bg-[#8b5cf6] disabled:opacity-50 text-white rounded-lg px-4 py-3 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
