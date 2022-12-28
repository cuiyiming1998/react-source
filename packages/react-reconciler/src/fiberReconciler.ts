import { ReactElementType } from './../../shared/ReactTypes'
import { HostRoot } from './workTags'
import { FiberNode, FiberRootNode } from './fiber'
import { Container } from 'hostConfig'
import { scheduleUpdateOnFiber } from './workLoop'
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  UpdateQueue
} from './updateQueue'

export function createContainer(container: Container) {
  // 创建root
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)
  // 创建updateQueue
  hostRootFiber.updateQueue = createUpdateQueue
  return root
}

export function updateContainer(
  element: ReactElementType | null,
  root: FiberRootNode
) {
  const hostRootFiber = root.current
  // 创建update
  const update = createUpdate<ReactElementType | null>(element)
  // 放进updateQueue
  enqueueUpdate(
    hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
    update
  )
  scheduleUpdateOnFiber(hostRootFiber)
  return element
}
