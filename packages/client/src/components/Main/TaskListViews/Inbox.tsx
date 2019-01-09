import { EntityId } from '@open-gtd/api'
import React from 'react'
import { connect } from 'react-redux'
import { AppState } from '../../../store/state'
import TaskList from '../TaskList/TaskList'

interface InboxProps {
  inboxTaskId: EntityId
}

class Inbox extends React.Component<InboxProps> {
  public render() {
    return <TaskList hierarchical rootTaskId={this.props.inboxTaskId} />
  }
}

export default connect((state: AppState) => ({
  inboxTaskId: state.session.user!.inboxTaskId
}))(Inbox)
