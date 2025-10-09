# $in

The `$in` operator in MongoDB selects documents where a field value matches any value in a specified array. It provides efficient multiple value matching without using multiple $or conditions. `$in` supports all BSON data types and is particularly useful for filtering by lists of IDs, categories, or enumerated values, offering better performance than equivalent $or queries.

Visit the following resources to learn more:

- [@official@Aggregation Operators](https://www.mongodb.com/docs/manual/reference/operator/aggregation/)
- [@official@\$in](https://www.mongodb.com/docs/manual/reference/operator/aggregation/gte/)
