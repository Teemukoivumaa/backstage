export function generateFlowChartData(inputObject) {
  const inputNodes = [];
  const inputEdges = [];

  // Function to generate a unique ID for each relation
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  console.debug(inputObject.entity);

  // Create master node
  const masterNodeId = 'master';
  inputNodes.push({
    id: masterNodeId,
    data: { label: inputObject.entity.metadata.name },
    position: { x: 0, y: 0 }, // You can set the position of the master node as desired
  });

  // Parse relations and create inputNodes and inputEdges
  inputObject.entity.relations.forEach(relation => {
    const sourceId = relation.source
      ? relation.source
      : relation.targetRef.split(':')[1];
    const targetId = relation.targetRef;
    const edgeId = generateId();

    if (!inputNodes.find(node => node.id === targetId)) {
      inputNodes.push({
        id: targetId,
        type: relation.type,
        data: { label: targetId },
        position: { x: 0, y: 0 }, // Random position for now
        style: { backgroundColor: '#6ede87', color: 'white' },
      });
    }

    // Create edge connecting to master node if relation type is "ownedBy"
    if (relation.type === 'ownedBy') {
      inputEdges.push({
        id: edgeId,
        source: targetId,
        label: relation.type,
        target: masterNodeId,
        animated: true,
      });
    } else {
      // Otherwise, create edge connecting to master node
      inputEdges.push({
        id: edgeId,
        source: masterNodeId,
        label: relation.type,
        target: targetId,
        animated: true,
      });
    }
  });

  return { inputNodes, inputEdges };
}
