# Pipelines, Stages and Operators

MongoDB aggregation pipelines are composed of sequential stages that process and transform documents, where each stage performs a specific operation using various operators before passing results to the next stage. Stages like `$match` (filtering), `$group` (grouping and aggregating), `$project` (field selection and transformation), `$sort` (ordering), `$lookup` (joins), and `$unwind` (array expansion) can be combined in any order to create complex data processing workflows. Operators within these stages include arithmetic operators ($add, $multiply), comparison operators ($eq, $gt), array operators ($push, $addToSet), date operators ($dateToString, $year), and conditional operators ($cond, $ifNull), providing a powerful and flexible framework for data analysis, reporting, and ETL operations directly within the database.

Visit the following resources to learn more:

- [@official@Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- [@official@Aggregation Stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/)
- [@official@\$project](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/)
- [@official@\$group](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)