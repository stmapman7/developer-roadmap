# $exclude

The `$exclude` projection operator in MongoDB is used to explicitly exclude specific fields from query results, allowing you to return all fields of a document except those that are explicitly excluded. When using $exclude, you specify which fields to omit by setting them to 0 or false in the projection document, and all other fields will be automatically included in the result set. This operator is particularly useful when you want to retrieve most of a document's data while excluding sensitive information like passwords, internal metadata, or large fields that are not needed for a particular operation, helping reduce network bandwidth and improve query performance by transferring only the necessary data.

Visit the following resources to learn more:

- [@official@Include or Exclude Fields in a Wildcard Index](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-wildcard/create-wildcard-index-multiple-fields/)
- [@official@Project Fields to Return from Query](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/)
