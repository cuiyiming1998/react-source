import { FiberNode } from './fiber'
// 递归中的 归 阶段

export const completeWork = (fiber: FiberNode): void => {
  // 完成work
  console.log(fiber)
}
