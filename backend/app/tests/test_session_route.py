import httpx
import pytest


@pytest.mark.asyncio
async def test_get_post_trials(default_client: httpx.AsyncClient):
    subj = 'test-test'
    url = f'/session/prolific_id_{subj}'

    response = await default_client.get(url)
    assert response.status_code == 200
    trial = response.json()
    assert trial['trial_num_in_session'] == 0
    assert trial['trial_type'] == 'consent'



