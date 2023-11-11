/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  ('use strict');
  const select = {
    templateOf: {
      bookList: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
    },
    addAction: {
      heart: 'a .book__image',
    },
  };
  const classNames = {
    favorite: 'favorite',
  };
  //reference to template
  const templates = {
    bookList: Handlebars.compile(
      document.querySelector(select.templateOf.bookList).innerHTML
    ),
  };

  //reference to list .books-list
  const booksListContainer = document.querySelector(
    select.containerOf.booksList
  );
  console.log(booksListContainer);

  function render() {
    for (const book of dataSource.books) {
      //generuje na podstawie klasy#
      const generateHTML = templates.bookList(book);
      // generuje na podsatawie function.js
      const generatedDOM = utils.createDOMFromHTML(generateHTML);

      // Wygenerowany element DOM dołącz jako nowe dziecko DOM do listy .books-list.
      booksListContainer.appendChild(generatedDOM);
    }
  }
  let arrFavorites = [];
  function initActions() {
    //referencja do listy
    const favoriteTriggers = document.querySelectorAll(select.addAction.heart);
    console.log('clickTriggers', favoriteTriggers);

    //dodanie listener na liste
    booksListContainer.addEventListener('dblclick', function (event) {
      //spawdzenie na co kliknięte, w tym wypadku na rodzica
      if (event.target.offsetParent.classList.contains('book__image')) {
        event.preventDefault();
        //klikniety obrazek emituje event w ty wypadku rodzica
        const clickedElement = event.target.offsetParent;
        const bookId = clickedElement.getAttribute('data-id');
        console.log('dbl');
        if (arrFavorites.includes(bookId)) {
          const bookIndex = arrFavorites.indexOf(bookId);
          if (bookIndex !== -1) {
            arrFavorites.splice(bookIndex, 1);
          }
          clickedElement.classList.remove(classNames.favorite);
        } else {
          arrFavorites.push(bookId);
          clickedElement.classList.toggle(classNames.favorite);
        }

        console.log('click', arrFavorites);
      }
    });
    /*for (let favoriteTrigger of favoriteTriggers) {
      favoriteTrigger.addEventListener('dblclick', function (event) {
        event.preventDefault();
        const clickedElement = this;
        const bookId = clickedElement.getAttribute('data-id');
        if (arrFavorites.includes(bookId)) {
          const bookIndex = arrFavorites.indexOf(bookId);
          if (bookIndex !== -1) {
            arrFavorites.splice(bookIndex, 1);
          }
          clickedElement.classList.remove(classNames.favorite);
        } else {
          arrFavorites.push(bookId);
          clickedElement.classList.toggle(classNames.favorite);
        }

        console.log('click', arrFavorites);
      });
    }*/
  }
  render();
  initActions();
}
