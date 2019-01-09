import * as React from 'react'
import { connect } from 'react-redux'
import { AppState, ContextState } from '../../../store/state'
import TaskList, {
  TaskListCategory,
  TaskListTaskRow
} from '../TaskList/TaskList'
import { isActive } from './filters'

interface ActiveByContextProps {
  contexts: ContextState
}

class ActiveByContext extends React.Component<ActiveByContextProps> {
  public render() {
    return <TaskList filter={isActive} categories={this.groupByContext} />
  }

  private groupByContext = (taskRows: TaskListTaskRow[]) => {
    const noContextsCategory: TaskListCategory = {
      key: 'no-contexts',
      title: '<None>',
      children: []
    }
    const categories: TaskListCategory[] = []
    for (const taskRow of taskRows) {
      const task = taskRow.wrapped
      if (task.contextIds.length === 0) {
        addToCategory(noContextsCategory, taskRow)
      } else {
        task.contextIds.forEach(contextId => {
          let category = categories.find(c => c.key === contextId)
          if (category === undefined) {
            category = {
              key: contextId,
              title: this.props.contexts[contextId].name,
              children: []
            }
            categories.push(category)
          }
          addToCategory(category, taskRow)
        })
      }
    }
    if (noContextsCategory.children!.length > 0) {
      categories.unshift(noContextsCategory)
    }
    return categories
  }
}

function addToCategory(category: TaskListCategory, taskRow: TaskListTaskRow) {
  // beacuse tasks can be displayed multiple times, we need to make the key unique again
  category.children!.push({ ...taskRow, key: taskRow.key + category.key })
}

export default connect(({ contexts }: AppState) => ({ contexts }))(
  ActiveByContext
)
