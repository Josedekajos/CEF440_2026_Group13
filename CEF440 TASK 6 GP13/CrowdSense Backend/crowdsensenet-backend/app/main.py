from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import devices, sessions, readings, coverage, stats

# Create FastAPI app
app = FastAPI(title="CrowdSenseNet API", version="1.0.0")

# Add CORS middleware allowing all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all database tables on startup
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

# Include all routers with prefix /api
app.include_router(devices.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")
app.include_router(readings.router, prefix="/api")
app.include_router(coverage.router, prefix="/api")
app.include_router(stats.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "CrowdSenseNet API is running", "version": "1.0.0"}
