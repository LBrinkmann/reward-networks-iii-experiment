# Checklist before running an experiment

1. Prolific study
   1. Study URL includes `PROLIFIC_PID` parameter
   2. Participants from the previous study have been excluded
   3. Participants are prescreened based on the approval rate
2. Config is correct and updated on the server (see Postman RN-III config collection)
   1. `redirect_url` is set to the correct value from the Prolific
   2. ⚠️`rewrite_previous_data` is set to `false` ⚠️
   3. Check that the study is empty (can be checked here: https://rn-iii-backend.eks-test-default.mpg-chm.com/progress/)
   4. Optional: Use `GET https://rn-iii-backend.eks-test-default.mpg-chm.com/admin/config` to double-check the config
