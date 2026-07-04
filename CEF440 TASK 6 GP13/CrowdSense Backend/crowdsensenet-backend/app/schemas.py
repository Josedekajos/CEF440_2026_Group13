from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime


# Cameroon bounding box
MIN_LATITUDE = 1.65
MAX_LATITUDE = 13.08
MIN_LONGITUDE = 8.50
MAX_LONGITUDE = 16.19

# RSRP valid range
MIN_RSRP = -140
MAX_RSRP = -44


class DeviceRegister(BaseModel):
    device_uuid: str = Field(..., min_length=1)
    first_seen: Optional[int] = None
    last_seen: Optional[int] = None

    @validator('device_uuid')
    def validate_device_uuid(cls, v):
        if not v or not isinstance(v, str) or len(v.strip()) == 0:
            raise ValueError('device_uuid must be a non-empty string')
        return v.strip()

    @validator('first_seen', 'last_seen')
    def validate_timestamp(cls, v):
        if v is not None:
            if not isinstance(v, int) or v <= 0:
                raise ValueError('timestamp must be a valid positive integer')
        return v


class DeviceResponse(BaseModel):
    device_uuid: str
    first_seen: Optional[int]
    last_seen: Optional[int]
    total_readings: int
    total_sessions: int
    created_at: datetime

    class Config:
        from_attributes = True


class ReadingBase(BaseModel):
    rsrp: Optional[float] = None
    rsrq: Optional[float] = None
    sinr: Optional[float] = None
    rssi: Optional[float] = None
    cell_id: Optional[int] = None
    network_type: Optional[str] = None
    operator: Optional[str] = None
    latitude: float
    longitude: float
    timestamp: int

    @validator('latitude')
    def validate_latitude(cls, v):
        if not (MIN_LATITUDE <= v <= MAX_LATITUDE):
            raise ValueError(f'latitude must be within Cameroon bounds: {MIN_LATITUDE} to {MAX_LATITUDE}')
        return v

    @validator('longitude')
    def validate_longitude(cls, v):
        if not (MIN_LONGITUDE <= v <= MAX_LONGITUDE):
            raise ValueError(f'longitude must be within Cameroon bounds: {MIN_LONGITUDE} to {MAX_LONGITUDE}')
        return v

    @validator('rsrp')
    def validate_rsrp(cls, v):
        if v is not None:
            if not (MIN_RSRP <= v <= MAX_RSRP):
                raise ValueError(f'RSRP must be between {MIN_RSRP} and {MAX_RSRP} dBm')
        return v

    @validator('timestamp')
    def validate_timestamp(cls, v):
        if not isinstance(v, int) or v <= 0:
            raise ValueError('timestamp must be a valid positive integer')
        return v


class ReadingCreate(ReadingBase):
    pass


class ReadingResponse(ReadingBase):
    reading_id: int
    session_id: str
    device_uuid: str
    is_synced: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SessionBase(BaseModel):
    session_id: str
    start_time: int
    end_time: Optional[int] = None
    total_readings: int = 0

    @validator('session_id')
    def validate_session_id(cls, v):
        if not v or not isinstance(v, str) or len(v.strip()) == 0:
            raise ValueError('session_id must be a non-empty string')
        return v.strip()

    @validator('start_time', 'end_time')
    def validate_timestamp(cls, v):
        if v is not None:
            if not isinstance(v, int) or v <= 0:
                raise ValueError('timestamp must be a valid positive integer')
        return v


class SessionCreate(SessionBase):
    pass


class SessionResponse(SessionBase):
    device_uuid: str
    upload_status: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class SyncRequest(BaseModel):
    device_uuid: str = Field(..., min_length=1)
    session: SessionCreate
    readings: List[ReadingCreate]

    @validator('device_uuid')
    def validate_device_uuid(cls, v):
        if not v or not isinstance(v, str) or len(v.strip()) == 0:
            raise ValueError('device_uuid must be a non-empty string')
        return v.strip()

    @validator('readings')
    def validate_readings(cls, v):
        if not v:
            raise ValueError('readings list cannot be empty')
        return v


class SyncResponse(BaseModel):
    success: bool
    readings_saved: int


class CoverageZoneResponse(BaseModel):
    grid_cell_id: str
    min_latitude: float
    max_latitude: float
    min_longitude: float
    max_longitude: float
    avg_rsrp: Optional[float]
    coverage_class: str
    reading_count: int
    last_updated: datetime

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_devices: int
    total_sessions: int
    total_readings: int
    total_coverage_zones: int
