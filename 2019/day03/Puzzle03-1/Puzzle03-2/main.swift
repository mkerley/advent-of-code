//
//  main.swift
//  Puzzle03-2
//
//  Created by Michael Kerley on 12/2/19.
//  Copyright © 2019 Michael Kerley. All rights reserved.
//

import Foundation

typealias Steps = Int

func trace(path: [String]) -> [WireSegment: Steps] {
	trace(path: path.compactMap(PathSegment.init))
}

func trace(path: [PathSegment]) -> [WireSegment: Steps] {
	var x = 0
	var y = 0
	var steps = 0
	var trail: [WireSegment: Steps] = [:]

	for segment in path {
		switch segment {
		case .up(let distance):
			for _ in 0..<distance {
				y += 1
				steps += 1
				let segment = WireSegment(x: x, y: y)
				guard trail[segment] == nil else { continue }
				trail[segment] = steps
			}
		case .down(let distance):
			for _ in 0..<distance {
				y -= 1
				steps += 1
				let segment = WireSegment(x: x, y: y)
				guard trail[segment] == nil else { continue }
				trail[segment] = steps
			}
		case .left(let distance):
			for _ in 0..<distance {
				x -= 1
				steps += 1
				let segment = WireSegment(x: x, y: y)
				guard trail[segment] == nil else { continue }
				trail[segment] = steps
			}
		case .right(let distance):
			for _ in 0..<distance {
				x += 1
				steps += 1
				let segment = WireSegment(x: x, y: y)
				guard trail[segment] == nil else { continue }
				trail[segment] = steps
			}
		}
	}

	return trail
}

let wire1 = trace(path: path1)
let wire2 = trace(path: path2)

let intersections = Set(wire1.keys)
	.intersection(Set(wire2.keys))
	.subtracting([WireSegment(x: 0, y: 0)])

print("\(intersections.count) total intersections")

var intersectionsWithSteps: [WireSegment: Int] = [:]
for i in intersections {
	intersectionsWithSteps[i] = wire1[i]! + wire2[i]!
}

// Question just asks for the min combined steps;
// we don't need to know where the wires intersect
let minimumCombinedStepsToIntersection =
	Array(intersectionsWithSteps.values)
		.sorted()
		.first!

print("First intersection at \(minimumCombinedStepsToIntersection) combined steps")

// But if we did care where it was, here's an O(numberOfIntersections) way to find it
for (segment, steps) in intersectionsWithSteps {
	if steps == minimumCombinedStepsToIntersection {
		print("Intersection at \(segment.x), \(segment.y)")
		break
	}
}
