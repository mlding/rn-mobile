const workItemDetailObj = {
  'id': 4666,
  'activity_code': '412a',
  'name': 'string',
  'work_order': 87,
  'work_order_name': 'Cabling',
  'work_order_schedule_end_date': '2017-07-20T03:33:35Z',
  'quantities': [
    {
      'id': 1353,
      'quantity_description_unit_imperial': 'ft',
      'quantity_description_unit_metric': 'm',
      'quantity_description_unit_system': 'metric',
      'material_name': 'STUB-432F',
      'estimated_quantity': 100,
      'quantity': 100,
      'is_primary_quantity': true,
    },
  ],
  'attachments': [
    {
      'name': 'CAD.pdf',
      'file_url': 'http://example/a.pdf',
    },
  ],
}

export const workItemsForMap = [
  {
    'id': 4313,
    'activity_code': '412A',
    'name': 'Setup splice case',
    'network_element': {
      'id': 'ne-01',
      'the_geom': '{"coordinates": [-91.90216779871662, 39.148406432505595], "type": "Point"}',
    },
  },

  {
    'id': 4314,
    'activity_code': '412A',
    'name': 'Setup splice case',
    'network_element': {
      'id': 'ne-02',
      'the_geom': '{"coordinates": [[-91.90216779871663, 39.148406432505595], [114.404546, 30.509236]], "type": "MultiPoint"}',
    },
  },

  {
    'id': 4315,
    'activity_code': '412A',
    'name': 'Setup splice case',
    'network_element': {
      'id': 'ne-03',
      'the_geom': '{"coordinates": [[-91.90216779871632, 39.148406432505595], [114.404546, 30.509236]], "type": "LineString"}',
    },
  },

  {
    'id': 4316,
    'activity_code': '412A',
    'name': 'Setup splice case',
    'network_element': {
      'id': 'ne-04',
      'the_geom': '{"coordinates": [[[-91.90316779871362, 39.148406432505595], [114.404546, 30.509236]]], "type": "MultiLineString"}',
    },
  },

  {
    'id': 4317,
    'activity_code': '412A',
    'name': 'Setup splice case',
    'network_element': {
      'id': 'ne-05',
      'the_geom': '{"coordinates": [[[114.399202, 30.518331], [114.396433, 30.507257], [114.408338, 30.503381]]], "type": "Polygon"}',
    },
  },

  {
    'id': 4318,
    'activity_code': '413A',
    'name': 'Setup splice case',
    'network_element': {
      'id': 'ne-06',
      'the_geom': '{"coordinates": [[[[114.399303, 30.518331], [114.396433, 30.507257], [114.408338, 30.503381]]], [[[114.415536, 30.523037], [114.414982, 30.5175], [114.423011, 30.517777]]]], "type": "MultiPolygon"}',
    },
  },

  {
    'id': 6125,
    'activity_code': '413A',
    'name': 'Setup splice case',
    'region_center_position_longitude': -119.248605897669,
    'region_center_position_latitude': 50.2532723340837,
    'network_element': null,
  },
]

export const workItemsForMapGroup = [
  ...workItemsForMap,
  {
    'id': 4319,
    'activity_code': '412B',
    'name': 'Setup splice case 2',
    'network_element': {
      'id': 'ne-01',
      'the_geom': '{"coordinates": [-91.90216779871662, 39.148406432505595], "type": "Point"}',
    },
  },

  {
    'id': 4320,
    'activity_code': '412B',
    'name': 'Setup splice case 2',
    'network_element': {
      'id': 'ne-02',
      'the_geom': '{"coordinates": [[-91.90216779871663, 39.148406432505595], [114.404546, 30.509236]], "type": "MultiPoint"}',
    },
  },

  {
    'id': 4321,
    'activity_code': '412B',
    'name': 'Setup splice case 2',
    'network_element': {
      'id': 'ne-03',
      'the_geom': '{"coordinates": [[-91.90216779871632, 39.148406432505595], [114.404546, 30.509236]], "type": "LineString"}',
    },
  },

  {
    'id': 4322,
    'activity_code': '412B',
    'name': 'Setup splice case 2',
    'network_element': {
      'id': 'ne-04',
      'the_geom': '{"coordinates": [[[-91.90316779871362, 39.148406432505595], [114.404546, 30.509236]]], "type": "MultiLineString"}',
    },
  },

  {
    'id': 4323,
    'activity_code': '412B',
    'name': 'Setup splice case 2',
    'network_element': {
      'id': 'ne-05',
      'the_geom': '{"coordinates": [[[114.399202, 30.518331], [114.396433, 30.507257], [114.408338, 30.503381]]], "type": "Polygon"}',
    },
  },

  {
    'id': 4324,
    'activity_code': '413B',
    'name': 'Setup splice case 2',
    'network_element': {
      'id': 'ne-06',
      'the_geom': '{"coordinates": [[[[114.399303, 30.518331], [114.396433, 30.507257], [114.408338, 30.503381]]], [[[114.415536, 30.523037], [114.414982, 30.5175], [114.423011, 30.517777]]]], "type": "MultiPolygon"}',
    },
  },
]

export default workItemDetailObj

export const workItemsForWithWorkOrder = [
  workItemDetailObj,
  {
    ...workItemDetailObj,
    'id': 4777,
  },
  {
    ...workItemDetailObj,
    'id': 4888,
    'work_order': 79,
    'work_order_name': 'Distribution Network',
    'work_order_schedule_end_date': '2017-10-21T04:33:35Z',
  },
  {
    ...workItemDetailObj,
    'id': 4999,
    'work_order': 99,
    'work_order_name': 'DBO',
    'work_order_schedule_end_date': null,
  },
]

export const workPackageFiles = [{ 'id': 12,
  'upload': 'cached uri 12',
  'name': 'DPR big file1',
  'extension': 'pdf',
  'work_package': 27 },
{ 'id': 34,
  'upload': 'cached uri 34',
  'name': 'DPR big file1',
  'extension': 'pdf',
  'work_package': 27 }]

export const downloadedFiles = [{
  'id': 12,
  'name': 'DPR Sample.pdf',
  'path': 'local uri 12' },
{
  'id': 27,
  'name': 'DPR Sample2.pdf',
  'path': 'local uri 27' }]
