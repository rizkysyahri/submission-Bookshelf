const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExits() {
  if (typeof Storage === "undefined") {
    alert("browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}

function generateBookObject(id, title, author, year, image, isComplete) {
  const yearAsInt = parseInt(year, 10);

  return {
    id,
    title,
    author,
    year: yearAsInt,
    image,
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItems of books) {
    if (bookItems.id === bookId) {
      return bookItems;
    }
  }
  return null;
}

function findIndexBook(bookId) {
  for (const i in books) {
    if (books[i].id === bookId) {
      return i;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExits()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, title, author, year, image, isComplete } = bookObject;

  const imageBook = document.createElement("img");
  imageBook.setAttribute("src", `${image}`);

  const bookCover = document.createElement("div");
  bookCover.classList.add("book-cover");
  bookCover.append(imageBook);

  const bookTitle = document.createElement("span");
  bookTitle.classList.add("book-title");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("span");
  bookAuthor.classList.add("book-author");
  bookAuthor.innerHTML = author;

  const bookYear = document.createElement("div");
  bookYear.classList.add("book-year");
  bookYear.innerText = year;

  const bookDetailChoose = document.createElement("div");
  bookDetailChoose.classList.add("book-detail-choose");
  bookDetailChoose.append(bookTitle, bookAuthor, bookYear);

  const trashIcon = document.createElement("div");
  trashIcon.classList.add("fa", "fa-trash");

  const checkListIcon = document.createElement("div");
  checkListIcon.classList.add("fa", "fa-check");

  const doubleChecklistIcon = document.createElement("div");
  doubleChecklistIcon.classList.add("fa", "fa-book-open-reader");

  const bookCard = document.createElement("div");
  bookCard.classList.add("book", "shadow");
  bookCard.append(bookCover, bookDetailChoose);
  bookCard.setAttribute("id", `book-${id}`);

  if (isComplete) {
    const buttonDoubleChecklist = document.createElement("button");
    buttonDoubleChecklist.setAttribute("id", `checklist`);
    buttonDoubleChecklist.append(doubleChecklistIcon);
    buttonDoubleChecklist.addEventListener("click", () => {
      undoBookCompleted(id);
    });

    const deleteIcon = document.createElement("button");
    deleteIcon.setAttribute("id", `delete`);
    deleteIcon.append(trashIcon);
    deleteIcon.addEventListener("click", () => {
      removeBook(id);
    });

    const actionButton = document.createElement("div");
    actionButton.classList.add("action-button");
    actionButton.append(buttonDoubleChecklist, deleteIcon);

    bookCard.append(actionButton);
  } else {
    const checkIcon = document.createElement("button");
    checkIcon.setAttribute("id", `checklist`);
    checkIcon.append(checkListIcon);
    checkIcon.addEventListener("click", () => {
      addBookToCompleted(id);
    });

    const deleteIcon = document.createElement("button");
    deleteIcon.setAttribute("id", `delete`);
    deleteIcon.append(trashIcon);
    deleteIcon.addEventListener("click", () => {
      removeBook(id);
    });

    const actionButton = document.createElement("div");
    actionButton.classList.add("action-button");
    actionButton.append(checkIcon, deleteIcon);

    bookCard.append(actionButton);
  }

  return bookCard;
}

//

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("formIsInputBook");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const isTitle = document.getElementById("inputIsTitle").value;
    const isAuthor = document.getElementById("inputIsAuthor").value;
    const isYear = document.getElementById("inputIsYear").value;
    const isLinkCover = document.getElementById("inputIsLinkCover").value;
    const isBookComplete = document.getElementById(
      "inputIsBookComplete"
    ).checked;

    const isNewBook = {
      id: +new Date(),
      title: isTitle,
      author: isAuthor,
      year: isYear,
      image: isLinkCover,
      isComplete: isBookComplete,
    };

    const bookObject = generateBookObject(
      isNewBook.id,
      isNewBook.title,
      isNewBook.author,
      isNewBook.year,
      isNewBook.image,
      isNewBook.isComplete
    );
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  });

  if (isStorageExits()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Saved successful data");
});

searchButton.addEventListener("click", (e) => {
  e.preventDefault();

  const searchResults = document.querySelector("#search>.booksCard");

  searchResults.innerHTML = "";

  for (const booksItems of books) {
    {
      if (booksItems.isComplete === true) {
        const imageBook = document.createElement("img");
        imageBook.setAttribute("src", `${booksItems.image}`);

        const coverBook = document.createElement("div");
        coverBook.classList.add("book-cover");
        coverBook.append(imageBook);

        const titleBook = document.createElement("span");
        titleBook.classList.add("book-title");
        titleBook.innerText = booksItems.title;

        const authorbook = document.createElement("p");
        authorbook.classList.add("author-book");
        authorbook.innerHTML = booksItems.author;

        const statusBook = document.createElement("div");
        statusBook.classList.add("status", "inComplete");
        statusBook.innerText = "Selesai dibaca";

        const allBookDetails = document.createElement("div");
        allBookDetails.append(titleBook, authorbook, statusBook);

        const trashIcon = document.createElement("div");
        trashIcon.classList.add("fa", "fa-trash");

        const doubleChecklistIcon = document.createElement("div");
        doubleChecklistIcon.classList.add("fa", "fa-book-open-reader");

        const buttonDoubleChecklist = document.createElement("button");
        buttonDoubleChecklist.setAttribute("id", `checklist`);
        buttonDoubleChecklist.append(doubleChecklistIcon);
        buttonDoubleChecklist.addEventListener("click", () => {
          undoBookCompleted(booksItems.id);
        });

        const deleteIcon = document.createElement("button");
        deleteIcon.setAttribute("id", `delete`);
        deleteIcon.append(trashIcon);
        deleteIcon.addEventListener("click", () => {
          removeBook(booksItems.id);
        });

        const actionButton = document.createElement("div");
        actionButton.classList.add("action-button");
        actionButton.append(buttonDoubleChecklist, deleteIcon);

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-search", "shadow-search");
        bookCard.append(coverBook, allBookDetails, actionButton);

        searchResults.append(bookCard);
      } else {
        const imageBook = document.createElement("img");
        imageBook.setAttribute("src", `${booksItems.image}`);

        const coverBook = document.createElement("div");
        coverBook.classList.add("book-cover");
        coverBook.append(imageBook);

        const titleBook = document.createElement("span");
        titleBook.classList.add("book-title");
        titleBook.innerText = booksItems.title;

        const authorbook = document.createElement("p");
        authorbook.classList.add("author-book");
        authorbook.innerHTML = booksItems.author;

        const statusBook = document.createElement("div");
        statusBook.classList.add("status", "Complete");
        statusBook.innerText = "Belum selesai dibaca";

        const allBookDetails = document.createElement("div");
        allBookDetails.append(titleBook, authorbook, statusBook);

        const checkListIcon = document.createElement("div");
        checkListIcon.classList.add("fa", "fa-check");

        const checkIcon = document.createElement("button");
        checkIcon.setAttribute("id", `checklist`);
        checkIcon.append(checkListIcon);
        checkIcon.addEventListener("click", () => {
          addBookToCompleted(booksItems.id);
        });

        const actionButton = document.createElement("div");
        actionButton.classList.add("action-button");
        actionButton.append(checkIcon);

        const bookCard = document.createElement("div");
        bookCard.classList.add("book-search", "shadow-search");
        bookCard.append(coverBook, allBookDetails, actionButton);

        searchResults.append(bookCard);
      }
    }
  }
});

function removeBook(bookId) {
  const bookTarget = findIndexBook(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

let submitButton = document.getElementById("buttonSubmit");
let originalInnerText = submitButton.innerText;

function changeInnerText() {
  const inputIsBookComplete = document.getElementById("inputIsBookComplete");

  if (inputIsBookComplete.checked) {
    submitButton.innerText = "Selamat membaca";
  } else {
    submitButton.innerText = "Belum selesai dibaca";
  }

  setTimeout(function () {
    submitButton.innerText = originalInnerText;
  }, 1000);
}

document.addEventListener(RENDER_EVENT, () => {
  // console.log(books);

  const unCompletedBooksList = document.getElementById("unIsCompletedBook");
  const inCompletedBooksList = document.getElementById("isCompletedBook");

  unCompletedBooksList.innerHTML = "";
  inCompletedBooksList.innerHTML = "";

  for (const bookItems of books) {
    const bookElement = makeBook(bookItems);

    if (bookItems.isComplete === true) {
      inCompletedBooksList.append(bookElement);
    } else {
      unCompletedBooksList.append(bookElement);
    }
  }
});
