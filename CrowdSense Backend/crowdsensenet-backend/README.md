# CrowdSenseNet Backend

A Python FastAPI backend for the CrowdSenseNet Android crowdsensing app that collects mobile network signal data (RSRP, RSRQ, SINR, RSSI, Cell ID, GPS coordinates) from Android phones in Cameroon.

## Project Structure

```
crowdsensenet-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── devices.py
│   │   ├── sessions.py
│   │   ├── readings.py
│   │   ├── coverage.py
│   │   └── stats.py
│   └── utils/
│       ├── __init__.py
│       ├── validation.py
│       └── clustering.py
├── requirements.txt
├── .env
└── README.md
```

## Database Schema

The application uses PostgreSQL with SQLAlchemy ORM and includes the following tables:

1. **devices** - Stores device information (UUID, first_seen, last_seen, total_readings, total_sessions)
2. **sessions** - Stores session data (session_id, device_uuid, start_time, end_time, total_readings, upload_status)
3. **signal_readings** - Stores signal measurements (rsrp, rsrq, sinr, rssi, cell_id, network_type, operator, GPS coordinates, timestamp)
4. **coverage_zones** - Stores coverage analysis for 1km x 1km grid cells (avg_rsrp, coverage_class, reading_count)
5. **ml_predictions** - Stores ML predictions for coverage areas

## API Endpoints

### POST /api/devices/register
Registers a device by its anonymous UUID. If the device already exists, it updates the last_seen timestamp.

### POST /api/sync
Main upload endpoint for syncing Room database data from the Android app. Saves device, session, readings, and updates coverage zones in a single transaction.

### GET /api/coverage
Returns all coverage zones as a list for the heatmap visualization.

### GET /api/coverage/{grid_cell_id}
Returns details of a specific coverage zone.

### GET /api/readings/{session_id}
Returns all readings for a given session.

### GET /api/stats
Returns overall system statistics (total_devices, total_sessions, total_readings, total_coverage_zones).

## Validation Rules

- GPS coordinates must be within Cameroon bounding box (Latitude: 1.65 to 13.08, Longitude: 8.50 to 16.19)
- RSRP must be between -140 and -44 dBm if provided
- device_uuid must be a valid non-empty string
- timestamp must be a valid positive integer

## Coverage Classification

Coverage zones are classified based on average RSRP:
- **GOOD**: avg_rsrp > -80 dBm
- **AVERAGE**: -80 to -100 dBm
- **POOR**: -100 to -110 dBm
- **HOLE**: below -110 dBm
- **INSUFFICIENT_DATA**: reading_count < 50

## Duplicate Clustering

When saving readings, if more than 3 readings exist within a 10-meter radius within the same hour, their RSRP values are averaged and stored as one representative reading.

## Security

- All endpoints except `/api/stats` require the `X-Device-UUID` header to match a registered device
- Returns HTTP 401 if header is missing or device not found
- CORS enabled for all origins (MVP configuration)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Edit the `.env` file with your PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/crowdsensenet
   ```

3. **Create the PostgreSQL database:**
   ```bash
   createdb crowdsensenet
   ```

4. **Run the server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`

## Dependencies

- fastapi==0.111.0
- uvicorn==0.29.0
- sqlalchemy==2.0.30
- psycopg2-binary==2.9.9
- alembic==1.13.1
- pydantic==2.7.1
- pydantic-settings==2.2.1
- python-dotenv==1.0.1
- geoalchemy2==0.15.1
- httpx==0.27.0
