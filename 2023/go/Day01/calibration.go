package main

import (
	"fmt"
	"math"
	"os"
	"slices"
	"strings"
)

func main() {
	fmt.Printf("V1: %d\n", V1("input.txt"))
	fmt.Printf("V2: %d\n", V2("input.txt"))
}

func V1(filename string) int {
	dat, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	str := string(dat)
	lines := strings.Split(str, "\n")

	total := 0
	for _, line := range lines {
		trimmed := strings.TrimFunc(line, IsNotDigit)

		if len(trimmed) == 0 {
			fmt.Println("  No digits! Skipping")
			continue
		}
		first := trimmed[0]
		last := trimmed[len(trimmed)-1]
		numstr := fmt.Sprintf("%c%c", first, last)

		var num int
		fmt.Sscanf(numstr, "%d", &num)
		total += num
	}

	return total
}

func V2(filename string) int {
	dat, err := os.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	str := string(dat)
	lines := strings.Split(str, "\n")

	total := 0
	for _, line := range lines {
		first := FindFirstDigit(line)
		last := FindLastDigit(line)
		num := (10 * first) + last

		fmt.Printf("  %s -> %d\n", line, num)

		total += num
	}

	return total
}

func IsNotDigit(r rune) bool {
	return !strings.Contains("0123456789", string(r))
}

func MinIndex(a int, b int) int {
	if a < 0 && b < 0 {
		return math.MaxInt
	}
	if a < 0 {
		return b
	}
	if b < 0 {
		return a
	}
	return min(a, b)
}

func FindFirstDigit(s string) int {
	strIndices := []int{
		MinIndex(strings.Index(s, "0"), strings.Index(s, "zero")),
		MinIndex(strings.Index(s, "1"), strings.Index(s, "one")),
		MinIndex(strings.Index(s, "2"), strings.Index(s, "two")),
		MinIndex(strings.Index(s, "3"), strings.Index(s, "three")),
		MinIndex(strings.Index(s, "4"), strings.Index(s, "four")),
		MinIndex(strings.Index(s, "5"), strings.Index(s, "five")),
		MinIndex(strings.Index(s, "6"), strings.Index(s, "six")),
		MinIndex(strings.Index(s, "7"), strings.Index(s, "seven")),
		MinIndex(strings.Index(s, "8"), strings.Index(s, "eight")),
		MinIndex(strings.Index(s, "9"), strings.Index(s, "nine")),
	}

	lowestStrIndex := slices.Min(strIndices)
	firstDigit := slices.Index(strIndices, lowestStrIndex)
	return firstDigit
}

func FindLastDigit(s string) int {
	strIndices := []int{
		max(strings.LastIndex(s, "0"), strings.LastIndex(s, "zero")),
		max(strings.LastIndex(s, "1"), strings.LastIndex(s, "one")),
		max(strings.LastIndex(s, "2"), strings.LastIndex(s, "two")),
		max(strings.LastIndex(s, "3"), strings.LastIndex(s, "three")),
		max(strings.LastIndex(s, "4"), strings.LastIndex(s, "four")),
		max(strings.LastIndex(s, "5"), strings.LastIndex(s, "five")),
		max(strings.LastIndex(s, "6"), strings.LastIndex(s, "six")),
		max(strings.LastIndex(s, "7"), strings.LastIndex(s, "seven")),
		max(strings.LastIndex(s, "8"), strings.LastIndex(s, "eight")),
		max(strings.LastIndex(s, "9"), strings.LastIndex(s, "nine")),
	}

	highestStrIndex := slices.Max(strIndices)
	lastDigit := slices.Index(strIndices, highestStrIndex)
	return lastDigit
}
