import Foundation

func main() {
	let masses = readMasses()
	print(fuel(for: masses))
}

func readMasses() -> [Int] {
	let inputStr = try! String(contentsOfFile: "input.txt", encoding: .utf8)
	let masses = inputStr.components(separatedBy: "\n")
	return masses.compactMap(Int.init)
}

func fuel(for masses: [Int]) -> Int {
	masses.map { mass in fuel(for: mass) }.reduce(0, +)
}

func fuel(for mass: Int) -> Int {
	let baseFuel = mass / 3 - 2
	guard baseFuel > 0 else {
		return 0
	}

	return baseFuel + fuel(for: baseFuel)
}

main()
