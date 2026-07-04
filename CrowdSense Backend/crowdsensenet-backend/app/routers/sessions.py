from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Device, Session as SessionModel, SignalReading
from app.schemas import ReadingResponse
from app.routers.devices import verify_device_uuid

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.get("/{session_id}/readings", response_model=List[ReadingResponse])
def get_session_readings(
    session_id: str,
    device: Device = Depends(verify_device_uuid),
    db: Session = Depends(get_db)
):
    """Returns all readings for a given session."""
    # Verify session belongs to the device
    session = db.query(SessionModel).filter(
        SessionModel.session_id == session_id,
        SessionModel.device_uuid == device.device_uuid
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    readings = db.query(SignalReading).filter(
        SignalReading.session_id == session_id
    ).all()
    
    return readings
