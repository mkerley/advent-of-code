def checksum(filename)
  counts = { 2 => 0, 3 => 0 }
  File.open(filename).each do |word|
    count_2s_and_3s(word.strip).each do |num|
      counts[num] += 1
    end
  end

  counts[2] * counts[3]
end

def count_2s_and_3s(word)
  count_hash(word).values.sort.uniq.select { |x| [2,3].index(x) }
end

def count_hash(word)
  counts = {}
  word.chars.each do |c|
    if counts[c]
      counts[c] += 1
    else
      counts[c] = 1
    end
  end
  counts
end

puts checksum 'input.txt'