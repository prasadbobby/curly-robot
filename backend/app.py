from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.auth import HTTPBasicAuth
import json
import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Create response data directory
if not os.path.exists('response_data'):
    os.makedirs('response_data')

def make_api_request(username, password, project_code, alloc_start_date, alloc_end_date):
    """Make API request to get project allocations"""
    try:
        auth = HTTPBasicAuth(username, password)
        
        url = 'http://localhost:5000/AlconNxt/Allocation/GetProjectAllocations'
        
        headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        payload = {
            "projectCode": project_code,
            "allocStartDate": alloc_start_date,
            "allocEndDate": alloc_end_date
        }
        
        logger.info(f"Making API request for project: {project_code}")
        
        response = requests.post(
            url,
            auth=auth,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        result = {
            'status_code': response.status_code,
            'success': response.status_code == 200,
            'data': response.json() if response.status_code == 200 and response.text else None,
            'error': response.text if response.status_code != 200 else None,
            'request_payload': payload,
            'timestamp': datetime.now().isoformat(),
            'response_headers': dict(response.headers)
        }
        
        # Save to JSON file
        filename = f"response_data/allocation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Request completed with status: {response.status_code}")
        return result
        
    except requests.exceptions.Timeout:
        error_result = {
            'status_code': 0,
            'success': False,
            'data': None,
            'error': 'Request timeout - the server took too long to respond',
            'request_payload': payload,
            'timestamp': datetime.now().isoformat()
        }
        logger.error("Request timeout")
        return error_result
        
    except requests.exceptions.ConnectionError:
        error_result = {
            'status_code': 0,
            'success': False,
            'data': None,
            'error': 'Connection error - unable to reach the server',
            'request_payload': payload,
            'timestamp': datetime.now().isoformat()
        }
        logger.error("Connection error")
        return error_result
        
    except Exception as e:
        error_result = {
            'status_code': 0,
            'success': False,
            'data': None,
            'error': f'Unexpected error: {str(e)}',
            'request_payload': payload,
            'timestamp': datetime.now().isoformat()
        }
        logger.error(f"Unexpected error: {str(e)}")
        return error_result

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/allocations', methods=['POST'])
def get_allocations():
    """Main endpoint to get project allocations"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        required_fields = ['username', 'password', 'projectCode', 'allocStartDate', 'allocEndDate']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        result = make_api_request(
            data['username'],
            data['password'],
            data['projectCode'],
            data['allocStartDate'],
            data['allocEndDate']
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'error': 'Method not allowed'
    }), 405

if __name__ == '__main__':
    logger.info("Starting Project Allocations API Server...")
    app.run(debug=True, host='0.0.0.0', port=8000)