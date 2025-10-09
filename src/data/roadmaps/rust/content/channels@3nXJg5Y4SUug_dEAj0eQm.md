# Channels

Channels enable thread communication via message passing from `std::sync::mpsc` (Multiple Producer, Single Consumer). They have `Sender` for sending data and `Receiver` for receiving. This avoids shared state concurrency issues and enables safe communication between threads without data races.

Learn more from the following links:

- [@official@Channels](https://doc.rust-lang.org/rust-by-example/std_misc/channels.html)
- [@article@Using Channels in Rust: Why and When?](https://howtorust.com/using-channels-in-rust-why-and-when/)