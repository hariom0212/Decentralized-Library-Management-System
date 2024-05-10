// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {
  struct Book {
        uint id;
        string title;
        string author;
        bool available;
    }

    mapping(uint => Book) public books;
    uint public totalBooks;

    event BookAdded(uint indexed id, string title, string author);
    event BookBorrowed(uint indexed id);
    event BookReturned(uint indexed id);

    function addBook(string memory _title, string memory _author) public {
        totalBooks++;
        books[totalBooks] = Book(totalBooks, _title, _author, true);
        emit BookAdded(totalBooks, _title, _author);
    }

    function borrowBook(uint _id) public {
        require(books[_id].available, "Book is not available");
        books[_id].available = false;
        emit BookBorrowed(_id);
    }

    function returnBook(uint _id) public {
        require(!books[_id].available, "Book is already available");
        books[_id].available = true;
        emit BookReturned(_id);
    }
}
