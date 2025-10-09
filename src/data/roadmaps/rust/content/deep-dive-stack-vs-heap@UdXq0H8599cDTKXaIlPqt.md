# Deep Dive: Stack vs Heap

Stack memory stores fixed-size data with automatic allocation/deallocation following LIFO order - fast but limited. Heap memory stores dynamic-size data with manual management - slower but flexible. Rust's ownership system ensures memory safety across both, with stack being default and heap accessed via smart pointers.

Learn more from the following resources:

- [@official@Box, Stack and Heap](https://doc.rust-lang.org/rust-by-example/std/box.html)
- [@article@Memory Management in Rust: Stack vs. Heap](https://dev.to/iamdipankarpaul/memory-management-in-rust-stack-vs-heap-3m45)
- [@article@The Stack and the Heap](https://web.mit.edu/rust-lang_v1.25/arch/amd64_ubuntu1404/share/doc/rust/html/book/first-edition/the-stack-and-the-heap.html)
