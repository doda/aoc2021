import { GluegunCommand } from 'gluegun'
const DAY = '18'

class Node {
  left: Node
  right: Node
  parent: Node
  value: number
  isLeaf: boolean

  addParentRef() {
    if (this.left instanceof Node) {
      this.left.parent = this
    }
    if (this.right instanceof Node) {
      this.right.parent = this
    }
  }

  depth() {
    let result = 0
    let x = this as Node
    while (x.parent instanceof Node) {
      result++
      x = x.parent
    }
    return result
  }

  toString() {
    return this.isLeaf
      ? `${this.value}`
      : `[${this.left.toString()},${this.right.toString()}]`
  }

  constructor({
    left,
    right,
    parent,
    value
  }: {
    left?: Node
    right?: Node
    parent?: Node
    value?: number
    isLeaf?: boolean
  }) {
    this.left = left
    this.right = right
    this.parent = parent
    this.value = value
    this.isLeaf = value != null
    this.addParentRef()
  }
}

const nodify = (value: number | any[]): Node => {
  if (typeof value === 'number') return new Node({ value: value })
  const [left, right] = value
  return new Node({
    left: nodify(left),
    right: nodify(right)
  })
}

const add = (left: Node, right: Node): Node => {
  const result = new Node({ left: left, right: right })
  let go = true
  while (go) {
    go = reduce(result)
  }

  return result
}

const reduce = (root: Node): boolean => {
  let inorder: Node[] = []
  const traverseInorder = (node: Node) => {
    if (!(node instanceof Node)) {
      return
    }
    traverseInorder(node.left)
    inorder.push(node)
    traverseInorder(node.right)
  }
  traverseInorder(root)

  // apply reduce rules

  for (let i = 0; i < inorder.length; i++) {
    const node = inorder[i]
    if (
      !node.isLeaf &&
      node.left.isLeaf &&
      node.right.isLeaf &&
      node.depth() === 4
    ) {
      for (let j = i - 2; j >= 0; j--) {
        const otherNode = inorder[j]
        if (otherNode.isLeaf) {
          otherNode.value += node.left.value
          break
        }
      }
      for (let j = i + 2; j < inorder.length; j++) {
        const otherNode = inorder[j]
        if (otherNode.isLeaf) {
          otherNode.value += node.right.value
          break
        }
      }

      node.left = undefined
      node.right = undefined
      node.value = 0
      node.isLeaf = true

      return true
    }
  }
  for (let i = 0; i < inorder.length; i++) {
    const node = inorder[i]
    if (node.isLeaf && node.value >= 10) {
      node.left = new Node({ value: Math.floor(node.value / 2) })
      node.right = new Node({ value: Math.ceil(node.value / 2) })
      node.value = undefined
      node.isLeaf = false
      node.addParentRef()
      return true
    }
  }
  return false
}

const magnitude = (node: Node) => {
  return node.isLeaf
    ? node.value
    : 3 * magnitude(node.left) + 2 * magnitude(node.right)
}

const addAll = (nodes: Node[]): Node => {
  let [accum] = nodes.splice(0, 1)
  for (const number of nodes) {
    accum = add(accum, number)
  }
  return accum
}

const part1 = (input: string[]): number => {
  const numbers = input.map(line => nodify(JSON.parse(line)))

  return magnitude(addAll(numbers))
}

const part2 = (input: string[]): number => {
  let bestResult = -Infinity

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      if (i != j) {
        const numbers = input.map(line => nodify(JSON.parse(line)))
        const [a, b] = [numbers[i], numbers[j]]
        bestResult = Math.max(bestResult, magnitude(add(a, b)))
      }
    }
  }
  return bestResult
}

const command: GluegunCommand = {
  name: `day${DAY}`,
  run: async toolbox => {
    const { print, readInput } = toolbox
    const input = readInput(DAY)
    print.info(`Part 1: ${part1(input)}`)
    print.info(`Part 2: ${part2(input)}`)
  }
}

module.exports = command
