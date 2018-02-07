import React from 'react'
import { Text } from 'react-native'
import { noop } from 'lodash'
import { shallow } from 'enzyme'
import { AsBuiltAnnotationComponent } from '../asBuiltAnnotation'
import { workItemListCategory1 } from '../fixture'
import TextField from '../../components/textField'

describe('<AsBuiltAnnotation />', () => {
  it('should render AsBuiltAnnotation component with null AsBuiltAnnotation', () => {
    const wrapper = shallow(
      <AsBuiltAnnotationComponent
        item={workItemListCategory1[0]}
        asBuiltAnnotation={null}
        updateAsBuilt={noop}
        editable
      />,
    )
    expect(wrapper.find(Text).length).toEqual(1)
    expect(wrapper.find(TextField).length).toEqual(1)
  })
})
