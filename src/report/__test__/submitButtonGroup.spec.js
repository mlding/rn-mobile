import React from 'react'
import { noop } from 'lodash'
import { shallow } from 'enzyme'
import SubmitButtonGroup from '../../shared/submitButtonGroup'
import Button from '../../components/button'

describe('<ReportStatus />', () => {
  it('should render submitButtonGroup correctly if is active', () => {
    const submitButtonGroup = shallow(
      <SubmitButtonGroup
        onSaveDraft={noop}
        onSubmitReport={noop}
        isButtonActive
      />)
    expect(submitButtonGroup.length).toEqual(1)
    expect(submitButtonGroup.find(Button).length).toEqual(2)
  })
})
