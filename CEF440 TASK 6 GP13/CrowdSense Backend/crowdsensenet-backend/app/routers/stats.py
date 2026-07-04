from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Device, Session as SessionModel, SignalReading, CoverageZone
from app.schemas import StatsResponse

router = APIRouter(tags=["stats"])


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Returns overall system stats: total_devices, total_sessions, total_readings, total_coverage_zones."""
    total_devices = db.query(Device).count()
    total_sessions = db.query(SessionModel).count()
    total_readings = db.query(SignalReading).count()
    total_coverage_zones = db.query(CoverageZone).count()
    
    return StatsResponse(
        total_devices=total_devices,
        total_sessions=total_sessions,
        total_readings=total_readings,
        total_coverage_zones=total_coverage_zones
    )
