import PropTypes from 'prop-types'

export const QuantityShape = PropTypes.shape({
  id: PropTypes.number,
  estimated_quantity: PropTypes.number,
  quantity_description_unit_imperial: PropTypes.string,
  quantity_description_unit_metric: PropTypes.string,
  quantity_description_unit_system: PropTypes.string,
  is_primary_quantity: PropTypes.bool,
})

export const WorkItemMaterialShape = PropTypes.shape({
  id: PropTypes.number,
  material: PropTypes.number,
  quantity_description_unit_imperial: PropTypes.string,
  quantity_description_unit_metric: PropTypes.string,
  quantity_description_unit_system: PropTypes.string,
  material_name: PropTypes.string,
  estimated_quantity: PropTypes.number,
  quantity: PropTypes.number,
})

export const AsBuiltAnnotationShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  code: PropTypes.string,
  description: PropTypes.string,
  data_type: PropTypes.string,
  order: PropTypes.number,
  element_category: PropTypes.number,
  is_mandatory: PropTypes.bool,
})

export const NetworkElementShape = PropTypes.shape({
  go_from: PropTypes.string,
  go_to: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  the_geom: PropTypes.string,
  as_built_annotations: PropTypes.arrayOf(AsBuiltAnnotationShape),
  category: PropTypes.number,
})

export const WorkItemShape = PropTypes.shape({
  id: PropTypes.number,
  activity_code: PropTypes.string,
  name: PropTypes.string,
  quantities: PropTypes.arrayOf(QuantityShape),
  network_element: NetworkElementShape,
  work_order_name: PropTypes.string,
  work_item_materials: PropTypes.arrayOf(WorkItemMaterialShape),
  comments: PropTypes.string,
})

export const MapItemShape = PropTypes.shape({
  id: PropTypes.string,
  coordinate: PropTypes.object,
  workItems: PropTypes.arrayOf(WorkItemShape),
})

const Location = {
  longitude: PropTypes.number,
  latitude: PropTypes.number,
}

export const CoordinateShape = PropTypes.shape(Location)

export const LocationShape = PropTypes.shape({
  ...Location,
  altitude: PropTypes.number,
  accuracy: PropTypes.number,
  timestamp: PropTypes.string,
})

export const MapPickerLocationShape = PropTypes.shape({
  coordinate: CoordinateShape,
  address: PropTypes.string,
  inProgress: PropTypes.bool,
})

export const ImageShape = PropTypes.shape({
  id: PropTypes.number,
  picture: PropTypes.string,
  thumbnail: PropTypes.string,
})

export const ReportLinesShape = PropTypes.shape({
  activity_code: PropTypes.string,
  id: PropTypes.number,
  work_item: PropTypes.number,
  work_item_descriptor: PropTypes.string,
  work_item_completed: PropTypes.bool,
  completed_date: PropTypes.string,
  is_deleted: PropTypes.bool,
  comments: PropTypes.string,
  quantities: PropTypes.arrayOf(QuantityShape),
  reference_from: PropTypes.string,
  reference_to: PropTypes.string,
  pictures: PropTypes.arrayOf(ImageShape),
})

export const ReportShape = PropTypes.shape({
  id: PropTypes.number,
  documentReference: PropTypes.string,
  created_by_name: PropTypes.string,
  submitted_date: PropTypes.string,
  status: PropTypes.string,
  reported_date: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  approver_name: PropTypes.string,
  notes: PropTypes.string,
  comments: PropTypes.string,
  locations: PropTypes.arrayOf(LocationShape),
  production_lines: PropTypes.arrayOf(ReportLinesShape),
})

export const UserShape = PropTypes.shape({
  id: PropTypes.number,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  role: PropTypes.string,
})

export const AsBuiltRequirementsSharp = PropTypes.shape({
  id: PropTypes.number,
  data_type: PropTypes.string,
  element_category: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.string,
})

export const MaterialShape = PropTypes.shape({
  alias: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.number,
  material: PropTypes.number,
  material_category: PropTypes.number,
  material_category_name: PropTypes.string,
  network_operator: PropTypes.number,
  quantity_description: PropTypes.number,
  quantity_description_name: PropTypes.string,
  unit: PropTypes.number,
  unit_factor: PropTypes.string,
  unit_imperial: PropTypes.string,
  unit_metric: PropTypes.string,
  unit_name: PropTypes.string,
  unit_system: PropTypes.string,
})

export const WorkPackageFileSharp = PropTypes.shape({
  added: PropTypes.string,
  description: PropTypes.string,
  extension: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
  upload: PropTypes.string,
  work_package: PropTypes.number,
})

export const DownloadedFileShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  path: PropTypes.string,
})

export const ExtraLineShape = PropTypes.shape({
  id: PropTypes.number,
  uuid: PropTypes.string,
  name: PropTypes.string,
  quantity: PropTypes.number,
  rate: PropTypes.number,
  location: CoordinateShape,
  address: PropTypes.string,
  comments: PropTypes.string,
  description: PropTypes.string,
  quantity_description: PropTypes.number,
  quantity_description_unit_imperial: PropTypes.string,
  quantity_description_unit_metric: PropTypes.string,
  quantity_description_unit_system: PropTypes.string,
})

const ExtraWorkOrderBasicInfo = {
  id: PropTypes.number,
  location: CoordinateShape,
  created: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  submitted_date: PropTypes.string,
  approved_date: PropTypes.string,
  address: PropTypes.string,
  comments: PropTypes.string,
  notes: PropTypes.string,
  created_by: PropTypes.number,
  work_package: PropTypes.number,
  work_package_name: PropTypes.string,
  associated_work_order: PropTypes.number,
  generated_work_order: PropTypes.number,
  associated_work_order_name: PropTypes.string,
  approver: PropTypes.number,
}

export const ExtraWorkOrderBasicInfoShape = PropTypes.shape(ExtraWorkOrderBasicInfo)

export const ExtraWorkOrderShape = PropTypes.shape({
  ...ExtraWorkOrderBasicInfo,
  items: PropTypes.arrayOf(ExtraLineShape),
})

export const ExtraWorkOrderDraftShape = PropTypes.shape({
  basicInfo: ExtraWorkOrderBasicInfoShape,
  extraLines: PropTypes.arrayOf(ExtraLineShape),
})

export const QuantityDescriptionShape = PropTypes.shape({
  id: PropTypes.number,
  unit_imperial_name: PropTypes.string,
  unit_metric_name: PropTypes.string,
  standard_unit_system: PropTypes.string,
})

export const TimesheetLineShape = PropTypes.shape({
  id: PropTypes.number,
  created: PropTypes.string,
  comments: PropTypes.string,
  date: PropTypes.string,
  job_code: PropTypes.string,
  hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  time_sheet: PropTypes.number,
})

export const TimesheetBasicInfoShape = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.string,
  notes: PropTypes.string,
})

export const FilterItemShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  filterType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

export const TimesheetShape = PropTypes.shape({
  approved_date: PropTypes.string,
  approver: PropTypes.number,
  approver_name: PropTypes.string,
  comments: PropTypes.string,
  created: PropTypes.string,
  created_by: PropTypes.number,
  created_by_name: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.number,
  lines: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
  notes: PropTypes.string,
  reported_date: PropTypes.string,
  status: PropTypes.string,
  submitted_date: PropTypes.string,
})

export const StyleShape = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.arrayOf(PropTypes.any),
])

export const NotificationShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  itemId: PropTypes.string,
  refresh: PropTypes.bool,
})
