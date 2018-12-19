import { Button } from 'antd'
import React from 'react'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export class Home extends React.Component {
  constructor(props: any) {
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

  public openRegistration = () => {
    // todo
  }
}

export default connect()(Home)
