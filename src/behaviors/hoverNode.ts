
import G6, { TreeGraph } from '@antv/g6'

G6.registerBehavior('hover-node', {
	getEvents() {
		return {
			'node:mouseenter': 'onNodeHover',
			"node:mouseleave": 'onNodeBlur'
		};
	},
	onNodeHover(e) {
		const graph = this.graph as TreeGraph
		graph.setItemState(e.item!, "active", true);
	},
	onNodeBlur(e) {
		const graph = this.graph as TreeGraph
		graph.setItemState(e.item!, "active", false);
	}
})