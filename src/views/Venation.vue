<template>
  <div class="venation-graph-view">
    <div class="toolbar">
      <ul>
        <li>
          <a-button @click="focusNode('最终特征')">聚焦节点【最终特征】</a-button>
        </li>
        <li>
          <a-button @click="nodeFlyToCenter('最终特征')">将节点移动到画布中心</a-button>
        </li>
      </ul>
    </div>
    <div id="container"></div>
  </div>
</template>

<script setup lang="ts">
import G6, { Util } from "@antv/g6";
import { onMounted, ref } from "vue";
import { teslaSample } from "../data/teslaSample";
import "../utils/registerShape";
import { menu } from "../plugins/contextMenu";
import { tooltip } from "../plugins/tooltip";
import { toolbar } from "../plugins/toolbar";
import { minimap } from "../plugins/minimap";
import { grid } from "../plugins/grid";
import "../behaviors/index";

const data = ref<object>(teslaSample);

let graph;

const drawgraph = () => {
  const width = 1200;
  const height = 500;

  graph = new G6.TreeGraph({
    container: "container",
    width,
    height,
    modes: {
      default: [
        "drag-canvas",
        "zoom-canvas",
        "click-node",
        "hover-node",
        "drag-node",
      ],
    },
    defaultNode: {
      type: "node-with-count",
    },
    defaultEdge: {
      type: "line-arrow",
    },
    nodeStateStyles: {
      active: {
        fillOpacity: 0,
        "text-shape": {
          fill: "#4572d9",
        },
      },
      selected: {
        fillOpacity: 0,
        "text-shape": {
          fill: "#4572d9",
        },
      },
    },
    layout: {
      type: "compactBox",
      direction: "H",
      getHeight: (nodeItem) => {
        return 20;
      },
      getWidth: (nodeItem) => {
        return 220;
      },
      getSide: (d) => {
        return d.data.placement;
      },
    },
    plugins: [tooltip, toolbar, grid, menu, minimap],
  });

  graph.data(data.value);
  graph.render();
  // graph.fitView();
  graph.fitCenter();
};

const findNode = (key, value) => {
  return graph.find("node", (node) => {
    return node.get("model")[key] === value;
  });
};

const focusNode = (targetName) => {
  graph.setItemState(findNode("title", targetName), "active", true);
};

const nodeFlyToCenter = (targetName) => {
  graph.focusItem(findNode("title", targetName), true, {
    easing: "easeCubic",
    duration: 400,
  });
};

const delaydrawgraph = () => {
  if (document.getElementById("container") == null) {
    delaydrawgraph();
  }
  drawgraph();
};

onMounted(() => {
  delaydrawgraph();
});
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
