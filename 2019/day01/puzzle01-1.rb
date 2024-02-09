def main
  module_masses = File.readlines("input.txt").map { |line| line.strip.to_i }
  fuels = module_masses.map { |mass| fuel_required_for mass }
  total_fuel = fuels.reduce :+
  puts total_fuel
end

def fuel_required_for(mass)
  mass / 3 - 2
end

main