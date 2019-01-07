import { ContextEntity } from '@open-gtd/api'
import { Button } from 'antd'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dictionary } from 'ts-essentials'
import EditableTable, {
  EditableColumnProps
} from './components/EditableTable/EditableTable'
import { AppState, DispatchProps, mapDispatchToProps } from './store'
import { contextActions } from './store/actions'

interface ContextProps extends DispatchProps {
  contexts: Dictionary<ContextEntity>
}

class ContextConfig<T> extends React.Component<ContextProps> {
  private columns: Array<EditableColumnProps<ContextEntity>> = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true
    }
  ]

  public render() {
    const context: ContextEntity[] = []

    Object.keys(this.props.contexts).forEach(id => {
      const contextKey = this.props.contexts[id]
      context.push(contextKey)
    })

    return (
      <div>
        {this.renderToolbar()}
        <EditableTable
          columns={this.columns}
          dataSource={context}
          handleSave={this.handleSave}
          rowKey="_id"
        />
      </div>
    )
  }

  private createContext = () => {
    this.props.dispatch(
      contextActions.createContext.request({
        name: 'New Context'
      })
    )
  }

  private handleSave = (
    context: ContextEntity /*,
    values: Partial<ContextEntity>*/
  ) => {
    this.props.dispatch(
      contextActions.updateContext.request({ ...context /*, ...values */ })
    )
  }

  private renderToolbar() {
    return (
      <div style={{ marginBottom: 10 }}>
        <Button type="primary" icon="plus-square" onClick={this.createContext}>
          Add
        </Button>
      </div>
    )
  }
}

export default connect(
  ({ contexts }: AppState) => ({ contexts }),
  mapDispatchToProps
)(ContextConfig)
