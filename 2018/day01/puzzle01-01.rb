frequency = 0
File.open('input.txt').each do |line|
  frequency += line.to_i
end
puts frequency
