import sys

target = 2020
seen = set()

for line in sys.stdin:
    n = int(line.strip())
    complement = 2020 - n
    if complement in seen:
        print(n * complement)
        break
    seen.add(n)

