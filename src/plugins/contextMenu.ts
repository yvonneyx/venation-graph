import G6 from '@antv/g6'

export default (graph) => {
  const menu = new G6.Menu({
    offsetX: 6,
    offsetY: 10,
    itemTypes: ['node'],
    getContent(e) {
      const outDiv = document.createElement('div')
      outDiv.style.width = '180px'
      outDiv.innerHTML = `<ul>
      <li class="operation_1">操作1</li>
      <li class="operation_2">操作2</li>
      <li class="operation_3">操作3</li>
    </ul>`
      return outDiv
    },
    handleMenuClick(target, item) {
      console.log('menu点击项classname：', target.className)
      console.log('item相关信息：', item.get('model'))
    },
  })
  return menu
}
