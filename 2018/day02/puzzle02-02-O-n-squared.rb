def main
  all_ids = File.readlines('input.txt').map { |id| id.strip }

  ids = find_similar_box_ids(all_ids)
  matching_letters = extract_matching_letters(ids[0], ids[1])

  puts matching_letters
end

def find_similar_box_ids(box_ids, expected_diff = 1)
  box_ids.each_with_index do |id1, idx|
    box_ids[idx..-1].each do |id2|
      if diff(id1, id2) == expected_diff
        return [id1, id2]
      end
    end
  end

  []
end

def diff(box_id1, box_id2)
  diff_pairs = 0
  box_id1.chars.each_index do |i|
    diff_pairs += 1 if box_id1[i] != box_id2[i]
  end
  
  diff_pairs
end

def extract_matching_letters(box_id1, box_id2)
  matching_letters = ""

  box_id1.chars.each_index do |i|
    matching_letters += box_id1[i] if box_id1[i] == box_id2[i]
  end

  matching_letters
end

main
