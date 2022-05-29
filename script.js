// UI elements
const addBookButton = document.querySelector('#addBook');
const updateBookButton = document.querySelector('#updateBook');
const addBookForm = document.querySelector('form');
const bookList = document.querySelector('#bookList');
const pageGrid = document.querySelector('.page-grid');
const addDemoBooksLink = document.querySelector('#demo-books-link');
const clearBooks = document.querySelector('#clear-books-link');
const modalHeading = document.querySelector('#modalHeading');
const modal = document.querySelector("#newBookModal");
const modalButton = document.querySelector("#new-book");
const span = document.querySelector('.close');
let deleteButtons = document.querySelectorAll('.delete-button');
let readButtons = document.querySelectorAll('.read-button');
let editButtons = document.querySelectorAll('.edit-button');

// Form field elements
const bookTitle = document.querySelector('#bookTitle');
const bookRating = document.querySelector('#bookRating');
const bookAuthor = document.querySelector('#bookAuthor');
const bookPages = document.querySelector('#bookPages');
const bookRead = document.querySelector('#bookRead');
const bookDescription = document.querySelector('#bookDescription');

// Event listeners for buttons (note modal buttons use .onclick method, see bottom of script)
addBookButton.addEventListener('click',addBookToLibrary);
updateBookButton.addEventListener('click',updateBook);
addDemoBooksLink.addEventListener('click',demoArray);
clearBooks.addEventListener('click',clearBookList);

// Book list array
let myLibrary = [];

// Insert intro message
insertIntroMessage();

// Object constructor
function Book(title, author, pages, read, description, rating, bookIndex) {
  this.title = title
  this.author = author
  this.pages = pages
  this.read = read
  this.description = description
  this.rating = rating
  this.bookIndex = bookIndex
}

//Function to update 'read' on Book objects
Book.prototype.readStatus = function() {
  this.read === true ? this.read = false : this.read = true;
  console.log(this)
}

/* This function collects the data from the form, and adds it to the
myLibrary array as an Object via the constructor above */
function addBookToLibrary() {
  // If the form isn't valid, don't run the function
  if (!addBookForm.checkValidity()) return
  // Collect values from form fields
  const bookIndex = myLibrary.length; // Use the .lenth method to find the next index number
  const newBook = new Book(
    bookTitle.value,
    bookAuthor.value,
    bookPages.value,
    bookRead.checked,
    bookDescription.value,
    parseInt(bookRating.value),
    bookIndex
    );
  myLibrary.push(newBook);
  addBookForm.reset();
  displayBooks();
}

/* This function clears the display and then inserts new HTML for
each array item. */
function displayBooks() {
  pageGrid.innerHTML = "";
  myLibrary.forEach((book, index) => {
    let isRead = "book-read";
    if(book.read === false){isRead = ""}
    const cardHTML = `
      <div class="book-card ${isRead}">
        <h2>${book.title}</h2>
        <h3><span>by </span>${book.author}</h3>
        <p class="rating-stars">${displayRatingStars(book)}</p>
        <p>${book.description}</p>
        <div class="card-details">
          <p>${book.pages} pages</p>
          <div>
            <input data-book-index="${index}" type="checkbox" id="bookRead-${index}" name="bookRead" class="read-button" ${bookIsRead(book.read)}>
            <label class="book-read-label" for="bookRead-${index}">Read</label>
          </div>
          <div data-book-index="${index}" class="edit-button"></div>
          <div data-book-index="${index}" class="delete-button"></div>
        </div>
      </div>
      `;
    pageGrid.insertAdjacentHTML('afterbegin',cardHTML);
  });
  clearModal();
  updateDeleteButtons();
  updateReadButtons();
  updateEditButtons()
}

function displayRatingStars(book) {
  switch(book.rating) {
    case 1:
      return "<span class='stars'>&#9733;</span> &#9734; &#9734; &#9734; &#9734;"
    case 2:
      return "<span class='stars'>&#9733; &#9733;</span> &#9734; &#9734; &#9734;"
    case 3:
      return "<span class='stars'>&#9733; &#9733; &#9733;</span> &#9734; &#9734;"
    case 4:
      return "<span class='stars'>&#9733; &#9733; &#9733; &#9733;</span> &#9734;"
    case 5:
      return "<span class='stars'>&#9733; &#9733; &#9733; &#9733; &#9733;</span>"
    default:
      return "&#9734; &#9734; &#9734; &#9734; &#9734;"
  }
}

function updateReadStatus(e) {
  const bookIndex = e.target.getAttribute('data-book-index');
  myLibrary[bookIndex].readStatus();
  displayBooks();
}

function bookIsRead(checkbox){
  if (checkbox === true) {
    return 'checked'
  } else { 
    return 'unchecked'
  }
}

function clearBookList() {
  const confirmDelete = confirm("Are you sure you want to delete all your books?");
  if (confirmDelete === false) return;
  myLibrary = [];
  demoBookVolume = 1;
  displayBooks();
  insertIntroMessage();
}

