# Inodes

An inode (index node) is a data structure in Linux filesystems that stores metadata about files and directories except their names and actual data. Contains file size, owner, permissions, timestamps, and more. Each file has a unique inode number for identification. Understanding inodes helps with advanced operations like linking and file recovery. Use `ls -i filename` to view inode numbers.

Visit the following resources to learn more:

- [@article@Introduction to Inodes](https://linuxjourney.com/lesson/inodes)
- [@article@Index Nodes — The Linux Kernel documentation](https://www.kernel.org/doc/html/latest/filesystems/ext4/inodes.html?highlight=inode)