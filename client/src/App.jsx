import React, { useState, useEffect  } from 'react';
import Web3 from 'web3';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import './styles.css'


function App() {

  useEffect(() => {
    connectWeb3();
    loadContract();
}, []);
  const connectWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        return window.web3;
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return window.web3;
    } else {
      console.error("No Ethereum interface injected into browser");
    }
  };
  
  const loadContract = async () => {
    const web3 = await connectWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SimpleStorageContract.networks[networkId];
    return new web3.eth.Contract(
      SimpleStorageContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
  };

  const addBook = async (title, author) => {
    const contract = await loadContract();
    const accounts = await window.web3.eth.getAccounts();
    return contract.methods.addBook(title, author).send({ from: accounts[0] });
  };
  
   const borrowBook = async (id) => {
    const contract = await loadContract();
    const accounts = await window.web3.eth.getAccounts();
    return contract.methods.borrowBook(id).send({ from: accounts[0] });
  };
  
   const returnBook = async (id) => {
    const contract = await loadContract();
    const accounts = await window.web3.eth.getAccounts();
    return contract.methods.returnBook(id).send({ from: accounts[0] });
  };
  
   const getBookById = async (id) => {
    const contract = await loadContract();
    return contract.methods.books(id).call();
  };

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState(null);

  const handleAddBook = async () => {
    await addBook(title, author);
  };

  const handleBorrowBook = async () => {
    await borrowBook(bookId);
  };

  const handleReturnBook = async () => {
    await returnBook(bookId);
  };

  const handleGetBook = async () => {
    const fetchedBook = await getBookById(bookId);
    setBook(fetchedBook);
  };


  return (
    <div className="container">
      <h2>Library Management System</h2>
      <div className="input-group">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="input-group">
        <label>Author:</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <button className="primary-button" onClick={handleAddBook}>Add Book</button>

      <div className="input-group">
        <label>Book ID:</label>
        <input type="text" value={bookId} onChange={(e) => setBookId(e.target.value)} />
      </div>
      <button className="secondary-button" onClick={handleBorrowBook}>Borrow Book</button>
      <button className="secondary-button" onClick={handleReturnBook}>Return Book</button>
      <button className="secondary-button" onClick={handleGetBook}>Get Book</button>

      {book && (
        <div className="book-details">
          <h2>Book Details</h2>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Available:</strong> {book.available ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );

}

export default App;
