import sys

prev = None
increases = 0

for line in sys.stdin:
    n = int(line.strip())

    if prev is None:
        prev = n
        continue

    if n > prev:
        increases += 1

    prev = n

print(increases)
