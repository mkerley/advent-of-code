"""
--- Day 2: Dive! ---
Now, you need to figure out how to pilot this thing.

It seems like the submarine can take a series of commands like forward 1, down 2, or up 3:

forward X increases the horizontal position by X units.
down X increases the depth by X units.
up X decreases the depth by X units.
Note that since you're on a submarine, down and up affect your depth, and so they have the opposite result of what you might expect.

The submarine seems to already have a planned course (your puzzle input). You should probably figure out where it's going. For example:

forward 5
down 5
forward 8
up 3
down 8
forward 2
Your horizontal position and depth both start at 0. The steps above would then modify them as follows:

forward 5 adds 5 to your horizontal position, a total of 5.
down 5 adds 5 to your depth, resulting in a value of 5.
forward 8 adds 8 to your horizontal position, a total of 13.
up 3 decreases your depth by 3, resulting in a value of 2.
down 8 adds 8 to your depth, resulting in a value of 10.
forward 2 adds 2 to your horizontal position, a total of 15.
After following these instructions, you would have a horizontal position of 15 and a depth of 10. (Multiplying these together produces 150.)

Calculate the horizontal position and depth you would have after following the planned course. What do you get if you multiply your final horizontal position by your final depth?
"""

from __future__ import annotations
import sys


class Movement:
    x: int
    y: int

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    @classmethod
    def fromLine(cls, line: str):
        parts = line.split(" ")
        direction = parts[0]
        distance = int(parts[1])

        x = y = 0

        if direction == "forward":
            x = distance
        elif direction == "up":
            y = -distance
        elif direction == "down":
            y = distance

        return Movement(x, y)

    def __add__(self, other: Movement) -> Movement:
        return Movement(self.x + other.x, self.y + other.y)

    def __str__(self) -> str:
        return f"({self.x}, {self.y})"


position = Movement(0, 0)
for line in sys.stdin:
    m = Movement.fromLine(line)
    print(f"m = {m}")
    position += m
    print(f"position = {position}")

print("Product:", position.x * position.y)

# vector = (sum((m[0] for m in moves)), sum((m[1] for m in moves)))
