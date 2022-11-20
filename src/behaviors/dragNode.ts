
import G6, { TreeGraph, Node, Util, INode, TreeGraphData, Graph } from '@antv/g6'

G6.registerBehavior('drag-node', {
	getEvents() {
		return {
			'node:dragstart': 'dragstart',
			'node:drag': 'drag',
			'node:dragend': 'dragend',
			'node:dragenter': 'dragenter',
			'node:dragleave': 'dragleave',
		};
	},
	dragstart: function dragstart(e) {
		this.foundNode = undefined
		this.origin = {
			x: e.x,
			y: e.y,
		};
		this.targetItem = e.item;
		const graph = this.graph as TreeGraph
		// 未配置 shouldBegin 时 默认为 true
		// if (this.shouldBegin && !this.shouldBegin(graph.findDataById(this.targetItem?.getID()))) {
		// 	this.began = false;
		// 	return;
		// }
		this.began = true;
	},
	dragenter: function dragenter(e) {
		if (!this.began) {
			return;
		}
		const graph = this.graph as TreeGraph
		const foundNode = e.item as INode
		if (foundNode) graph.setItemState(foundNode, 'closest', true);
		this.foundNode = foundNode;
	},
	dragleave: function dragleave(e) {
		if (!this.began) {
			return;
		}
		const graph = this.graph as TreeGraph
		const foundNode = this.foundNode as INode
		if (foundNode) graph.setItemState(foundNode, 'closest', false);
		this.foundNode = null
	},
	drag: function drag(e) {
		if (!this.began) {
			return;
		}
		this.updateDelegate(e);
	},
	dragend: function dragend(e) {
		const graph = this.graph as TreeGraph
		if (this.delegateRect) {
			this.delegateRect.remove();
			this.delegateRect = null;
		}

		const foundNode = this.foundNode as INode
		if (foundNode) {
			graph.setItemState(foundNode, 'closest', false);
		} else {
			console.log('没有目标节点')
			return;
		}
		if (!this.began) {
			return;
		}
		this.began = false;

		const { item } = e;
		const id = item.getID();
		const data = graph.findDataById(id) as TreeGraphData

		const foundNodeId = foundNode.getID();
		const newParentData = graph.findDataById(foundNodeId) as TreeGraphData

		if (data.depth === 0) {
			console.log("根节点不能移动");
			return
		}
		let oriParentData;
		Util.traverseTree(graph.get('data'), (d) => {
			if (oriParentData) return false;
			if (d.children?.filter(child => child.id === id)?.length) {
				oriParentData = d;
			}
			return true;
		});

		// 定制规则： 只能在同一类别父节点的下一级移动
		let canDrag = false;
		const getNodeType = data => data.originData.nodeType
		if (getNodeType(oriParentData) === getNodeType(newParentData)) {
			canDrag = true
		}
		if (!canDrag) {
			console.log('不符合要求')
			return
		}

		graph.removeChild(id);
		setTimeout(() => {
			let newChildren = newParentData.children as TreeGraphData[]
			if (newChildren) newChildren.push(data);
			else newChildren = [data];
			graph.updateChildren(newChildren, foundNodeId);
			console.log('成功')
		}, 600);
	},
	updateDelegate(e) {
		const graph = this.graph as Graph
		if (!this.delegateRect) {

			const parent = graph.get('group');
			const attrs = {
				fill: '#F3F9FF',
				fillOpacity: 0.5,
				stroke: '#1890FF',
				strokeOpacity: 0.9,
				lineDash: [5, 5],
			};

			const { x: cx, y: cy, width, height, minX, minY } = this.calculationGroupPosition(e);
			this.originPoint = { x: cx, y: cy, width, height, minX, minY };

			this.delegateRect = parent.addShape('rect', {
				attrs: {
					width,
					height,
					x: cx,
					y: cy,
					...attrs,
				},
				name: 'rect-delegate-shape',
			});
			this.delegateRect.set('capture', false);
		} else {
			const clientX = e.x - this.origin.x + this.originPoint.minX;
			const clientY = e.y - this.origin.y + this.originPoint.minY;
			this.delegateRect.attr({
				x: clientX,
				y: clientY,
			});
		}
	},
	calculationGroupPosition(evt) {
		let node = this.targetItem as INode
		if (!node) {
			node = evt.item;
		}

		const bbox = node.getBBox();
		const { minX, minY, maxX, maxY } = bbox;

		return {
			x: Math.floor(minX),
			y: Math.floor(minY),
			width: Math.ceil(maxX) - Math.floor(minX),
			height: Math.ceil(maxY) - Math.floor(minY),
			minX,
			minY,
		};
	},
})
