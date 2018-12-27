import { Layout, Menu, Breadcrumb, Icon} from 'antd';
import React from 'react'
import '../App.scss'

import { connect } from 'react-redux'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export class Main extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {}
  }
  public render() {
    const {} = this.props

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
        <Menu.Item key="1" className="menu-item-left">
                <Icon type="plus-square" style={{ fontSize: '24px', color: '#fff'}} theme="outlined" />
                Create Task
        </Menu.Item>
        <Menu.Item key="3"  className="menu-item-right">
        <Icon type="logout" style={{ fontSize: '24px', color: '#fff'}} theme="outlined"/>
        Logout
        </Menu.Item>
      </Menu>
    </Header>
    <Layout>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="inbox">
            <Icon type="inbox" style={{ fontSize: '16px'}} />
            inbox
          </Menu.Item>
          <SubMenu key="projekt" title={<span><Icon type="folder" />projekt</span>}>
            <Menu.Item key="1">Task 1</Menu.Item>
            <Menu.Item key="2">Task 2</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Projekt</Breadcrumb.Item>
          <Breadcrumb.Item>Task1</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{
          background: '#fff', padding: 24, margin: 0, minHeight: 280,
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
