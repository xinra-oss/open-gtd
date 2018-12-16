import { Button } from 'antd'
import React from 'react'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

interface HomeProps {
  
}

interface HomeDispatchProps
  extends HomeProps {

  }


export class Home extends React.Component<HomeProps & HomeDispatchProps> {
  constructor(props: HomeProps & HomeDispatchProps) {
    super(props)
    this.state = {
      
    } 
  }
  public render() {
    const {  } = this.props

    return (
      <Link to='/registration'>
      <div className="home">
          <Button>Registration</Button>
      </div>
      </Link>
    )
  }

  openRegistration = () => {
    
  }

}

export default connect(

)(Home)
