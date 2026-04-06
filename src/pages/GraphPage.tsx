import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../hooks/useStore';

export default function GraphPage() {
  const { insights, getRelatedInsights, generateProject } = useStore();

  // 构建节点和边
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = insights.map((insight, index) => ({
      id: insight.id,
      data: { label: insight.content.substring(0, 20) + (insight.content.length > 20 ? '...' : '') },
      position: {
        x: 200 + Math.cos((index / insights.length) * 2 * Math.PI) * 150,
        y: 200 + Math.sin((index / insights.length) * 2 * Math.PI) * 150
      },
      style: {
        background: '#2a2a4a',
        color: '#e4e4e7',
        border: '#a78bfa',
        borderWidth: 2,
        borderRadius: 8,
        padding: 10,
        fontSize: 12,
        maxWidth: 180
      }
    }));

    const edgeList: Edge[] = [];
    insights.forEach(insight => {
      const related = getRelatedInsights(insight.id);
      related.forEach(rel => {
        edgeList.push({
          id: `${insight.id}-${rel.id}`,
          source: insight.id,
          target: rel.id,
          style: { stroke: '#a78bfa', strokeWidth: 1 },
          animated: true
        });
      });
    });

    return { nodes, edges: edgeList };
  }, [insights, getRelatedInsights]);

  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  const onNodeClick = useCallback(async (_event: React.MouseEvent, node: Node) => {
    const related = getRelatedInsights(node.id);
    if (related.length > 0) {
      await generateProject(node.id);
    }
  }, [getRelatedInsights, generateProject]);

  if (insights.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-[#6b7280]">
        <div className="text-center">
          <p className="text-lg mb-2">还没有灵感</p>
          <p className="text-sm">先去聊天页记录一些灵感吧</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="p-2 bg-[#1e1e2e] border-b border-[#3a3a5a] flex items-center justify-between">
        <span className="text-sm text-[#9ca3af]">
          点击有连线的节点生成方案
        </span>
        <span className="text-xs text-[#6b7280]">
          {nodes.length} 个灵感 · {edges.length} 条关联
        </span>
      </div>
      <div className="h-[calc(100%-40px)]">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background color="#3a3a5a" gap={20} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
