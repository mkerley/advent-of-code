from functools import reduce


def main():
    module_masses = read_masses("input.txt")
    fuels = [fuel_required_for(mass) for mass in module_masses]
    total_fuels = reduce(lambda a, b: a+b, fuels, 0)
    print(total_fuels)


def read_masses(filename):
    with open(filename, 'r') as file:
        masses = file.read().splitlines()
        return [int(mass) for mass in masses]


def fuel_required_for(mass):
    return mass // 3 - 2


if __name__ == "__main__":
    main()
