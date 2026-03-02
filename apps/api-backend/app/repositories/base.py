# Source: design.md TASK-B1-010 -- GenericRepository[T] base
"""Generic async repository with CRUD operations for SQLAlchemy 2.0 models."""

from typing import Any, Dict, Generic, List, Optional, Type, TypeVar
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

T = TypeVar("T", bound=Base)


class GenericRepository(Generic[T]):
    """Base repository providing common CRUD operations.

    Subclass and set ``model`` to the concrete SQLAlchemy model class.
    """

    model: Type[T]

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id: UUID) -> Optional[T]:
        """Fetch a single record by primary key."""
        # TODO: implement get_by_id
        result = await self.session.get(self.model, id)
        return result

    async def list(
        self,
        filters: Optional[Dict[str, Any]] = None,
        page: int = 1,
        size: int = 20,
    ) -> Dict[str, Any]:
        """Return a paginated list: {items, total, page, size}."""
        # TODO: implement list with dynamic filters
        stmt = select(self.model)
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        # Count
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar() or 0

        # Paginate
        stmt = stmt.offset((page - 1) * size).limit(size)
        result = await self.session.execute(stmt)
        items = list(result.scalars().all())

        return {"items": items, "total": total, "page": page, "size": size}

    async def create(self, data: Dict[str, Any]) -> T:
        """Insert a new record."""
        # TODO: implement create
        instance = self.model(**data)
        self.session.add(instance)
        await self.session.flush()
        return instance

    async def update(self, id: UUID, data: Dict[str, Any]) -> Optional[T]:
        """Update an existing record by ID."""
        # TODO: implement update
        instance = await self.get_by_id(id)
        if instance is None:
            return None
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
        await self.session.flush()
        return instance

    async def soft_delete(self, id: UUID) -> Optional[T]:
        """Soft-delete a record (set is_active=False if the field exists)."""
        # TODO: implement soft_delete
        instance = await self.get_by_id(id)
        if instance is None:
            return None
        if hasattr(instance, "is_active"):
            instance.is_active = False  # type: ignore[attr-defined]
            await self.session.flush()
        return instance
