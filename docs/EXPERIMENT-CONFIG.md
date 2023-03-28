# How to configure the experiment settings

There are multiple admin routs that can be used to configure the experiment. It is most convenient to use Postman RN-III config collection to configure the experiment.

### Get the current study configuration

`GET https://rn-iii-backend.eks-test-default.mpg-chm.com/admin/config`

### Create a new study

`POST https://rn-iii-backend.eks-test-default.mpg-chm.com/admin/config`

### Get the current study session tree (open in the Browser for visualization)

`GET https://rn-iii-backend.eks-test-default.mpg-chm.com/progress/`

### Get all results in the database

`GET https://rn-iii-backend.eks-test-default.mpg-chm.com/results/sessions`

### Get results for a specific experiment

`GET https://rn-iii-backend.eks-test-default.mpg-chm.com/results/sessions?experiment_type=DB_COLLECTION_NAME&finished=true`

### Study configuration examples

#### Pilot 1A

```json

{
  "active": true,
  "redirect_url": "https://app.prolific.co/submissions/complete?cc=<code>",
  "experiment_type": "rn-iii-pilot-1a",
  "rewrite_previous_data": false,
  "n_generations": 1,
  "n_sessions_first_generation": 10,
  "n_ai_players": 0,
  "n_sessions_per_generation": 10,
  "n_advise_per_session": 5,
  "n_session_tree_replications": 1,
  "n_social_learning_trials": 2,
  "n_individual_trials": 6,
  "n_demonstration_trials": 2
}

```

#### Pilot 1B

```json

{
  "active": true,
  "redirect_url": "https://app.prolific.co/submissions/complete?cc=<code>",
  "experiment_type": "rn-iii-pilot-1a",
  "rewrite_previous_data": false,
  "n_generations": 2,
  "n_sessions_first_generation": 10,
  "n_ai_players": 10,
  "n_sessions_per_generation": 10,
  "n_advise_per_session": 5,
  "n_session_tree_replications": 1,
  "n_social_learning_trials": 2,
  "n_individual_trials": 6,
  "n_demonstration_trials": 2
}

```