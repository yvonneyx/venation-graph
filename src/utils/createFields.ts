export const createFields = (record) => {
  const {
    nodeType,
    ename,
    name,
    regionName,
    slaveRegionName,
    description,
    contact,
    dataSourceType,
    creator,
  } = record
  let fields: object[] = []

  switch (nodeType) {
    case 'FEATURE':
      fields = [
        {
          label: '特征英文名',
          content: ename,
        },
        {
          label: '特征中文名',
          content: name,
        },
        {
          label: '所属数据域',
          content:
            regionName + (slaveRegionName ? ` - ${slaveRegionName}` : ''),
        },
        {
          label: '特征描述',
          content: description,
        },
        {
          label: '特征负责人',
          content: contact,
        },
      ]
      break

    case 'DATA_SOURCE':
      fields = [
        {
          label: '数据源名称',
          content: name,
        },
        {
          label: '数据源标识',
          content: ename,
        },
        {
          label: '类型',
          content: dataSourceType,
        },
        {
          label: '数据源说明',
          content: description,
        },
        {
          label: '创建人',
          content: creator,
        },
      ]
      break
    case 'NEWTON_EVENT':
      fields = [
        {
          label: '事件名称',
          content: name,
        },
        {
          label: '事件标识',
          content: ename,
        },
      ]
      break
    case 'NEWTON_FIELD':
      fields = [
        {
          label: '特征中文名',
          content: name,
        },
        {
          label: '特征英文名',
          content: ename,
        },
      ]
      break
    default:
      break
  }
  return fields
}
