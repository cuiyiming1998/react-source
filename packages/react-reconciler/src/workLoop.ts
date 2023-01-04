import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'

let workInProgress: FiberNode | null = null // 正在工作的fiberNode

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {})
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // TODO: 调度
  // 更新时 从当前fiber 一直遍历到root
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  // 寻找root
  let node = fiber
  let parent = node.return

  while (parent !== null) {
    node = parent
    parent = node.return
  }
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

export function renderRoot(root: FiberRootNode) {
  // 初始化
  prepareFreshStack(root)

  do {
    try {
      workLoop()
    } catch (e) {
      if (__DEV__) {
        console.warn('workLoop发生错误:', e)
      }
      workInProgress = null
    }
  } while (true)

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  commitRoot(root)
}

function commitRoot(root: any) {
  // Implement
}

function workLoop() {
  // 如果有workInProgress
  // 执行perform
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber) // 可能是子fiber 也可能是null
  fiber.memorizedProps = fiber.pendingProps

  if (null === next) {
    // 如果没有子节点
    // 调用完成工作的逻辑
    completeUnitOfWork(fiber)
  } else {
    // 否则重新给workInProgress赋值
    // 进入新一轮循环
    workInProgress = next
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber

  do {
    completeWork(node)

    // 看看有没有兄弟节点
    // 如果有兄弟节点 去处理
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }

    // 如果都没有 则处理父节点
    node = node.return
    workInProgress = node
  } while (node !== null)
}
