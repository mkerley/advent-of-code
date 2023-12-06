import sys

# Same idea as p1, but using a 3-measurement window sum

prev: list[int] = []
prevTotal = None
increases = 0

for line in sys.stdin:
    n = int(line.strip())

    # Append and truncate older entries
    prev = (prev + [n])[-3:]
    print(f"prev = {prev}")

    if len(prev) < 3:
        continue

    total = sum(prev)
    print(f"  prevTotal = {prevTotal}")
    print(f"  total = {total}")
    if prevTotal == None:
        prevTotal = total
        continue

    if total > prevTotal:
        increases += 1
        print(f"  increases = {increases}")
    
    prevTotal = total
    print(f"  prevTotal (new) = {prevTotal}")

print(increases)