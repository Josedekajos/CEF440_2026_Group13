from sqlalchemy import Column, String, Integer, Float, Boolean, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Device(Base):
    __tablename__ = "devices"

    device_uuid = Column(String, primary_key=True, index=True)
    first_seen = Column(BigInteger, nullable=True)
    last_seen = Column(BigInteger, nullable=True)
    total_readings = Column(Integer, default=0)
    total_sessions = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship("Session", back_populates="device")
    readings = relationship("SignalReading", back_populates="device")


class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True, index=True)
    device_uuid = Column(String, ForeignKey("devices.device_uuid"), nullable=False)
    start_time = Column(BigInteger, nullable=False)
    end_time = Column(BigInteger, nullable=True)
    total_readings = Column(Integer, default=0)
    upload_status = Column(String, default="Pending")  # Pending/Synced/Failed
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    device = relationship("Device", back_populates="sessions")
    readings = relationship("SignalReading", back_populates="session")


class SignalReading(Base):
    __tablename__ = "signal_readings"

    reading_id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, ForeignKey("sessions.session_id"), nullable=False)
    device_uuid = Column(String, ForeignKey("devices.device_uuid"), nullable=False)
    rsrp = Column(Float, nullable=True)
    rsrq = Column(Float, nullable=True)
    sinr = Column(Float, nullable=True)
    rssi = Column(Float, nullable=True)
    cell_id = Column(Integer, nullable=True)
    network_type = Column(String, nullable=True)
    operator = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(BigInteger, nullable=False)
    is_synced = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("Session", back_populates="readings")
    device = relationship("Device", back_populates="readings")


class CoverageZone(Base):
    __tablename__ = "coverage_zones"

    grid_cell_id = Column(String, primary_key=True, index=True)
    min_latitude = Column(Float, nullable=False)
    max_latitude = Column(Float, nullable=False)
    min_longitude = Column(Float, nullable=False)
    max_longitude = Column(Float, nullable=False)
    avg_rsrp = Column(Float, nullable=True)
    coverage_class = Column(String, nullable=False)  # GOOD/AVERAGE/POOR/HOLE/INSUFFICIENT_DATA
    reading_count = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    ml_predictions = relationship("MLPrediction", back_populates="coverage_zone")


class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    prediction_id = Column(Integer, primary_key=True, autoincrement=True)
    grid_cell_id = Column(String, ForeignKey("coverage_zones.grid_cell_id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    predicted_rsrp = Column(Float, nullable=True)
    coverage_class = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    reading_count = Column(Integer, default=0)
    prediction_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    coverage_zone = relationship("CoverageZone", back_populates="ml_predictions")
