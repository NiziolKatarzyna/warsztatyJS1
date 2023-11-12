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
    hidden: 'hidden',
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
      const ratingBgc = determineRatingBgc(book.rating);
      const ratingWidth = determineRatingWidth(book.rating);
      //generuje na podstawie klasy#
      const generateHTML = templates.bookList({
        ...book,
        ratingBgc: ratingBgc,
        ratingWidth: ratingWidth,
      });
      // generuje na podsatawie function.js
      const generatedDOM = utils.createDOMFromHTML(generateHTML);

      // Wygenerowany element DOM dołącz jako nowe dziecko DOM do listy .books-list.
      booksListContainer.appendChild(generatedDOM);

      /*const tamplateRatting = document.querySelector(
        'style="width: {{' +
          ratingWidth +
          '}}%; background: {{' +
          ratingBgc +
          '}}"'
      );*/
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
          filterBooks();
        }

        console.log('click', arrfilters);
      }
      //event.preventDefault();
    });
  }
  function filterBooks() {
    for (const filterBook of dataSource.books) {
      let shouldBeHidden = false;
      for (const filter of arrfilters) {
        if (!filterBook.details[filter]) {
          shouldBeHidden = true;
          //break;
        }
      }
      const bookHidden = document.querySelector(
        '.book__image[data-id="' + filterBook.id + '"]'
      );
      if (shouldBeHidden) {
        bookHidden.classList.add(classNames.hidden);
        console.log('hidden', bookHidden);
      } else {
        bookHidden.classList.remove(classNames.hidden);
        console.log('hidden', bookHidden);
      }
    }
  }

  function determineRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating > 6 && rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else if (rating > 9) {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
  }
  function determineRatingWidth(rating) {
    const width = rating * 10;
    const limitedWidth = Math.min(Math.max(width, 0), 100);
    return limitedWidth;
  }

  render();
  initActions();
}
