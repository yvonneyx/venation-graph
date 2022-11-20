import G6 from '@antv/g6'
import { createFields } from '../utils/createFields'

export const tooltip = new G6.Tooltip({
  offsetX: -10,
  offsetY: 0,
  fixToNode: [0, 1],
  itemTypes: ['node'],
  trigger: 'mouseenter',
  shouldBegin: (evt) => {
    const arr = ['FEATURE', 'DATA_SOURCE', 'NEWTON_EVENT', 'NEWTON_FIELD']
    const nodeType = evt?.item!.getModel().originData.nodeType
    return arr.includes(nodeType)
  },
  getContent: (evt) => {
    const outDiv = document.createElement('div')
    outDiv.style.width = '180px'

    const model = evt?.item!.getModel()
    const field = createFields(model?.originData)

    outDiv.innerHTML += '<div>'
    field.forEach((field) => {
      outDiv.innerHTML += `<p>${field.label}: ${field.content}</p>`
    })
    outDiv.innerHTML += '</div>'
    return outDiv
  },
})
