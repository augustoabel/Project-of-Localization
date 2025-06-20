import json
import googlemaps
import time
import os

# IMPORTANT: Replace 'SUA_CHAVE_DE_API_DO_GOOGLE' with your actual Google Geocoding API key.
# Be careful not to expose your API key in public repositories!
gmaps = googlemaps.Client(key='SUA_CHAVE_DE_API_DO_GOOGLE')

# Define the path to your JSON file robustly
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_name = './scott/scottCustomer.json' # <<< Make sure this matches your JSON file name (e.g., 'your_new_data.json')
json_file_path = os.path.join(script_dir, json_file_name)

print(f"Current working directory: {os.getcwd()}")
print(f"Script path: {os.path.abspath(__file__)}")
print(f"Attempting to open JSON file at: {json_file_path}")

try:
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

        # If 'data' is not a list (e.g., a single dictionary), wrap it in a list for iteration
        if not isinstance(data, list):
            data = [data]

    print(f"--- Processing data from file: {json_file_path} ---")

    for item in data:
        # Construct the full address from the new fields
        address_parts = []
        if item.get("Address 1"):
            address_parts.append(item["Address 1"])
        if item.get("City"):
            address_parts.append(item["City"])
        if item.get("Province"):
            address_parts.append(item["Province"])
        if item.get("Postal Code"):
            address_parts.append(item["Postal Code"])
        if item.get("Country"):
            address_parts.append(item["Country"])

        full_address = ", ".join(address_parts)

        # Check if we have a valid address to geocode
        if full_address.strip(): # Only proceed if the address string is not empty after stripping whitespace
            # Ensure 'lat' and 'lng' fields exist in the dictionary, initializing them if they don't
            if "lat" not in item:
                item["lat"] = None
            if "lng" not in item:
                item["lng"] = None

            print(f"Searching/Updating coordinates for: {item.get('Company', 'Unnamed Company')} ({full_address})")

            try:
                geocode_result = gmaps.geocode(full_address)

                if geocode_result:
                    location = geocode_result[0]['geometry']['location']
                    item["lat"] = location['lat']
                    item["lng"] = location['lng']
                    print(f"  Updated: Lat={item['lat']}, Lng={item['lng']}")
                else:
                    print(f"  No coordinates found for: {full_address}")

                # Small delay to respect API limits
                time.sleep(0.1)

            except Exception as e:
                print(f"  Error fetching coordinates for {full_address}: {e}")
        else:
            print(f"Skipping item due to missing address components: {item.get('Company', 'Unnamed Company')}")

    # Save the JSON file back with the updated data
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\nFile {json_file_path} updated successfully (all entries).")

except FileNotFoundError:
    print(f"Error: The file '{json_file_path}' was not found.")
except json.JSONDecodeError as e:
    print(f"Error loading JSON from file {json_file_path}: {e}")
except Exception as e:
    print(f"An unexpected error occurred while processing {json_file_path}: {e}")

print("\n--- Processing complete ---")