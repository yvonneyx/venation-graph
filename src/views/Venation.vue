<template>
  <div class="venation-graph-view">
    <div class="toolbar">
      <a-button @click="setViewMode">切换模式</a-button>
      <div>
        <span v-if="viewMode">查看模式</span>
        <span v-else>编辑模式</span>
      </div>
      <div>
        <ul v-if="viewMode">
          <li>
            <a-button @click="focusNode('最终特征')"
              >聚焦节点【最终特征】</a-button
            >
          </li>
          <li>
            <a-button @click="nodeFlyToCenter('最终特征')"
              >将节点移动到画布中心</a-button
            >
          </li>
          <li>使用【MiniMap】插件</li>
        </ul>
        <ul v-else>
          <li>使用【网格】插件</li>
          <li>支持拖拽节点调整结构</li>
        </ul>
      </div>
    </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import G6 from '@antv/g6'
import { nextTick, onMounted, ref, watch } from 'vue'
import { teslaSample } from '../data/teslaSample'
import '../utils/registerShape'
import contextMenu from '../plugins/contextMenu'
import { tooltip } from '../plugins/tooltip'
import { toolbar } from '../plugins/toolbar'
import { enableDragNode } from '../plugins/enableDragNode'

const data = ref<object>(teslaSample)

const minimap = new G6.Minimap()
const grid = new G6.Grid()

const viewMode = ref(true)

let graph

const setViewMode = async () => {
  viewMode.value = !viewMode.value
  await nextTick()
  graph.setMode(viewMode.value ? 'default' : 'edit')
  console.log(graph)
}

const drawgraph = () => {
  const width = 1200
  const height = 500
  graph = new G6.TreeGraph({
    container: 'container',
    width,
    height,
    modes: {
      default: ['click-select', 'drag-canvas', 'zoom-canvas'],
      edit: [],
    },
    defaultNode: {
      type: 'rect-with-count',
    },
    defaultEdge: {
      type: 'line-arrow',
    },
    nodeStateStyles: {
      active: {
        fillOpacity: 0,
        'text-shape': {
          fill: '#4572d9',
        },
      },
      selected: {
        fillOpacity: 0,
        'text-shape': {
          fill: '#4572d9',
        },
      },
    },
    layout: {
      type: 'compactBox',
      direction: 'H',
      getHeight: (nodeItem) => {
        return 20
      },
      getWidth: (nodeItem) => {
        return 220
      },
      getSide: (d) => {
        return d.data.placement
      },
    },
    plugins: [tooltip, toolbar, grid],
  })

  graph.data(data.value)
  graph.render()
  // graph.fitView()
  graph.fitCenter()

  graph.on('node:dblclick', (e) => {
    alert('dblclick')
  })

  graph.on('node:mouseenter', (e) => {
    graph.setItemState(e.item!, 'active', true)
  })

  graph.on('node:mouseleave', (e) => {
    graph.clearItemStates(e.item!, 'active')
  })

  const handleCollapse = (e) => {
    const target = e.target
    const id = target.get('modelId')
    const nodeItem = graph.findById(id)
    const nodeModel = nodeItem.getModel()
    graph.updateItem(nodeItem, {
      collapsed: !nodeModel.collapsed,
    })
    graph.layout(false)
  }

  graph.on('collapse-rect:click', (e) => {
    handleCollapse(e)
  })

  graph.on('collapse-text:click', (e) => {
    handleCollapse(e)
  })

  const menu = contextMenu(graph)
  graph.addPlugin(menu)

  // 拖拽子树调整结构
  enableDragNode(graph)
}

// 从外部获取node
const getNodeItem = (targetName) => {
  const nodeContainer = graph
    .get('group')
    .get('children')
    .find((e) => e.get('className') === 'node-container')

  return nodeContainer.find((e) => {
    const found = e.get('item')?.get('model')?.title
    return found && found === targetName
  })
}

const focusNode = (targetName) => {
  graph.setItemState(getNodeItem(targetName).get('item'), 'active', true)
}

const nodeFlyToCenter = (targetName) => {
  focusNode(targetName)
  graph.focusItem(getNodeItem(targetName).get('item'), true, {
    easing: 'easeCubic',
    duration: 400,
  })
}

const delaydrawgraph = () => {
  if (document.getElementById('container') == null) {
    delaydrawgraph()
  }
  drawgraph()
}

watch(viewMode, () => {
  if (viewMode.value) {
    graph.addPlugin(minimap)
  } else {
    graph.removePlugin(minimap)
  }
})

onMounted(() => {
  delaydrawgraph()
})
</script>

<style lang="less">
.toolbar {
  position: fixed !important;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

#container {
  border: 1px #ccc solid;
}

.g6-component-tooltip {
  background-color: rgba(0, 0, 0, 0.65);
  padding: 10px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  width: fit-content;
  color: #fff;
  border-radius: 4px;
}

.g6-component-toolbar {
  background-color: rgba(0, 0, 0, 0.65);
  padding: 10px;
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  width: fit-content;
  color: #fff;
  border-radius: 4px;
  display: flex;

  ul {
    padding-inline-start: 0px !important;
    display: flex;

    li {
      width: 85px;
      height: 5px;
    }
  }
}
</style>
