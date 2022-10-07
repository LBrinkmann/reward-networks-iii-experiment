import asyncio

import httpx
import pytest


@pytest.mark.asyncio
@pytest.mark.skip
async def test_one_subject(default_client: httpx.AsyncClient):
    await one_subject(default_client, 0)


@pytest.mark.asyncio
async def test_multiple_subjects(default_client: httpx.AsyncClient):
    tasks = []
    for i in range(1, 10):
        task = asyncio.create_task(one_subject(default_client, i))
        tasks.append(task)
    [await t for t in tasks]


async def one_subject(default_client, subj):
    subj_name = f'test-{subj}'
    headers = {
        "Content-Type": "application/json",
    }
    solution = {
        'moves': [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    url = f'/session/prolific_id_{subj_name}'
    # consent
    await get_post_trial(default_client, 'consent', 0, url)
    # Individual trials
    await get_post_trial(default_client, 'individual', 1, url, solution,
                         headers)


async def get_post_trial(client, trial_type, t_id, url, solution=None,
                         headers=None):
    # get trial
    response = await client.get(url)
    assert response.status_code == 200
    trial = response.json()
    assert trial['id'] == t_id
    assert trial['trial_type'] == trial_type

    await asyncio.sleep(0.1)

    # post solution
    url = f'{url}/{trial_type}'
    if solution is not None:
        response = await client.post(url, json=solution, headers=headers)
    else:
        response = await client.post(url)

    assert response.status_code == 200
    assert response.json()['message'] == 'Trial saved'
