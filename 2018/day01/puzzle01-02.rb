def find_repeat(input_file)
  frequency = 0
  history = {}

  loop do
    File.open(input_file).each do |line|
      frequency += line.to_i
      return frequency if history[frequency]

      history[frequency] = true
    end
  end
end

puts find_repeat('input.txt')
