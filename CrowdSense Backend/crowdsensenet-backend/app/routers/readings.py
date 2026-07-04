from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Device, Session as SessionModel, SignalReading
from app.schemas import SyncRequest, SyncResponse
from app.utils.clustering import cluster_duplicate_readings, update_coverage_zone
from app.routers.devices import verify_device_uuid

router = APIRouter(tags=["readings"])


@router.post("/sync", response_model=SyncResponse)
def sync_data(
    sync_data: SyncRequest,
    x_device_uuid: str = Header(..., alias="X-Device-UUID"),
    db: Session = Depends(get_db)
):
    """
    Main upload endpoint. The Android app sends this when syncing Room database data to the server.
    Uses a single transaction for the entire request - if any operation fails, everything rolls back.
    """
    try:
        # Verify device UUID matches the one in the request body
        if sync_data.device_uuid != x_device_uuid:
            raise HTTPException(status_code=401, detail="Device UUID mismatch")
        
        # Start transaction
        with db.begin():
            # Get or create device
            device = db.query(Device).filter(Device.device_uuid == sync_data.device_uuid).first()
            if not device:
                device = Device(
                    device_uuid=sync_data.device_uuid,
                    first_seen=sync_data.session.start_time,
                    last_seen=sync_data.session.start_time
                )
                db.add(device)
                db.flush()
            else:
                # Update last_seen
                device.last_seen = sync_data.session.start_time
            
            # Get or create session
            session = db.query(SessionModel).filter(
                SessionModel.session_id == sync_data.session.session_id
            ).first()
            
            if not session:
                session = SessionModel(
                    session_id=sync_data.session.session_id,
                    device_uuid=sync_data.device_uuid,
                    start_time=sync_data.session.start_time,
                    end_time=sync_data.session.end_time,
                    total_readings=sync_data.session.total_readings,
                    upload_status="Synced",
                    is_active=False
                )
                db.add(session)
                device.total_sessions += 1
            else:
                # Update existing session
                session.end_time = sync_data.session.end_time
                session.total_readings = sync_data.session.total_readings
                session.upload_status = "Synced"
                session.is_active = False
            
            db.flush()
            
            # Cluster duplicate readings
            readings_data = [reading.dict() for reading in sync_data.readings]
            clustered_readings = cluster_duplicate_readings(readings_data)
            
            # Save readings and update coverage zones
            readings_saved = 0
            for reading_data in clustered_readings:
                reading = SignalReading(
                    session_id=session.session_id,
                    device_uuid=device.device_uuid,
                    rsrp=reading_data.get('rsrp'),
                    rsrq=reading_data.get('rsrq'),
                    sinr=reading_data.get('sinr'),
                    rssi=reading_data.get('rssi'),
                    cell_id=reading_data.get('cell_id'),
                    network_type=reading_data.get('network_type'),
                    operator=reading_data.get('operator'),
                    latitude=reading_data['latitude'],
                    longitude=reading_data['longitude'],
                    timestamp=reading_data['timestamp'],
                    is_synced=True
                )
                db.add(reading)
                
                # Update coverage zone for this reading
                update_coverage_zone(
                    db=db,
                    latitude=reading_data['latitude'],
                    longitude=reading_data['longitude'],
                    rsrp=reading_data.get('rsrp')
                )
                
                readings_saved += 1
            
            # Update device and session totals
            device.total_readings += readings_saved
            session.total_readings = readings_saved
            
            # Transaction commits automatically with context manager
        
        return SyncResponse(success=True, readings_saved=readings_saved)
    
    except Exception as e:
        # Transaction will be rolled back automatically
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")
