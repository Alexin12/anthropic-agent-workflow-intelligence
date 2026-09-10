from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import create_app


def test_saved_source_is_available_in_a_new_app_session() -> None:
    source_url = f"https://example.com/{uuid4()}"

    with TestClient(create_app()) as client:
        response = client.post("/api/sources", json={"url": source_url})

    assert response.status_code == 201
    assert response.json()["url"] == source_url

    with TestClient(create_app()) as restarted_client:
        sources = restarted_client.get("/api/sources")

    assert sources.status_code == 200
    assert source_url in [source["url"] for source in sources.json()]
