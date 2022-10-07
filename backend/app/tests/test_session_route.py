import httpx
import pytest


@pytest.mark.asyncio
async def test_get_post_trials(default_client: httpx.AsyncClient):
    subj = 'test-test'
    headers = {
        "Content-Type": "application/json",
    }
    solution = {
        'moves': [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    url = f'/session/prolific_id_{subj}'

    response = await default_client.get(url)
    assert response.status_code == 200
    trial = response.json()
    assert trial['id'] == 0
    assert trial['trial_type'] == 'consent'

    response = await default_client.post(url, json=solution, headers=headers)
    assert response.status_code == 200
    assert response.json()['message'] == 'Trial saved'

    # Individual trials
    response = await default_client.get(url)
    assert response.status_code == 200
    trial = response.json()
    assert trial['id'] == 1
    assert trial['trial_type'] == 'individual'

    response = await default_client.post(url, json=solution, headers=headers)



