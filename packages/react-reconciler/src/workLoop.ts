import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { FiberNode } from './fiber'
let workInProgress: FiberNode | null = null // 正在工作的fiberNode

function prepareFreshStack(fiber) {
  workInProgress = fiber
}

function renderRoot(root: FiberNode) {
  // 初始化
  prepareFreshStack(root)

  do {
    try {
      workLoop()
    } catch (e) {
      console.warn('workLoop发生错误:', e)
      workInProgress = null
    }
  } while (true)
}

function workLoop() {
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
