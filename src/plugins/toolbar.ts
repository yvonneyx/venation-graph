import G6 from '@antv/g6'

export const toolbar = new G6.ToolBar({
  position: { x: window.innerWidth / 2 - 160, y: 0 },
  getContent(e) {
    const outDiv = document.createElement('div')
    outDiv.innerHTML = `<ul>
      <li code="zoomIn">Zoom in</li>
      <li code="zoomOut">Zoom out</li>
      <li code="zoomTo">Original Size</li>
      <li code="fitView">Fit View</li>
 </ul>`
    return outDiv
  },
  handleClick(code, graph) {
    switch (code) {
      case 'zoomIn':
        graph.zoom(1.1)
        break
      case 'zoomOut':
        graph.zoom(0.9)
        break
      case 'fitView':
        graph.fitView()
        break
      case 'zoomTo':
        graph.zoomTo(1)
        break
      default:
        break
    }
  },
})
