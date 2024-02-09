//
//  WireSegment.swift
//  Puzzle03-1
//
//  Created by Michael Kerley on 12/2/19.
//  Copyright © 2019 Michael Kerley. All rights reserved.
//

struct WireSegment: Hashable {
	let x: Int
	let y: Int

	var manhattan: Int { abs(x) + abs(y) }
}
