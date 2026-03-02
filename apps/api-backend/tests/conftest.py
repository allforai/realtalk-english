# Source: design.md TASK-B5-001 -- Test infrastructure
"""Test fixtures: async DB session, test client, authenticated clients, seed data."""

import asyncio
from typing import AsyncGenerator, Dict
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token
from app.main import app
from app.models.base import Base

# Use an in-memory SQLite or test PostgreSQL for isolation
# Override with TEST_DATABASE_URL env var if needed
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
test_session_factory = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    """Create a single event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provide a transactional database session that rolls back after each test."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with test_session_factory() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Unauthenticated test client."""

    async def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def consumer_client(client: AsyncClient) -> AsyncClient:
    """Authenticated client with consumer role."""
    token = create_access_token({"sub": str(uuid4()), "roles": ["consumer"]})
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest_asyncio.fixture(scope="function")
async def operator_client(client: AsyncClient) -> AsyncClient:
    """Authenticated client with operator role."""
    token = create_access_token({"sub": str(uuid4()), "roles": ["operator"]})
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest_asyncio.fixture(scope="function")
async def admin_client(client: AsyncClient) -> AsyncClient:
    """Authenticated client with admin role."""
    token = create_access_token({"sub": str(uuid4()), "roles": ["admin"]})
    client.headers["Authorization"] = f"Bearer {token}"
    return client
