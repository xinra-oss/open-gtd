import { Breadcrumb, Icon, Layout, Menu } from 'antd'
import * as React from 'react'
import '../App.scss'

import { connect } from 'react-redux'

interface State {
  readonly collapsed: boolean
}

const { SubMenu, ItemGroup } = Menu
const { Header, Content, Sider } = Layout

export class Main extends React.Component {
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
    console.log(collapsed)
    this.setState({ collapsed })
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
                  toby.moeller@gmx.de
                  <Icon
                    type="caret-down"
                    style={{ fontSize: '24px', color: '#fff' }}
                    theme="outlined"
                  />
                </span>
              }
            >
              <Menu.Item key="logout">Logout</Menu.Item>
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
                title="test"
                // <span>
                //   <Icon type="folder" />
                //   {this.state.collapsed ? '' : 'projekt'}
                // </span>
                // }
              >
                <Menu.Item key="1">Task 1</Menu.Item>
                <Menu.Item key="2">Task 2</Menu.Item>
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
              Content
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default connect()(Main)
