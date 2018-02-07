import { getStatusComparator } from '../sort'

describe('#sort', () => {
  const item1 = { status: 'approved', created: 5 }
  const item2 = { status: 'submitted', created: 3 }
  const item3 = { status: 'resubmitted', created: 0 }
  const item4 = { status: 'resubmitted', created: 1 }
  const item5 = { status: 'flagged', created: 0 }
  const item6 = { status: 'submitted', created: 0 }
  const item7 = { status: 'flagged', created: 0 }
  const item8 = { status: 'uknown', created: 0 }
  const array = [item1, item2, item3, item4, item5, item6, item7, item8]


  it('should sort by leadWorkStatusOrder when is leadworker ', () => {
    const input = [...array]
    const output = [item5, item7, item4, item3, item2, item6, item1, item8]

    const comparator = getStatusComparator(true)
    expect(input.sort(comparator)).toEqual(output)
  })

  it('should sort by managerStatusOrder when is manager ', () => {
    const input = [...array]
    const output = [item4, item3, item2, item6, item5, item7, item1, item8]

    const comparator = getStatusComparator(false)
    expect(input.sort(comparator)).toEqual(output)
  })
})
