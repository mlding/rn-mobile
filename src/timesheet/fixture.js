export const timesheetLines = [{ //eslint-disable-line
  uuid: '111',
  date: '',
  job_code: 'jobCode 1',
  hours: 2,
},
{
  uuid: '123',
  date: '',
  job_code: 'jobCode 2',
  hours: 8,
},
{
  uuid: '134',
  date: '',
  job_code: 'jobCode 3',
  hours: 5,
}]

export const timesheet = {
  id: 45,
  approver_name: 'Bill Quora',
  created_by_name: 'Bernie Quor',
  lines: [{
    id: 50,
    created: '2017-11-24T07:35:36Z',
    comments: null,
    date: '2017-10-01',
    job_code: 'joncode',
    hours: 12.3,
    time_sheet: 45,
  }],
  name: '17-11-24-BQ-3',
  created: '2017-11-24T07:35:36Z',
  reported_date: '2017-11-24T07:35:36Z',
  submitted_date: '2017-11-28T08:57:08Z',
  approved_date: null,
  digital_signature: 'mobile',
  notes: 'notes',
  description: 'descrt',
  comments: 'test',
  status: 'resubmitted',
  created_by: 16,
  approver: 17,
}

export const timesheetDraft = {
  ...timesheet,
}
