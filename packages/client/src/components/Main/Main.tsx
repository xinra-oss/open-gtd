import { UserEntity } from '@open-gtd/api'
import { Breadcrumb, Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router'
import { AppState, DispatchProps, mapDispatchToProps } from '../../store'
import { sessionActions } from '../../store/actions'
import AllTasks from './AllTasks/AllTasks'

interface MainProps extends DispatchProps, RouteComponentProps<{}> {
  user: UserEntity
}

interface State {
  readonly collapsed: boolean
}

const { SubMenu, ItemGroup } = Menu
const { Header, Content, Sider } = Layout

const mapStateToProps = (state: AppState) => ({ user: state.session.user })

class Main extends React.Component<MainProps, State> {
  //   constructor(props: any) {
  //     super(props)
  //     this.state = {
  //         collapsed: false
  //         }
  //     }
  public readonly state: State = {
    collapsed: false
  }

  public onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed })
  }

  public onLogout = () => {
    this.props.dispatch(sessionActions.deleteSession.request())
  }

  public render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1" className="item-left">
              <Icon
                type="plus-square"
                style={{ fontSize: '24px', color: '#fff' }}
                theme="outlined"
              />
              Create Task
            </Menu.Item>
            <SubMenu
              key="3"
              className="item-right"
              title={
                <span>
                  <Icon
                    type="user"
                    style={{ fontSize: '24px', color: '#fff' }}
                    theme="outlined"
                  />
                  {this.props.user.email}
                  <Icon
                    type="caret-down"
                    style={{ fontSize: '24px', color: '#fff' }}
                    theme="outlined"
                  />
                </span>
              }
            >
              <Menu.Item key="logout" onClick={this.onLogout}>
                Logout
              </Menu.Item>
              <Menu.Item key="cancel">Cancel</Menu.Item>
            </SubMenu>
          </Menu>
        </Header>
        <Layout>
          <Sider
            style={{ background: '#fff' }}
            theme="light"
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="inbox">
                <Icon type="inbox" style={{ fontSize: '16px' }} />
                {this.state.collapsed ? '' : 'inbox'}
              </Menu.Item>
              <ItemGroup
                key="g1"
                title="Tasks"
                // <span>
                //   <Icon type="folder" />
                //   {this.state.collapsed ? '' : 'projekt'}
                // </span>
                // }
              >
                <Menu.Item key="active">Active</Menu.Item>
                <Menu.Item key="next7Days">Next 7 Days</Menu.Item>
              </ItemGroup>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Projekt</Breadcrumb.Item>
              <Breadcrumb.Item>Task1</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280
              }}
            >
              <Switch>
                <Route path="/tasks/all" component={AllTasks} />
                <Redirect to="/tasks/all" />
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main)
)
