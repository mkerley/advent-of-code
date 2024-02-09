import Foundation

public class Computer {
	enum Opcodes: Int {
		case add = 1
		case mult = 2
		case halt = 99
	}

	private let program: [Int]
	public private(set) var memory: [Int]

	public init(program: [Int]) {
		self.program = program
		self.memory = program
	}

	public func runProgram(noun: Int, verb: Int) {
		memory = program
		memory[1] = noun
		memory[2] = verb

		var instPtr = 0
		var opcode = memory[instPtr]
		while opcode != Opcodes.halt.rawValue {
			instPtr = execInstruction(at: instPtr)
			opcode = memory[instPtr]
		}
	}

	private func execInstruction(at instPtr: Int) -> Int {
		guard let opcode = Opcodes(rawValue: memory[instPtr]) else {
			print("Bad opcode: \(memory[instPtr])")
			memory[0] = Opcodes.halt.rawValue
			return 0
		}

		switch opcode {
		case .add:
			let addrI = memory[instPtr + 1]
			let addrJ = memory[instPtr + 2]
			let addrDest = memory[instPtr + 3]
			memory[addrDest] = memory[addrI] + memory[addrJ]
			return instPtr + 4
		case .mult:
			let addrI = memory[instPtr + 1]
			let addrJ = memory[instPtr + 2]
			let addrDest = memory[instPtr + 3]
			memory[addrDest] = memory[addrI] * memory[addrJ]
			return instPtr + 4
		case .halt:
			// Shouldn't get here since outer loop is watching for .halt
			return instPtr
		}
	}
}
