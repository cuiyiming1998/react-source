import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols'
import {
  Type,
  Key,
  Ref,
  Props,
  ReactElementType,
  ElementType
} from '../../shared/ReactTypes'

// 创建ReactElement
const ReactElement = function (
  type: Type,
  key: Key,
  ref: Ref,
  props: Props
): ReactElementType {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'custom'
  }

  return element
}

export const jsx = (
  type: ElementType,
  config: any,
  ...maybeChildren: any
): ReactElementType => {
  let key: Key = null
  const props: Props = {}
  let ref: Ref = null

  // 遍历config
  // 把遍历到的prop 赋值给props
  for (const prop in config) {
    const val = config[prop]
    // 如果是 key
    // 那么转化成string
    if ('key' === prop && undefined !== val) {
      key = '' + val
      continue
    }

    // 如果是ref 直接赋值给ref
    if ('ref' === prop && undefined !== val) {
      ref = val
      continue
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }

  // 获取children
  const maybeChildrenLength: number = maybeChildren.length
  if (maybeChildrenLength) {
    if (1 === maybeChildrenLength) {
      props.children = maybeChildren[0]
    } else {
      props.children = maybeChildren
    }
  }

  // 最终返回创建的element
  return ReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElementType, config: any): ReactElementType => {
  let key: Key = null
  const props: Props = {}
  let ref: Ref = null

  // 遍历config
  // 把遍历到的prop 赋值给props
  for (const prop in config) {
    const val = config[prop]
    // 如果是 key
    // 那么转化成string
    if ('key' === prop && undefined !== val) {
      key = '' + val
      continue
    }

    // 如果是ref 直接赋值给ref
    if ('ref' === prop && undefined !== val) {
      ref = val
      continue
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }
  }

  // 最终返回创建的element
  return ReactElement(type, key, ref, props)
}
