from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import CoverageZone
from app.schemas import CoverageZoneResponse
from app.routers.devices import verify_device_uuid

router = APIRouter(prefix="/coverage", tags=["coverage"])


@router.get("", response_model=List[CoverageZoneResponse])
def get_all_coverage_zones(db: Session = Depends(get_db)):
    """Returns all coverage zones as a list for the heatmap."""
    coverage_zones = db.query(CoverageZone).all()
    return coverage_zones


@router.get("/{grid_cell_id}", response_model=CoverageZoneResponse)
def get_coverage_zone(grid_cell_id: str, db: Session = Depends(get_db)):
    """Returns details of one specific coverage zone."""
    coverage_zone = db.query(CoverageZone).filter(
        CoverageZone.grid_cell_id == grid_cell_id
    ).first()
    
    if not coverage_zone:
        raise HTTPException(status_code=404, detail="Coverage zone not found")
    
    return coverage_zone
