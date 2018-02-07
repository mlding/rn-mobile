import { map, omit, pick, get } from 'lodash'

const convertQuantityFromWorkItemToReportLine = quantity => ({
  ...omit(quantity, ['id']),
  work_item_quantity: quantity.id,
  quantity: quantity.remaining_quantity,
  remaining_quantity: 0,
})

export const convertWorkItemToReportLine = workItem => ({
  ...pick(workItem, ['activity_code', 'network_element', 'requires_photo', 'network_operator']),
  work_item_descriptor: workItem.name,
  reference_from: get(workItem, 'network_element.go_from'),
  reference_to: get(workItem, 'network_element.go_to'),
  work_item: workItem.id,
  quantities: map(workItem.quantities, quantity =>
        convertQuantityFromWorkItemToReportLine(quantity)),
  work_item_completed: false,
  comments: '',
  is_active: true,
  pictures: [],
})

export const convertMaterialToReportLineQuantity = material => ({
  ...pick(material, ['material_category', 'quantity_description']),
  material_name: material.alias,
  material: material.id,
  quantity_description_unit_factor: material.unit_factor,
  quantity_description_unit_imperial: material.unit_imperial,
  quantity_description_unit_metric: material.unit_metric,
  quantity_description_unit_system: material.unit_system,
})

