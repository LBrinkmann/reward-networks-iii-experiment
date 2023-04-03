# Checklist before running an experiment

1. Prolific study
   1. Study URL includes `PROLIFIC_PID` parameter
   2. Participants from the previous study have been excluded
   3. Participants are prescreened based on the approval rate
2. Config is correct and updated on the server ([config docs](../docs/EXPERIMENT-CONFIG.md))
   1. Update the MongoDB collection name in `.gitlab-ci-backend.yml` at line 17 (e.g., `- echo "DATABASE_NAME=rn-iii-pilot-4b" >>build.env`)
   2. `redirect_url` is set to the correct value from the Prolific
   3. ⚠️`rewrite_previous_data` is set to `false` ⚠️
   4. Check that the study is empty (can be checked here: https://rn-iii-backend.eks-test-default.mpg-chm.com/progress/)
   5. Optional: Use `GET https://rn-iii-backend.eks-test-default.mpg-chm.com/admin/config` to double-check the config
