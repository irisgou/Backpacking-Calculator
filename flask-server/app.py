from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# app = Flask(__name__)
app = Flask(__name__, static_folder='build')

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# @app.route('/')
# def home():
#     return "Welcome to the Backpacking Calorie Burn Calculator API"

# @app.route('/ws')
# def websocket_route():
#     return "WebSocket route"

# Serve React front-end from the 'build/' directory
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

# Serve any static assets from the 'build/' directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

def get_terrain_factor(terrain_type, speed):
    terrain_factor = None
    if terrain_type == "Slippery Terrain":
        terrain_factor = 1.7
    elif terrain_type == "Vegetation":
        terrain_factor = (0.0718 * speed) ** 3 + (1.3 * speed) ** 2 - (5.3701 * speed) + 6.0705
    elif terrain_type == "Swamp":
        terrain_factor = 3.5
    elif terrain_type == "Paved Road" or terrain_type == "Gravel Road":
        terrain_factor = 1.0
    elif terrain_type == "Dirt Road":
        terrain_factor = 1.2
    elif terrain_type == "Sand":
        terrain_factor = 1.5 + (1.3 / (speed ** 2))
    else:
        terrain_factor = 1.0  # Default terrain factor if not specified
    return terrain_factor


def calculate_calories(weight, pack_weight, speed, incline_grade, terrain_type):
    """
    Calculate the calories burned per hour based on the given parameters.
    
    Args:
    - weight (float): User's weight in kg.
    - pack_weight (float): Weight of the pack in kg.
    - speed (float): Hiking speed in m/s.
    - incline_grade (float): Incline grade in %.
    - terrain_factor (float): Terrain factor based on the type of terrain.
    
    Returns:
    - float: Calories burned per hour.
    """
    # vegetation set to -1 as dummy value
    # if terrain_factor == -1:
    #     terrain_factor = (0.0718 * speed) ** 3 + (1.3 * speed) ** 2 - (5.3701 * speed) + 6.0705 

    # # sand set to -2 as dummy value
    # elif terrain_factor == -2:
    #     terrain_factor = 1.5 + (1.3 / (speed **2))

    # elif terrain_factor is None:
    #     raise ValueError("Terrain factor must be a numeric value.")

    terrain_factor = get_terrain_factor(terrain_type, speed)

    # Calculate the total metabolic rate in watts (M)
    M = 1.5 * weight + 2.0 * (weight + pack_weight) * (pack_weight / weight) ** 2
    M += terrain_factor * (weight + pack_weight) * (1.5 * speed ** 2 + 0.35 * speed * incline_grade)
    
    # Convert watts to calories per hour
    calories_per_hour = M * 3600 / 4184
    return round(calories_per_hour)

@app.route('/calculate', methods=['POST'])
def calculate():
    """
    Endpoint to calculate calories burned per hour.
    
    Expects JSON with weight, pack_weight, speed, incline_grade, terrain_factor.
    """
    data = request.json
    weight = data['weight']
    pack_weight = data['pack_weight']
    speed = data['speed']
    incline_grade = data['incline_grade']
    terrain_type = data['terrain_type']
    
    result = calculate_calories(weight, pack_weight, speed, incline_grade, terrain_type)
    
    return jsonify({"calories_per_hour": result})

if __name__ == '__main__':
    app.run(debug=True, port=8080)


