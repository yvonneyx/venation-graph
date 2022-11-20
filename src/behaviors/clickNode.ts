
import G6, { TreeGraph } from '@antv/g6'

G6.registerBehavior('click-node', {
	getEvents() {
		return {
			'node:click': 'onNodeClick',
			'canvas:click': 'onCanvasClick'
		};
	},
	onNodeClick(e) {
		const { item, target } = e;
		const shape = target;
		const shapeName = shape.cfg.name;
		const graph = this.graph as TreeGraph

		// 点击收起/展开 icon
		if (shapeName === 'collapse-rect-shape' || shapeName === 'collapse-text-shape') {
			const model = item.getModel();
			const updatedCollapsed = !model.collapsed;
			graph.updateItem(item, { collapsed: updatedCollapsed });
			graph.layout(false);
			return;
		}

		// 选中节点
		graph.getNodes().forEach(node => {
			graph.setItemState(node, 'selected', false);
		});
		graph.setItemState(item, 'selected', true);

		return;
	},
	onCanvasClick(e) {
		const graph = this.graph as TreeGraph
		graph.getNodes().forEach(node => {
			graph.setItemState(node, 'selected', false);
			graph.setItemState(node, 'active', false);
		})
	}
})