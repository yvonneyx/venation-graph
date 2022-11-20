import G6 from '@antv/g6'

const enableDragNode = (graph) => {
  graph.addBehaviors(
    {
      type: 'drag-node',
      enableDelegate: true,
    },
    'edit',
  )
  let minDisNode
  let preX
  let preY

  console.log(graph)

  graph.on('node:dragstart', (e) => {
    console.log('dragstart')

    minDisNode = undefined
    const model = e.item.get('model')
    preX = model.x
    preY = model.y
    console.log(model)
  })
  graph.on('node:drag', (e) => {
    minDisNode = undefined
    const item = e.item
    const model = item.getModel()
    const nodes = graph.getNodes()
    let minDis = Infinity
    nodes.forEach((inode) => {
      graph.setItemState(inode, 'closest', false)
      const node = inode.getModel()
      if (node.id === model.id) return
      const dis =
        (node.x - e.x) * (node.x - e.x) + (node.y - e.y) * (node.y - e.y)
      if (dis < minDis) {
        minDis = dis
        minDisNode = inode
      }
    })
    if (minDis < 8000) graph.setItemState(minDisNode, 'closest', true)
    else minDisNode = undefined
  })
  graph.on('node:dragend', (e) => {
    const item = e.item
    console.log(item)

    const revoke = (item) => {
      // item.moveTo(preX, preY)
    }
    if (!minDisNode) {
      console.log('没有找到相邻的目标节点')
      revoke(item)
      return
    }
    const id = item.getID()
    const data = graph.findDataById(id)

    let isDescent = false
    const getParentNodeType = (node) => {
      return node.get('parent').get('model').originData.nodeType
    }
    const getNodeType = (node) => {
      // const id = item.getID()
      // const data = graph.findDataById(id)
      return node.get('model').originData.nodeType
    }

    // 父节点类型相同，且兄弟节点类型相同 才能更改
    if (getParentNodeType(item) === getNodeType(minDisNode)) {
      isDescent = true
    }

    if (!isDescent) {
      console.log('只能同类别调整')
      revoke(item)
      return
    }

    graph.removeChild(id)

    setTimeout(() => {
      const minDisNodeId = minDisNode.getID()
      const newParentData = graph.findDataById(minDisNodeId)
      let newChildren = newParentData.children
      if (newChildren) newChildren.push(data)
      else newChildren = [data]
      graph.updateChildren(newChildren, minDisNodeId)
      console.log('成功')
    }, 600)
  })
}

const disableDragNode = (graph) => {
  graph.removeBehaviors('drag-node', 'default')
}

export { enableDragNode, disableDragNode }
