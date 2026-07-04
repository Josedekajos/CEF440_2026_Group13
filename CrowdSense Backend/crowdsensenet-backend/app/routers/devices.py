from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Device
from app.schemas import DeviceRegister, DeviceResponse

router = APIRouter(prefix="/devices", tags=["devices"])


def verify_device_uuid(x_device_uuid: str = Header(..., alias="X-Device-UUID"), db: Session = Depends(get_db)):
    """Verify that the device UUID exists in the database."""
    device = db.query(Device).filter(Device.device_uuid == x_device_uuid).first()
    if not device:
        raise HTTPException(status_code=401, detail="Device not registered")
    return device


@router.post("/register", response_model=DeviceResponse)
def register_device(device_data: DeviceRegister, db: Session = Depends(get_db)):
    """Register a device by its anonymous UUID. Update last_seen if device already exists."""
    existing_device = db.query(Device).filter(Device.device_uuid == device_data.device_uuid).first()
    
    if existing_device:
        # Update last_seen if provided
        if device_data.last_seen is not None:
            existing_device.last_seen = device_data.last_seen
        db.commit()
        db.refresh(existing_device)
        return existing_device
    else:
        # Create new device
        new_device = Device(
            device_uuid=device_data.device_uuid,
            first_seen=device_data.first_seen,
            last_seen=device_data.last_seen
        )
        db.add(new_device)
        db.commit()
        db.refresh(new_device)
        return new_device
