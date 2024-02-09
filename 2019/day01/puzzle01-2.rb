def main
  module_masses = File.readlines("input.txt").map { |line| line.strip.to_i }
  fuels = module_masses.map { |mass| fuel_required_for mass }
  total_fuel = fuels.reduce :+
  puts total_fuel
end

def fuel_required_for(mass)
  fuel = mass / 3 - 2
  return 0 if fuel <= 0

  fuel + fuel_required_for(fuel)
end

main