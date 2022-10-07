import httpx
import pytest


@pytest.mark.asyncio
async def test_get_post_trials(default_client: httpx.AsyncClient):
    subj = 'test-test'
    headers = {
        "Content-Type": "application/json",
    }
    url = f'/session/prolific_id_{subj}'

    response = await default_client.get(url)
    assert response.status_code == 200
    trial = response.json()
    assert trial['trial_num_in_session'] == 0
    assert trial['trial_type'] == 'consent'

    response = await default_client.post(url)
    assert response.status_code == 200
    assert response.json()['message'] == 'Trial saved'

    # Individual trials
    response = await default_client.get(url)
    assert response.status_code == 200
    trial = response.json()
    assert trial['trial_num_in_session'] == 1
    assert trial['trial_type'] == 'individual'

    moves = {
        'moves': [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }

    response = await default_client.post(url, json=moves, headers=headers)



