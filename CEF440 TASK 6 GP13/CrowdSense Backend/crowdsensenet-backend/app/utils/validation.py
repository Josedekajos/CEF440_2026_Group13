from app.schemas import MIN_LATITUDE, MAX_LATITUDE, MIN_LONGITUDE, MAX_LONGITUDE, MIN_RSRP, MAX_RSRP


def validate_gps_coordinates(latitude: float, longitude: float) -> bool:
    """Validate that GPS coordinates are within Cameroon bounding box."""
    return MIN_LATITUDE <= latitude <= MAX_LATITUDE and MIN_LONGITUDE <= longitude <= MAX_LONGITUDE


def validate_rsrp(rsrp: float) -> bool:
    """Validate that RSRP is within valid range."""
    return MIN_RSRP <= rsrp <= MAX_RSRP


def validate_device_uuid(device_uuid: str) -> bool:
    """Validate that device_uuid is a non-empty string."""
    return device_uuid and isinstance(device_uuid, str) and len(device_uuid.strip()) > 0


def validate_timestamp(timestamp: int) -> bool:
    """Validate that timestamp is a positive integer."""
    return isinstance(timestamp, int) and timestamp > 0
