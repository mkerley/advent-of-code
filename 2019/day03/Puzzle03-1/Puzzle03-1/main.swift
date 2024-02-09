//
//  main.swift
//  Puzzle03-1
//
//  Created by Michael Kerley on 12/2/19.
//  Copyright © 2019 Michael Kerley. All rights reserved.
//

import Foundation

func trace(path: [String]) -> Set<WireSegment> {
	trace(path: path.compactMap(PathSegment.init))
}

func trace(path: [PathSegment]) -> Set<WireSegment> {
	var x = 0
	var y = 0
	var trail = Set<WireSegment>()

	for segment in path {
		switch segment {
		case .up(let distance):
			for _ in 0..<distance {
				y += 1
				trail.insert(WireSegment(x: x, y: y))
			}
		case .down(let distance):
			for _ in 0..<distance {
				y -= 1
				trail.insert(WireSegment(x: x, y: y))
			}
		case .left(let distance):
			for _ in 0..<distance {
				x -= 1
				trail.insert(WireSegment(x: x, y: y))
			}
		case .right(let distance):
			for _ in 0..<distance {
				x += 1
				trail.insert(WireSegment(x: x, y: y))
			}
		}
	}

	return trail
}

let wire1 = trace(path: path1)
let wire2 = trace(path: path2)

let intersections = wire1
	.intersection(wire2)
	.subtracting([WireSegment(x: 0, y: 0)])
	.sorted { $0.manhattan < $1.manhattan }

let closestIntersection = intersections.first!
let closestDistance = closestIntersection.manhattan

print(closestDistance)
