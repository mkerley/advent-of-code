//
//  PathSegment.swift
//  Puzzle03-1
//
//  Created by Michael Kerley on 12/2/19.
//  Copyright © 2019 Michael Kerley. All rights reserved.
//

import Foundation

enum PathSegment {
	case up(Int)
	case down(Int)
	case left(Int)
	case right(Int)

	init?(_ str: String) {
		let distanceIndex = str.index(after: str.startIndex)
		guard let distance = Int(str[distanceIndex...]),
			let directionChar = str.first else {
			return nil
		}
		
		switch directionChar {
		case "U":
			self = .up(distance)
		case "D":
			self = .down(distance)
		case "L":
			self = .left(distance)
		case "R":
			self = .right(distance)
		default:
			return nil
		}
	}

	static func parse(input: String) -> [PathSegment] {
		input
			.components(separatedBy: ",")
			.compactMap(PathSegment.init)
	}
}
