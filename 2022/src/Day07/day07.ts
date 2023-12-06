import { readLines } from '../utils'

type DirNode = {
  parent: DirNode | null
  name: string
  type: 'dir'
  children: Record<string, DirNode | FileNode>
}

type FileNode = {
  parent: DirNode
  name: string
  size: number
  type: 'file'
}

async function main() {
  const rootDir: DirNode = await buildDirStructure()
  lsRecursive(rootDir)

  const sizes = findTotalSizesUpTo(rootDir, 100000)
}

function findTotalSizesUpTo(dir: DirNode, maxSize: number): number[] {
  const dirTotalSize = totalSizeOf(dir)
  FUCK
}

function totalSizeOf(node: DirNode | FileNode): number {
  if (node.type === 'file') {
    return node.size
  }

  const children = Object.values(node.children)
  return children.reduce((sum, child) => sum + totalSizeOf(child), 0)
}

async function buildDirStructure() {
  const rootDir: DirNode = {
    parent: null,
    name: '/',
    type: 'dir',
    children: {},
  }

  let pwd = rootDir

  const lines = await readLines(`${__dirname}/input.txt`)
  for (const line of lines) {
    if (line.startsWith('$')) {
      pwd = handleCommandLine(line, pwd, rootDir)
    } else {
      handleLsOutputLine(line, pwd)
    }
  }
  return rootDir
}

function handleLsOutputLine(line: string, pwd: DirNode) {
  const [dirOrSize, name] = line.split(' ')
  let child: DirNode | FileNode
  if (dirOrSize === 'dir') {
    child = {
      parent: pwd,
      name,
      type: 'dir',
      children: {},
    }
  } else {
    child = {
      parent: pwd,
      name,
      type: 'file',
      size: parseInt(dirOrSize),
    }
  }
  pwd.children[name] = child
}

function handleCommandLine(line: string, pwd: DirNode, rootDir: DirNode) {
  const [cmd, target] = line.slice(2).split(' ')
  console.log(cmd, target ?? '')
  switch (cmd) {
    case 'cd': {
      if (target === '/') {
        pwd = rootDir
      } else if (target === '..') {
        pwd = pwd.parent
      } else {
        const targetDir = pwd.children[target]
        if (targetDir.type === 'dir') {
          pwd = targetDir
        }
      }
      break
    }
    case 'ls': {
      // Nothing to do; list lines will follow
      break
    }
  }
  return pwd
}

function spaces(n: number): string {
  return ' '.repeat(n)
}

function lsRecursive(dir: DirNode, indent = 0) {
  console.log(`${spaces(indent)}${dir.name}`)
  for (const child of Object.values(dir.children)) {
    if (child.type === 'dir') {
      lsRecursive(child, indent + 2)
    } else {
      console.log(`${spaces(indent + 2)}${child.name} (${child.size})`)
    }
  }
}

main()
