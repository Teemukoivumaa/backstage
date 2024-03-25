import Dagre from '@dagrejs/dagre';
import React, { useCallback, useMemo, useLayoutEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';
import { useEntity } from '@backstage/plugin-catalog-react';

import { Button } from '@material-ui/core';
import { generateFlowChartData } from './Calculation';
import 'reactflow/dist/style.css';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

g.setGraph({ rankdir: 'lb' });

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach(edge => g.setEdge(edge.source, edge.target));
  nodes.forEach(node => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map(node => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
  const entity = useEntity();

  const { fitView } = useReactFlow();
  const { inputNodes, inputEdges } = useMemo(
    () => generateFlowChartData(entity),
    [],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(inputNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(inputEdges);

  const onLayout = useCallback(
    direction => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      console.log(layouted);

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

  useLayoutEffect(() => {
    onLayout('TB');
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
      <Panel position="top-right">
        <Button
          variant="contained"
          color="primary"
          onClick={() => onLayout('TB')}
          style={{ marginRight: '0.5rem' }}
        >
          Vertical layout
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onLayout('LR')}
        >
          Horizontal layout
        </Button>
      </Panel>
    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
