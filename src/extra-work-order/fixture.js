export const workItems = [
  {
    id: 23,
    work_package: 27,
    work_package_name: 'Distribution Network - 27',
    work_order: 75,
    work_order_name: 'CIV.DBO - Distribution Network - 75',
    assign_to_person_full_name: 'Bernie Quor',
  },
  {
    id: 24,
    work_package: 28,
    work_package_name: 'Distribution Network - 28',
    work_order: 75,
    work_order_name: 'CIV.DBO - Distribution Network - 75',
    assign_to_person_full_name: 'Bernie Quor',
  },
  {
    id: 25,
    work_package: 27,
    work_package_name: 'Distribution Network - 27',
    work_order: 76,
    work_order_name: 'CIV.DBO - Distribution Network - 76',
    assign_to_person_full_name: 'Bernie Quor',
  },
  {
    id: 26,
    work_package: 28,
    work_package_name: 'Distribution Network - 28',
    work_order: 77,
    work_order_name: 'CIV.DBO - Distribution Network - 77',
    assign_to_person_full_name: 'Bernie Quor',
  },
  {
    id: 27,
    work_package: 29,
    work_package_name: 'Distribution Network - 29',
    work_order: 76,
    work_order_name: 'CIV.DBO - Distribution Network - 76',
    assign_to_person_full_name: 'Bernie Quor',
  },
]

export const workPackages = [
  {
    work_package: 27,
    work_package_name: 'Distribution Network - 27',
  },
  {
    work_package: 28,
    work_package_name: 'Distribution Network - 28',
  },
  {
    work_package: 29,
    work_package_name: 'Distribution Network - 29',
  },
]

export const workOrders = [
  {
    work_order: 75,
    work_order_name: 'CIV.DBO - Distribution Network - 75',
  },
  {
    work_order: 76,
    work_order_name: 'CIV.DBO - Distribution Network - 76',
  },
  {
    work_order: 77,
    work_order_name: 'CIV.DBO - Distribution Network - 77',
  },
]

export const descriptionQuantity = {
  id: 70,
  unit_imperial_name: 'in',
  unit_metric_name: 'mm',
  name: '10ft length',
  description: 'one each 10ft length',
  standard_unit_system: 'imperial',
  unit: 1,
}

export const extraLineWithUuid = {
  uuid: '169e1965-de28-7b7e-444c-841b04fee881',
  name: 'item name',
  quantity: 10,
  quantity_description: 70,
  rate: 200,
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  address: '',
  description: 'item descr',
  quantity_description_unit_imperial: 'in',
  quantity_description_unit_metric: 'mm',
  quantity_description_unit_system: 'imperial',
  comments: 'item comment',
  code: '',
}

export const extraLineWithId = {
  id: 13,
  name: 'item name',
  quantity: 10,
  quantity_description: 70,
  rate: 200,
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  address: '',
  description: 'item descr',
  quantity_description_unit_imperial: 'in',
  quantity_description_unit_metric: 'mm',
  quantity_description_unit_system: 'imperial',
  comments: 'item comment',
  code: '',
}

export const extraLineForSubmit = {
  name: 'item name',
  quantity: 10,
  quantity_description: 70,
  rate: 200,
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  address: '',
  description: 'item descr',
  comments: 'item comment',
  code: '',
}

export const extraLineForSubmitWithId = {
  id: 13,
  name: 'item name',
  quantity: 10,
  quantity_description: 70,
  rate: 200,
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  address: '',
  description: 'item descr',
  comments: 'item comment',
  code: '',
}

export const basicInfo = {
  name: 'extra work order name',
  work_package: 12,
  work_package_name: 'work_package_name 12',
  associated_work_order: 3,
  associated_work_order_name: 'associated_work_order_name 3',
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  description: 'description',
  notes: 'notes',
  address: 'address',
}

export const extraLineForm = {
  uuid: '2fea2c60-4fdd-c0d2-5fb7-14a04261b8d5',
  name: 'add item name',
  quantity: 13,
  quantity_description: 23,
  quantity_description_unit_imperial: 'quantity_description_unit_imperial',
  quantity_description_unit_metric: 'quantity_description_unit_metric',
  quantity_description_unit_system: 'quantity_description_unit_system',
  rate: 34,
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  address: 'address',
  comments: 'comments',
  description: 'description',
  code: '',
}

export const draftExtraWorkOrder = {
  basicInfo: basicInfo,
  extraLines: [extraLineForm],
}

export const extraWorkOrder = {
  name: 'extra work order name',
  work_package: 12,
  work_package_name: 'work_package_name 12',
  associated_work_order: 3,
  associated_work_order_name: 'associated_work_order_name 3',
  location: {
    longitude: -122.406580462504,
    latitude: 37.7860376705271,
  },
  description: 'description',
  notes: 'notes',
  address: 'address',
  items: [extraLineForm],
}

export default workItems
