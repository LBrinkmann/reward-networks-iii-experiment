import httpx
import pytest

from models.session import Session
from models.subject import Subject


@pytest.mark.asyncio
async def test_get_progress(default_client: httpx.AsyncClient,
                            create_empty_experiment):
    url = f'/progress/'

    response = await default_client.get(url, auth=('admin', 'admin'))
    assert response.status_code == 200

    # Clean up resources
    await Session.find().delete()
    await Subject.find().delete()
