import { AutoComplete, Button, Input, Select } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

interface RegistrationRouterParams {
  id: string
}

interface RegistrationProps extends RouteComponentProps<RegistrationRouterParams> {
  //Add regular properties
}

interface RegistrationDispatchProps
  extends RegistrationProps,
    RouteComponentProps<RegistrationRouterParams> {

  }

export class Registration extends React.Component<RegistrationProps & RegistrationDispatchProps> {
  constructor(props: RegistrationProps & RegistrationDispatchProps) {
    super(props)
    this.state = {
      
    }
  }

  InputGroup = Input.Group;
  Option = Select.Option;

  public render() {
    const {  } = this.props

    return (
      <div>
        <this.InputGroup compact>
          <AutoComplete
            style={{ width: 200 }}
            placeholder="Email"
          />
        </this.InputGroup>
        <Button >Cancel</Button>{' '}
        <Button type="primary" >
          Save
        </Button>
      </div>
    )
  }

}
export default connect(

)(Registration)
