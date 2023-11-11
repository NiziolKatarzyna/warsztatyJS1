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
      filters: '.filters',
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
  //console.log(booksListContainer);

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
  let arrfilters = [];
  //referencj do filtra
  const filtersListContainer = document.querySelector(select.addAction.filters);
  console.log(filtersListContainer);
  function initActions() {
    //referencja do listy
    const favoriteTriggers = document.querySelectorAll(select.addAction.heart);
    //console.log('clickTriggers', favoriteTriggers);

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
    filtersListContainer.addEventListener('click', function (event) {
      //clickedElement = this;

      const filterTagName = event.target.tagName;
      const filterId = event.target.getAttribute('name');
      const filterType = event.target.getAttribute('type');
      const filterValue = event.target.getAttribute('value');
      if (
        filterTagName == 'INPUT' &&
        filterId == 'filter' &&
        filterType == 'checkbox'
      ) {
        console.log('kliknięte', filterValue);
        if (arrfilters.includes(filterValue)) {
          const filterIndex = arrfilters.indexOf(filterValue);
          if (filterIndex !== -1) {
            arrfilters.splice(filterIndex, 1);
            event.target.checked = false;
          }
        } else {
          arrfilters.push(filterValue);
          event.target.checked = true;
        }

        console.log('click', arrfilters);
      }
      //event.preventDefault();
    });
  }

  render();
  initActions();
}
