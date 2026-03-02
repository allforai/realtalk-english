# Source: design.md TASK-B2-003 -- Scenario service
"""Scenario service: CRUD, review workflow, status transitions."""

from typing import Any, Dict, List, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.scenario_repo import ScenarioRepository


class ScenarioService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = ScenarioRepository(session)

    async def list_scenarios(self, filters: Dict[str, Any], user_id: UUID) -> Dict[str, Any]:
        """List published scenarios with user progress. Source: T001."""
        # TODO: implement list_scenarios from T001
        pass

    async def get_scenario(self, scenario_id: UUID, user_id: Optional[UUID] = None) -> Dict[str, Any]:
        """Get scenario detail with user progress."""
        # TODO: implement get_scenario from T001
        pass

    async def create_scenario(self, data: Dict[str, Any], author_id: UUID) -> Dict[str, Any]:
        """Create a new scenario in draft status. Source: T009."""
        # TODO: implement create_scenario from T009
        pass

    async def update_scenario(self, scenario_id: UUID, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a draft scenario. Source: T009."""
        # TODO: implement update_scenario from T009
        pass

    async def submit_for_review(self, scenario_id: UUID) -> None:
        """Submit scenario for review (draft -> review). Source: T009, CN006.

        Validates: title non-empty, nodes >= 3, difficulty set.
        """
        # TODO: implement submit_for_review from T009, CN006
        pass

    async def review_scenario(
        self, scenario_id: UUID, action: str, reviewer_id: UUID, reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """Approve or reject a scenario. Source: T010, CN006.

        - approve: review -> published
        - reject: review -> rejected (reason required, SCEN_005)
        """
        # TODO: implement review_scenario from T010, CN006
        pass

    async def get_review_queue(self, page: int = 1, size: int = 20) -> Dict[str, Any]:
        """List scenarios pending review. Source: T010."""
        # TODO: implement get_review_queue from T010
        pass
