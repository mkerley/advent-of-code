"""
The diagnostic report (your puzzle input) consists of a list of binary numbers which, when decoded properly, can tell you many useful things about the conditions of the submarine. The first parameter to check is the power consumption.

You need to use the binary numbers in the diagnostic report to generate two new binary numbers (called the gamma rate and the epsilon rate). The power consumption can then be found by multiplying the gamma rate by the epsilon rate.

Each bit in the gamma rate can be determined by finding the most common bit in the corresponding position of all numbers in the diagnostic report. For example, given the following diagnostic report:

00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
Considering only the first bit of each number, there are five 0 bits and seven 1 bits. Since the most common bit is 1, the first bit of the gamma rate is 1.

The most common second bit of the numbers in the diagnostic report is 0, so the second bit of the gamma rate is 0.

The most common value of the third, fourth, and fifth bits are 1, 1, and 0, respectively, and so the final three bits of the gamma rate are 110.

So, the gamma rate is the binary number 10110, or 22 in decimal.

The epsilon rate is calculated in a similar way; rather than use the most common bit, the least common bit from each position is used. So, the epsilon rate is 01001, or 9 in decimal. Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, 198.

Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon rate, then multiply them together. What is the power consumption of the submarine? (Be sure to represent your answer in decimal, not binary.)
"""

from __future__ import annotations

import sys


def bit_counts(input: list[str], pos: int) -> dict[str, int]:
    print(f"bit_counts(<{len(input)} inputs>, pos: {pos})")
    counts: dict[str, int] = {}

    for bits in input:
        bit = bits[pos]
        if bit not in counts:
            counts[bit] = 1
        else:
            counts[bit] += 1

    return counts


def most_common_key(counts: dict[str, int]) -> str:
    max_count = 0
    max_key = None

    for key, count in counts.items():
        if count > max_count:
            max_count = count
            max_key = key

    if max_key is None:
        raise Exception("No keys")

    return max_key


def least_common_key(counts: dict[str, int]) -> str:
    min_count = None
    min_key = None

    for key, count in counts.items():
        if min_count is None or count < min_count:
            min_count = count
            min_key = key

    if min_key is None:
        raise Exception("No keys")

    return min_key


def int_from_bits(bits: list[int]) -> int:
    sum = 0
    for i in range(len(bits)):
        if bits[-(i + 1)] != 0:
            sum += 2**i

    return sum


def main():
    input: list[str] = []

    for line in sys.stdin:
        input.append(line.strip())

    bit_count = len(input[0])
    most_common_bits: list[int] = [
        int(most_common_key(bit_counts(input, pos))) for pos in range(bit_count)
    ]
    print(f"most_common_bits = {most_common_bits}")
    least_common_bits: list[int] = [
        int(least_common_key(bit_counts(input, pos))) for pos in range(bit_count)
    ]
    print(f"least_common_bits = {least_common_bits}")

    gamma = int_from_bits(most_common_bits)
    epsilon = int_from_bits(least_common_bits)

    print(f"gamma:   {gamma}")
    print(f"epsilon: {epsilon}")
    print(f"result:  {gamma * epsilon}")


if __name__ == "__main__":
    main()
