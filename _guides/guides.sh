#!/bin/bash

: '
# Exclude test accounts
query GetGuides {
  accounts_guide(where: {documents_verified: {_eq: true}, user_id: {_nin: ["cb1b0547-22b3-4fc5-aa80-b705badc1770", "bf1db3e5-b8f3-471a-9efa-3a55a8e0ea1b"]}}) {
    user_id
    user {
      avatarUrl
      displayName
      metadata(path: "bio")
      visits(where: {publication_status: {_eq: APPROVED}}) {
        id
        cover_image
        title
        description
        city {
          city
          postal_code
          latitude
          longitude
        }
      }
    }
  }
}
'

# Ensure jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found, please install jq to run this script."
    exit
fi

# Read the JSON file
json_file="guides.json"

# Extract the data from the JSON file using jq
jq -c '.data.accounts_guide[]' "$json_file" | while read -r user; do
    user_id=$(echo "$user" | jq -r '.user_id')
    avatarUrl=$(echo "$user" | jq -r '.user.avatarUrl')
    displayName=$(echo "$user" | jq -r '.user.displayName')
    bio=$(echo "$user" | jq -r '.user.metadata')

    # Initialize visits array
    visits=$(echo "$user" | jq -c '.user.visits[]' | while read -r visit; do
        visit_id=$(echo "$visit" | jq -r '.id')
        cover_image=$(echo "$visit" | jq -r '.cover_image')
        title=$(echo "$visit" | jq -r '.title')
        description=$(echo "$visit" | jq -r '.description')
        city=$(echo "$visit" | jq -r '.city.city')
        postal_code=$(echo "$visit" | jq -r '.city.postal_code')
        latitude=$(echo "$visit" | jq -r '.city.latitude')
        longitude=$(echo "$visit" | jq -r '.city.longitude')

    cat <<EOV
- id: $visit_id
  title: "$title"
  cover_image: "$cover_image"
  description: "$description"
  city: "$city"
  postal_code: "$postal_code"
  latitude: $latitude
  longitude: $longitude
EOV
    done)

    # Create the output file with the user_id as the filename
    output_file="${user_id}.md"

    # Write the content to the file
    cat <<EOF > "$output_file"
---
layout: guide
avatarUrl: $avatarUrl
displayName: $displayName
bio: "$bio"
visits:
$visits
---
EOF
done

echo "Files created successfully."
