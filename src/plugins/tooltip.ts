import G6, { INode, NodeConfig } from '@antv/g6'
import { createFields } from '../utils/createFields'

export const tooltip = new G6.Tooltip({
  offsetX: -10,
  offsetY: 0,
  fixToNode: [0, 1],
  itemTypes: ['node'],
  trigger: 'mouseenter',
  shouldBegin: (e) => {
    const model = e?.item!.getModel()
    const arr = ['FEATURE', 'DATA_SOURCE', 'NEWTON_EVENT', 'NEWTON_FIELD']
    const nodeType = model?.originData.nodeType
    return arr.includes(nodeType)
  },
  getContent: (e) => {
    const outDiv = document.createElement('div')
    outDiv.style.width = '180px'

    const model = e?.item!.getModel()
    const field = createFields(model?.originData)

    outDiv.innerHTML += '<div>'
    field.forEach((field) => {
      outDiv.innerHTML += `<p>${field.label}: ${field.content}</p>`
    })
    outDiv.innerHTML += '</div>'
    return outDiv
  },
})
