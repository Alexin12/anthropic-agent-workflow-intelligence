from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Source
from app.schemas import HealthRead, SourceCreate, SourceRead


def create_app() -> FastAPI:
    app = FastAPI(title="Anthropic Agent Workflow Intelligence")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health", response_model=HealthRead)
    def health(db: Session = Depends(get_db)) -> HealthRead:
        db.execute(text("SELECT 1"))
        return HealthRead(status="ok", database="connected")

    @app.post(
        "/api/sources", response_model=SourceRead, status_code=status.HTTP_201_CREATED
    )
    def create_source(
        source_data: SourceCreate, db: Session = Depends(get_db)
    ) -> Source:
        source = Source(url=str(source_data.url))
        db.add(source)
        db.commit()
        db.refresh(source)
        return source

    @app.get("/api/sources", response_model=list[SourceRead])
    def list_sources(db: Session = Depends(get_db)) -> list[Source]:
        return list(db.scalars(select(Source).order_by(Source.created_at.desc())))

    return app


app = create_app()
