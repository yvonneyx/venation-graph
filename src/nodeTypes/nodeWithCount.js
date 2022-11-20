import G6 from '@antv/g6'

G6.registerNode(
	'node-with-count',
	{
	  draw: (cfg, group) => {
		const { id, title, collapsed, children, depth, originData, placement } =
		  cfg
  
		const { nodeType } = originData
		const rootNode = depth === 0
		const hasChildren = children && children.length !== 0
  
		const { childCountWidth, childCountHeight, itemPadding, rootPadding } =
		  BaseConfig
  
		const keyShapeAttrs = {
		  x: 0,
		  y: 0,
		  width: 1,
		  height: 1,
		  radius: 4,
		  fill: nodeStyleMap[nodeType]?.fillColor || defaultStyle.fillColor,
		  stroke: nodeStyleMap[nodeType]?.borderColor || defaultStyle.borderColor,
		  lineWidth:
			nodeStyleMap[nodeType]?.borderWidth || defaultStyle.borderWidth,
		  cursor: 'pointer',
		}
  
		const keyShape = group?.addShape('rect', {
		  attrs: keyShapeAttrs,
		  name: 'key-shape-rect-shape',
		})!
  
		const content =
		  title.length > 14 ? title.replace(/(.{14})/g, '$1\n') : title
  
		const text = group?.addShape('text', {
		  attrs: {
			text: content,
			x: 0,
			y: 0,
			textAlign: 'left',
			textBaseline: 'middle',
			fontFamily: defaultStyle.textStyle.fontFamily,
			fontSize: !rootNode
			  ? defaultStyle.textStyle.fontSize
			  : BaseConfig.rootFontSize,
			fontWeight: defaultStyle.textStyle.fontWeight,
			fill:
			  nodeStyleMap[nodeType]?.textStyle.fillStyle ||
			  defaultStyle.textStyle.fillStyle,
			cursor: 'pointer',
		  },
		  draggable: true,
		  cursor: 'pointer',
		  name: 'text-shape',
		  className: 'text-shape',
		})!
  
		const textBbox = text.getBBox()
		let width = textBbox.width + itemPadding
		let height = textBbox.height
		keyShape.attr({
		  x: 0,
		  y: -height / 2 - 6,
		  width,
		  height: height + 12,
		})
		text.attr({
		  x: itemPadding / 2,
		  y: 0,
		})
  
		if (rootNode) {
		  centerX = cfg?.x
  
		  keyShape.attr({
			width: width + rootPadding,
		  })
		  text.attr({
			x: itemPadding / 2 + rootPadding / 2,
			fontSize: BaseConfig.rootFontSize,
			fontWeight: 'bolder',
		  })
		}
  
		if (!rootNode && hasChildren) {
		  group?.addShape('rect', {
			attrs: {
			  x: placement === 'right' ? width : -childCountWidth,
			  y: -childCountHeight / 2,
			  width: childCountWidth,
			  height: childCountHeight,
			  radius: childCountWidth / 2,
			  stroke: 'rgba(0, 0, 0, 0.25)',
			  cursor: 'pointer',
			  fill: '#fff',
			},
			name: 'collapse-rect',
			modelId: id,
		  })
  
		  group?.addShape('text', {
			attrs: {
			  x:
				placement === 'right'
				  ? width + childCountWidth / 2
				  : -childCountWidth / 2,
			  y: collapsed ? 0 : -1,
			  width: childCountWidth,
			  textAlign: 'center',
			  textBaseline: 'middle',
			  text: collapsed ? `${children?.length}` : '-',
			  fontSize: 8,
			  cursor: 'pointer',
			  fill: 'rgba(0, 0, 0, 0.5)',
			},
			name: 'collapse-text-shape',
			modelId: id,
		  })
		}
  
		return keyShape!
	  },
	  update: (cfg, item) => {
		const group = item.getContainer()
		const icon = group.find((e) => e.get('name') === 'collapse-text-shape')
		icon.attr('text', cfg.collapsed ? `${cfg.children.length}` : '-')
		icon.attr('y', cfg.collapsed ? 0 : -1)
	  },
	},
	'rect',
  )