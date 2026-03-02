# Barrel export -- import all models so Alembic auto-detects them.
from app.models.base import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.role import Role  # noqa: F401
from app.models.permission import Permission  # noqa: F401
from app.models.user_role import UserRole  # noqa: F401
from app.models.scenario import Scenario  # noqa: F401
from app.models.scenario_pack import ScenarioPack  # noqa: F401
from app.models.scenario_tag import ScenarioTag, ScenarioTagMap  # noqa: F401
from app.models.conversation import Conversation  # noqa: F401
from app.models.conversation_message import ConversationMessage  # noqa: F401
from app.models.pronunciation_score import PronunciationScore  # noqa: F401
from app.models.vocabulary_item import VocabularyItem  # noqa: F401
from app.models.review_card import ReviewCard  # noqa: F401
from app.models.user_streak import UserStreak  # noqa: F401
from app.models.achievement import Achievement, UserAchievement  # noqa: F401
from app.models.subscription import Subscription  # noqa: F401
from app.models.audit_log import AuditLog  # noqa: F401
from app.models.notification import Notification  # noqa: F401
from app.models.feedback import Feedback  # noqa: F401
from app.models.prompt_template import PromptTemplate  # noqa: F401
from app.models.system_config import SystemConfig  # noqa: F401
from app.models.daily_conversation_count import DailyConversationCount  # noqa: F401
