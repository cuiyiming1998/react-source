import { ReactElementType } from 'shared/ReactTypes'
import { mountChildFibers, reconcileChildFibers } from './childFibers'
import { FiberNode } from './fiber'
import { processUpdateQueue, UpdateQueue } from './updateQueue'
import { HostComponent, HostRoot, HostText } from './workTags'

// 递归中的 递 阶段

/**
 * HostRoot的beginWork工作流程:
 * 1. 计算状态的最新值
 * 2. 创造子fiberNode
 * HostComponent的工作流程:
 * 1. 创造子fiberNode
 * HostText没有beginWork, 因为他没有子节点
 *
 */
export const beginWork = (wip: FiberNode) => {
  // 比较, 返回子fiberNode
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      return null
    default:
      if (__DEV__) {
        console.warn('beginWork未实现的类型')
      }
      break
  }
}

function updateHostRoot(wip: FiberNode) {
  // 计算状态最新值
  const baseState = wip.memorizedState
  const updateQueue = wip.updateQueue as UpdateQueue<Element>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null

  const { memorizedState } = processUpdateQueue(baseState, pending)
  wip.memorizedState = memorizedState

  const nextChildren = wip.memorizedState
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
  const current = wip.alternate

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children)
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}
