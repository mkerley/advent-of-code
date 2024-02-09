import sys

# Opcodes
ADD = 1
MULT = 2
HALT = 99

MAGIC_TARGET_OUTPUT = 19690720

def main():
    if len(sys.argv) < 2:
        print("Usage: puzzle02-1.py <filename>")
        exit(1)
        
    filename = sys.argv[1]

    memory = read_input(filename)
    memory_orig = memory

    for noun in range(100):
        for verb in range(100):
            memory = memory_orig.copy()
            run_program(memory, noun, verb)
            if memory[0] == MAGIC_TARGET_OUTPUT:
                print(100 * noun + verb)
                exit(0)

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
