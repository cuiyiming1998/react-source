import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes'
import { FunctionComponent, HostComponent, WorkTag } from './workTags'
import { Flags, NoFlags } from './fiberFlags'
import { Container } from 'hostConfig'

export class FiberNode {
  type: any
  tag: WorkTag
  pendingProps: Props
  key: Key
  stateNode: any
  return: FiberNode | null
  sibling: FiberNode | null
  child: FiberNode | null
  index: number
  ref: Ref
  memorizedProps: Props | null
  alternate: FiberNode | null
  flags: Flags
  updateQueue: unknown
  memorizedState: any

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    // 实例

    this.tag = tag
    this.key = key
    // HostComponent(<div>) => div Dom
    this.stateNode = null
    // FunctionComponent -> () => {}
    this.type = null

    // 构成树状结构

    // 指向父fiberNode
    this.return = null
    // 指向右兄弟fiberNode
    this.sibling = null
    // 指向子fiberNode
    this.child = null
    this.index = 0
    this.ref = null

    // 作为工作单元
    this.pendingProps = pendingProps
    // 确定后的Props
    this.memorizedProps = null
    this.updateQueue = null
    this.memorizedState = null

    this.alternate = null
    // 副作用
    this.flags = NoFlags
  }
}

export class FiberRootNode {
  container: Container
  current: FiberNode
  finishedWork: FiberNode | null // 更新完成的FiberNode

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate

  if (wip === null) {
    // 首屏渲染时是null
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode

    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps
    wip.flags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memorizedProps = current.memorizedProps
  wip.memorizedState = current.memorizedState

  return wip
}

export function createFiberFromElement(element: ReactElementType): FiberNode {
  const { type, key, props } = element
  let fiberTag: WorkTag = FunctionComponent

  if ('string' === typeof type) {
    // <div />
    fiberTag = HostComponent
  } else if ('function' !== typeof type && __DEV__) {
    console.warn('未定义的type类型', element)
  }

  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}
