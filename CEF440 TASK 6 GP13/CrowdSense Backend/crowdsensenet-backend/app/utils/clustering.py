from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models import SignalReading, CoverageZone
import math


def generate_grid_cell_id(latitude: float, longitude: float) -> str:
    """Generate grid cell ID by rounding coordinates to 2 decimal places."""
    rounded_lat = round(latitude, 2)
    rounded_lon = round(longitude, 2)
    return f"{rounded_lat}_{rounded_lon}"


def classify_coverage(avg_rsrp: Optional[float], reading_count: int) -> str:
    """Classify coverage based on average RSRP and reading count."""
    if reading_count < 50:
        return "INSUFFICIENT_DATA"
    
    if avg_rsrp is None:
        return "INSUFFICIENT_DATA"
    
    if avg_rsrp > -80:
        return "GOOD"
    elif avg_rsrp > -100:
        return "AVERAGE"
    elif avg_rsrp > -110:
        return "POOR"
    else:
        return "HOLE"


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate Haversine distance between two points in meters."""
    R = 6371000  # Earth's radius in meters
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def cluster_duplicate_readings(readings: List[Dict]) -> List[Dict]:
    """
    Cluster duplicate readings within 10m radius within the same hour.
    If more than 3 readings exist within a 10m radius within the same hour,
    average their RSRP values and store one representative reading.
    """
    if not readings:
        return readings
    
    # Sort readings by timestamp
    sorted_readings = sorted(readings, key=lambda x: x['timestamp'])
    
    clustered = []
    used_indices = set()
    
    for i, reading in enumerate(sorted_readings):
        if i in used_indices:
            continue
        
        # Find nearby readings within 10m and same hour
        nearby_readings = [reading]
        hour_start = reading['timestamp'] - (reading['timestamp'] % 3600000)  # Hour in milliseconds
        hour_end = hour_start + 3600000
        
        for j in range(i + 1, len(sorted_readings)):
            if j in used_indices:
                continue
            
            other = sorted_readings[j]
            
            # Check if within same hour
            if not (hour_start <= other['timestamp'] < hour_end):
                continue
            
            # Check if within 10m radius
            distance = calculate_distance(
                reading['latitude'], reading['longitude'],
                other['latitude'], other['longitude']
            )
            
            if distance <= 10:
                nearby_readings.append(other)
                used_indices.add(j)
        
        # If more than 3 readings, average them
        if len(nearby_readings) > 3:
            avg_reading = average_readings(nearby_readings)
            clustered.append(avg_reading)
        else:
            clustered.append(reading)
        
        used_indices.add(i)
    
    return clustered


def average_readings(readings: List[Dict]) -> Dict:
    """Average multiple readings into one representative reading."""
    avg_rsrp = None
    avg_rsrq = None
    avg_sinr = None
    avg_rssi = None
    
    rsrp_values = [r['rsrp'] for r in readings if r['rsrp'] is not None]
    rsrq_values = [r['rsrq'] for r in readings if r['rsrq'] is not None]
    sinr_values = [r['sinr'] for r in readings if r['sinr'] is not None]
    rssi_values = [r['rssi'] for r in readings if r['rssi'] is not None]
    
    if rsrp_values:
        avg_rsrp = sum(rsrp_values) / len(rsrp_values)
    if rsrq_values:
        avg_rsrq = sum(rsrq_values) / len(rsrq_values)
    if sinr_values:
        avg_sinr = sum(sinr_values) / len(sinr_values)
    if rssi_values:
        avg_rssi = sum(rssi_values) / len(rssi_values)
    
    # Use the first reading's location and timestamp as representative
    representative = readings[0].copy()
    representative['rsrp'] = avg_rsrp
    representative['rsrq'] = avg_rsrq
    representative['sinr'] = avg_sinr
    representative['rssi'] = avg_rssi
    
    return representative


def update_coverage_zone(db: Session, latitude: float, longitude: float, rsrp: Optional[float]):
    """
    Update or insert coverage zone for a given reading.
    Grid cell is 1km x 1km (rounded to 2 decimal places).
    """
    grid_cell_id = generate_grid_cell_id(latitude, longitude)
    
    # Calculate grid cell boundaries
    rounded_lat = round(latitude, 2)
    rounded_lon = round(longitude, 2)
    
    min_lat = rounded_lat - 0.005
    max_lat = rounded_lat + 0.005
    min_lon = rounded_lon - 0.005
    max_lon = rounded_lon + 0.005
    
    # Check if coverage zone exists
    coverage_zone = db.query(CoverageZone).filter(
        CoverageZone.grid_cell_id == grid_cell_id
    ).first()
    
    if coverage_zone:
        # Update existing coverage zone
        coverage_zone.reading_count += 1
        
        # Recalculate average RSRP
        if rsrp is not None:
            if coverage_zone.avg_rsrp is None:
                coverage_zone.avg_rsrp = rsrp
            else:
                # Weighted average based on reading count
                total_rsrp = coverage_zone.avg_rsrp * (coverage_zone.reading_count - 1) + rsrp
                coverage_zone.avg_rsrp = total_rsrp / coverage_zone.reading_count
        
        # Update coverage class
        coverage_zone.coverage_class = classify_coverage(
            coverage_zone.avg_rsrp,
            coverage_zone.reading_count
        )
    else:
        # Create new coverage zone
        coverage_zone = CoverageZone(
            grid_cell_id=grid_cell_id,
            min_latitude=min_lat,
            max_latitude=max_lat,
            min_longitude=min_lon,
            max_longitude=max_lon,
            avg_rsrp=rsrp,
            coverage_class=classify_coverage(rsrp, 1),
            reading_count=1
        )
        db.add(coverage_zone)
    
    return coverage_zone