function insertIntroMessage() {
  const introHTML = `
  <div id="intro-message">
    <h2>About this project</h2>
    <p>This assignment was completed as part of <a href="https://www.theodinproject.com/" target="blank">The Odin Project</a>. The goal was to learn how to use Javascript objects and understand how object prototype inheritance works.</p>
    <p>Use the “Add demo books” button to populate the array with demo objects. Each book can be edited and saved. Use the "New book" button to create a new entry.</p>
    <p>View the project on <a href="https://github.com/Mr-Robot-83/odin-library" target="blank">GitHub</a>.</p>
  </div>
  `;
  pageGrid.insertAdjacentHTML('afterbegin',introHTML);
}

function updateEditButtons() {
  editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach (button => {
    button.addEventListener('click', editBook);
  })
}

function updateDeleteButtons() {
  deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach (button => {
    button.addEventListener('click', deleteBook);
  })
}

function updateReadButtons() {
  readButtons = document.querySelectorAll('.read-button');
  readButtons.forEach (button => {
    button.addEventListener('click', updateReadStatus);
  })
}

function editBook(e) {
  updateBookButton.style.display = "block";
  addBookButton.style.display = "none";
  const bookIndex = e.target.getAttribute('data-book-index');
  modalHeading.textContent = `Update ${myLibrary[bookIndex].title}`;
  modal.style.display = "block";
  bookTitle.value = myLibrary[bookIndex].title;
  bookAuthor.value = myLibrary[bookIndex].author;
  bookRating.value = myLibrary[bookIndex].rating;
  bookPages.value = myLibrary[bookIndex].pages;
  bookRead.checked = myLibrary[bookIndex].read;
  bookDescription.value = myLibrary[bookIndex].description;
  updateBookButton.setAttribute('data-book-index',bookIndex);
}

function updateBook(e) {
  const bookIndex = e.target.getAttribute('data-book-index');
  myLibrary[bookIndex].title = bookTitle.value;
  myLibrary[bookIndex].author = bookAuthor.value;
  myLibrary[bookIndex].rating = parseInt(bookRating.value);
  myLibrary[bookIndex].pages = bookPages.value;
  myLibrary[bookIndex].read = bookRead.checked;
  myLibrary[bookIndex].description = bookDescription.value;
  clearModal();
  addBookForm.reset();
  displayBooks();
}

function deleteBook(e) {
  const bookIndex = e.target.getAttribute('data-book-index');
  const confirmDelete = confirm("Are you sure you want to delete " + myLibrary[bookIndex].title +"?");
  if (confirmDelete === false) return;
  myLibrary.splice(bookIndex, 1);
  displayBooks();
}

function clearModal() {
  modal.style.display = "none";
}

// The approach below was taken from a W3 schools article
// This uses onclick rather than an event listener and a callback function (which I used at the top of this script)
// This approach seems cleaner for simple functions

// When the user clicks on the button, open the modal
modalButton.onclick = function() {
  modalHeading.textContent = "Create a new book";
  updateBookButton.style.display = "none";
  addBookButton.style.display = "block";
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  clearModal();
  addBookForm.reset();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    clearModal();
    addBookForm.reset();
  }
}

//Add demo books to the array
function demoArray() {
  myLibrary.push(new Book(
    "The Great Gatsby",
    "F. Scott Fitzgerald", 
    100, 
    true,
    'The novel chronicles an era that Fitzgerald himself dubbed the "Jazz Age". Following the shock and chaos of World War I, American society enjoyed unprecedented levels of prosperity during the "roaring" 1920s as the economy soared.',
    5,
    ''
  ));
  myLibrary.push(new Book(
    "Moby Dick",
    "Herman Melville",
    120, 
    false,
    `The saga of Captain Ahab and his monomaniacal pursuit of the white whale remains a peerless adventure story but one full of mythic grandeur, poetic majesty, and symbolic power.`,
    0,
    ''
  ));
  myLibrary.push(new Book(
    "The Catcher in the Rye",
    "J. D. Salinger",
    88, 
    false,
    `Holden Caulfield, a depressed 17-year-old, lives in an unspecified institution in California after the end of World War II. After his discharge, he intends to go live with his brother with whom Holden is angry for becoming a Hollywood screenwriter."`,
    0,
    ''
  ));
  myLibrary.push(new Book(
    "Wuthering Heights",
    "Emily Brontë",
    99, 
    false,
    `The novel opens in 1801, with Mr. Lockwood arriving at Thrushcross Grange, a grand house on the Yorkshire moors that he is renting from the surly Heathcliff, who lives at nearby Wuthering Heights."`,
    0,
    ''
  ));
  myLibrary.push(new Book(
    "Alice's Adventures in Wonderland",
    "Lewis Carroll",
    56, 
    true,
    `Alice's Adventures in Wonderland by Lewis Carroll is a story about Alice who falls down a rabbit hole and lands into a fantasy world that is full of weird, wonderful people and animals.`,
    3,
    ''
  ));
  myLibrary.push(new Book(
    "To Kill a Mockingbird",
    "Harper Lee",
    210, 
    false,
    `When Tom Robinson, one of the town's Black residents, is falsely accused of raping Mayella Ewell, a white woman, Atticus agrees to defend him despite threats from the community.`,
    0,
    ''
  ));
  myLibrary.push(new Book(
    "1984",
    "George Orwell",
    336, 
    true,
    `1984 is a dystopian novella by George Orwell published in 1949, which follows the life of Winston Smith, a low ranking member of 'the Party', who is frustrated by the omnipresent eyes of the party, and its ominous ruler Big Brother.`,
    5,
    ''
  ));
  displayBooks();
};