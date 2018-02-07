import { omit, remove, reduce, findIndex, concat, get } from 'lodash'

export const combineAsBuilt = (asBuiltAnnotations, asBuiltRequirements) =>
  reduce(asBuiltRequirements, (result, asBuiltRequirement) => {
    if (findIndex(asBuiltAnnotations, ['name', asBuiltRequirement.name]) === -1) {
      return concat(result, asBuiltRequirement)
    }
    return result
  }, asBuiltAnnotations)

export const mapListWithAsBuiltRequirements = (list, asBuiltRequirements) => list.map(item => {
  if (!get(item, 'network_element.category')) {
    return item
  }
  const asBuiltRequirementsFilter = remove([...asBuiltRequirements],
      asBuilt => get(asBuilt, 'element_category') === item.network_element.category)
  const asBuiltRequirementsFilterOmit = asBuiltRequirementsFilter.map(temp =>
      omit(temp, ['created', 'description', 'order', 'is_mandatory']),
    )
  const asBuiltCombine = combineAsBuilt(get(item, 'network_element.as_built_annotations', []),
      asBuiltRequirementsFilterOmit)
  return {
    ...item,
    network_element: {
      ...item.network_element,
      as_built_annotations: asBuiltCombine,
    },
  }
})
