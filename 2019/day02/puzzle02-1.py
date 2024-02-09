import sys

# Opcodes
ADD = 1
MULT = 2
HALT = 99

def main():
    if len(sys.argv) >= 2:
        filename = sys.argv[1]
    else:
        print("Usage: puzzle02-1.py <filename> [noun] [verb]")

    memory = read_input(filename)
    noun = memory[1]
    verb = memory[2]
    if len(sys.argv) >= 3:
        noun = int(sys.argv[2])
    if len(sys.argv) >= 4:
        verb = int(sys.argv[3])

    run_program(memory, noun, verb)
    print(memory)

def read_input(filename):
    with open(filename, 'r') as file:
        line = file.read().splitlines()[0]
        strings = line.split(',')
        return [int(s) for s in strings]

def run_program(memory, noun, verb):
    memory[1] = noun
    memory[2] = verb

    inst_ptr = 0
    opcode = memory[inst_ptr]
    while opcode != HALT:
        inst_ptr = exec_instruction_at(memory, inst_ptr)
        opcode = memory[inst_ptr]

def exec_instruction_at(memory, inst_ptr):
    opcode = memory[inst_ptr]
    if opcode == ADD:
        addr_i = memory[inst_ptr + 1]
        addr_j = memory[inst_ptr + 2]
        addr_dest = memory[inst_ptr + 3]
        memory[addr_dest] = memory[addr_i] + memory[addr_j]
        return inst_ptr + 4
    elif opcode == MULT:
        addr_i = memory[inst_ptr + 1]
        addr_j = memory[inst_ptr + 2]
        addr_dest = memory[inst_ptr + 3]
        memory[addr_dest] = memory[addr_i] * memory[addr_j]
        return inst_ptr + 4

if __name__ == "__main__":
    main()
