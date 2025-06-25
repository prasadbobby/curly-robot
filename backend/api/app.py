from flask import Flask, request, jsonify
from datetime import datetime
import base64
import json
import os

app = Flask(__name__)

def load_data():
    """Load data from data.json file"""
    try:
        if os.path.exists('data.json'):
            with open('data.json', 'r') as f:
                return json.load(f)
        else:
            print("Warning: data.json file not found. Using empty list.")
            return []
    except Exception as e:
        print(f"Error loading data.json: {e}")
        return []

def check_auth(auth_header):
    """Simple basic auth check"""
    if not auth_header:
        return False
    
    try:
        # Extract the base64 encoded credentials
        encoded_credentials = auth_header.split(' ')[1]
        decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
        username, password = decoded_credentials.split(':')
        
        # Simple validation (you can customize this)
        return username == "bob" and password == "bob"
    except:
        return False

def parse_date(date_str):
    """Parse date string in format 'DD MMM YYYY'"""
    try:
        return datetime.strptime(date_str, "%d %b %Y")
    except:
        return None

def is_date_in_range(alloc_start, alloc_end, filter_start, filter_end):
    """Check if allocation dates overlap with filter dates"""
    alloc_start_dt = parse_date(alloc_start)
    alloc_end_dt = parse_date(alloc_end)
    
    if not alloc_start_dt or not alloc_end_dt:
        return True  # Include if we can't parse dates
    
    # Check for overlap
    return not (alloc_end_dt < filter_start or alloc_start_dt > filter_end)

@app.route('/AlconNxt/Allocation/GetProjectAllocations', methods=['POST'])
def get_project_allocations():
    # Check authentication
    auth_header = request.headers.get('Authorization')
    if not check_auth(auth_header):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Check content type
    if request.content_type != 'application/json':
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    try:
        data = request.get_json()
        
        # Extract parameters
        project_code = data.get('projectCode')
        alloc_start_date = data.get('allocStartDate')
        alloc_end_date = data.get('allocEndDate')
        
        # Validate required parameters
        if not project_code:
            return jsonify({"error": "projectCode is required"}), 400
        
        # Load data from JSON file
        all_allocations = load_data()
        
        # Parse filter dates
        filter_start = parse_date(alloc_start_date) if alloc_start_date else None
        filter_end = parse_date(alloc_end_date) if alloc_end_date else None
        
        # Filter allocations based on project code and date range
        filtered_allocations = []
        
        for allocation in all_allocations:
            # Filter by project code
            if allocation.get('ProjectCode') == project_code:
                # Filter by date range if provided
                if filter_start and filter_end:
                    if is_date_in_range(allocation.get('AllocStartDate'), 
                                      allocation.get('AllocEndDate'), 
                                      filter_start, filter_end):
                        filtered_allocations.append(allocation)
                else:
                    filtered_allocations.append(allocation)
        
        return jsonify(filtered_allocations)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "data_records": len(load_data())})

@app.route('/reload-data', methods=['POST'])
def reload_data():
    """Endpoint to reload data from JSON file"""
    try:
        data = load_data()
        return jsonify({"message": "Data reloaded successfully", "records": len(data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Load data on startup to verify file exists
    startup_data = load_data()
    print(f"Loaded {len(startup_data)} records from data.json")
    
    app.run(debug=True, host='0.0.0.0', port=5000)