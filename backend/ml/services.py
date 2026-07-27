import logging
from django.db import transaction
from django.utils import timezone
from allocation.algorithms import build_prediction_features
from ml.predictor import predict_risk
from tasks.models import TaskAssignment

logger = logging.getLogger(__name__)

def update_task_prediction(task):
    """
    Idempotent service to generate or update AI risk prediction for a task.
    Skips if task has no assigned member.
    """
    try:
        # Verify task is assigned
        if not hasattr(task, 'assignment') or task.assignment is None:
            logger.info(f"Skipping prediction for Task {task.id}: No assignment found.")
            return None
    except TaskAssignment.DoesNotExist:
        logger.info(f"Skipping prediction for Task {task.id}: TaskAssignment.DoesNotExist.")
        return None

    with transaction.atomic():
        # Build features
        features = build_prediction_features(task)
        
        # Normalize priority (Encoder Safety: priority_encoder expects lowercase 'low', 'medium', 'high')
        if 'priority' in features and isinstance(features['priority'], str):
            features['priority'] = features['priority'].lower()

        # Predict risk
        prediction = predict_risk(features)

        # Update task
        task.predicted_risk = prediction["predicted_risk"]
        task.risk_confidence = prediction["confidence"]
        task.last_risk_update = timezone.now()
        task.save(update_fields=['predicted_risk', 'risk_confidence', 'last_risk_update'])

        logger.info(
            f"Task {task.id} Prediction Updated | "
            f"Risk: {task.predicted_risk} | "
            f"Confidence: {task.risk_confidence}% | "
            f"Timestamp: {task.last_risk_update}"
        )
        
        return prediction

