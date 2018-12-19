import { Button } from 'antd'
import React from 'react'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

interface HomeProps {}

interface HomeDispatchProps extends HomeProps {}

export class Home extends React.Component<HomeProps & HomeDispatchProps> {
  constructor(props: HomeProps & HomeDispatchProps) {
    super(props)
    this.state = {}
  }
  public render() {
    const {} = this.props

    return (
      <Link to="/registration">
        <div className="home">
          <Button>Registration</Button>
        </div>
      </Link>
    )
  }

  public openRegistration = () => {}
}

export default connect()(Home)
