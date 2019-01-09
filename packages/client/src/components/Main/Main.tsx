import { UserEntity } from '@open-gtd/api'
import { Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router'
import { Link } from 'react-router-dom'
import { AppState, DispatchProps, mapDispatchToProps } from '../../store'
import { sessionActions } from '../../store/actions'
import TaskConfig from '../../TaskConfig'
import { PROTECTED_SPACE } from '../../util'
import './Main.scss'
import ActiveTasks from './TaskListViews/ActiveTasks'
import AllTasks from './TaskListViews/AllTasks'

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
      <Layout className="Main">
        <Header className="Main-header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
            <SubMenu
              key="3"
              className="item-right"
              title={
                <span>
                  <Icon
                    type="user"
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      position: 'relative',
                      top: 4
                    }}
                  />
                  {this.props.user.email}
                  {PROTECTED_SPACE}
                  <Icon type="caret-down" />
                </span>
              }
            >
              <Menu.Item key="logout" onClick={this.onLogout}>
                Logout
              </Menu.Item>
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
              defaultSelectedKeys={[this.props.location.pathname]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="/tasks/inbox">
                <Link to="/tasks/inbox">
                  <Icon type="inbox" style={{ fontSize: '16px' }} />
                  {this.state.collapsed ? '' : 'Inbox'}
                </Link>
              </Menu.Item>
              <ItemGroup key="outline" title="Outline">
                <Menu.Item key="/tasks/all">
                  <Link to="/tasks/all">All Tasks</Link>
                </Menu.Item>
              </ItemGroup>
              <ItemGroup key="todo" title="TODO">
                <Menu.Item key="/tasks/active">
                  <Link to="/tasks/active">Active Tasks</Link>
                </Menu.Item>
              </ItemGroup>
              <ItemGroup title="Settings" key="settings">
                <Menu.Item key="/contexts">
                  <Link to="/contexts">Manage Contexts</Link>
                </Menu.Item>
              </ItemGroup>
            </Menu>
          </Sider>
          <Layout style={{ height: '100%' }}>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 24,
                height: '100%',
                overflow: 'auto'
              }}
            >
              <Switch>
                <Route path="/tasks/all" component={AllTasks} />
                <Route path="/tasks/active" component={ActiveTasks} />
                <Route path="/contexts" component={TaskConfig} />
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
