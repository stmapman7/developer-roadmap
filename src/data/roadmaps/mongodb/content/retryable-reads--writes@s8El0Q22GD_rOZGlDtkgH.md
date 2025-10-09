# Retryable Reads / Writes

Retryable reads and writes in MongoDB are client-side features that automatically retry certain database operations when they encounter transient network errors or temporary server unavailability, improving application resilience and user experience. The MongoDB drivers can automatically retry read operations and specific write operations (like inserts, updates, deletes, and findAndModify) exactly once when they fail due to network issues, replica set elections, or other recoverable errors, without requiring changes to application code. This feature is particularly valuable in distributed environments, cloud deployments, and replica set configurations where temporary connectivity issues or failover events are common, as it reduces the likelihood of application errors and provides a better user experience by handling transient failures transparently.

Visit the following resources to learn more:

- [@official@Retryable Reads](https://www.mongodb.com/docs/manual/core/retryable-writes/)
- [@official@Retryable Writes](https://www.mongodb.com/docs/manual/core/retryable-reads/)
