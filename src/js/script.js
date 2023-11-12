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

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElement();
      thisBooksList.render();
      thisBooksList.initActions();
    }

    initData() {
      this.data = dataSource.books;
    }

    getElement() {
      const thisBooksList = this;
      thisBooksList.arrFavorites = [];
      thisBooksList.arrfilters = [];

      //reference to list .books-list
      thisBooksList.Container = document.querySelector(
        select.containerOf.booksList
      );
      thisBooksList.booksListContainer = document.querySelector(
        select.containerOf.booksList
      );
      //referencj do filtra
      thisBooksList.filtersListContainer = document.querySelector(
        select.addAction.filters
      );
      console.log(thisBooksList.filtersListContainer);

      //referencja do listy
      thisBooksList.favoriteTriggers = document.querySelectorAll(
        select.addAction.heart
      );
      //console.log('clickTriggers', favoriteTriggers);
    }

    //console.log(booksListContainer);

    render() {
      const thisBooksList = this;
      for (const book of this.data) {
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = thisBooksList.determineRatingWidth(book.rating);
        //generuje na podstawie klasy#
        const generateHTML = templates.bookList({
          ...book,
          ratingBgc: ratingBgc,
          ratingWidth: ratingWidth,
        });
        // generuje na podsatawie function.js
        const generatedDOM = utils.createDOMFromHTML(generateHTML);

        // Wygenerowany element DOM dołącz jako nowe dziecko DOM do listy .books-list.
        thisBooksList.Container.appendChild(generatedDOM);
      }
    }

    initActions() {
      const thisBooksList = this;

      //dodanie listener na liste
      thisBooksList.booksListContainer.addEventListener(
        'dblclick',
        function (event) {
          //spawdzenie na co kliknięte, w tym wypadku na rodzica
          if (event.target.offsetParent.classList.contains('book__image')) {
            event.preventDefault();
            //klikniety obrazek emituje event w ty wypadku rodzica
            const clickedElement = event.target.offsetParent;
            const bookId = clickedElement.getAttribute('data-id');
            console.log('dbl');
            if (thisBooksList.arrFavorites.includes(bookId)) {
              const bookIndex = thisBooksList.arrFavorites.indexOf(bookId);
              if (bookIndex !== -1) {
                thisBooksList.arrFavorites.splice(bookIndex, 1);
              }
              clickedElement.classList.remove(classNames.favorite);
            } else {
              thisBooksList.arrFavorites.push(bookId);
              clickedElement.classList.toggle(classNames.favorite);
            }
            console.log('click', thisBooksList.arrFavorites);
          }
        }
      );
      thisBooksList.filtersListContainer.addEventListener(
        'click',
        function (event) {
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
            if (thisBooksList.arrfilters.includes(filterValue)) {
              const filterIndex = thisBooksList.arrfilters.indexOf(filterValue);
              if (filterIndex !== -1) {
                thisBooksList.arrfilters.splice(filterIndex, 1);
                event.target.checked = false;
                thisBooksList.filterBooks();
              }
            } else {
              thisBooksList.arrfilters.push(filterValue);
              event.target.checked = true;
              thisBooksList.filterBooks();
            }

            console.log('click', thisBooksList.arrfilters);
          }
          //event.preventDefault();
        }
      );
    }
    filterBooks() {
      const thisBooksList = this;
      for (const filterBook of this.data) {
        let shouldBeHidden = false;
        for (const filter of thisBooksList.arrfilters) {
          if (!filterBook.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }
        thisBooksList.bookHidden = document.querySelector(
          '.book__image[data-id="' + filterBook.id + '"]'
        );

        if (shouldBeHidden) {
          thisBooksList.bookHidden.classList.add(classNames.hidden);
          console.log('hidden', thisBooksList.bookHidden);
        } else {
          thisBooksList.bookHidden.classList.remove(classNames.hidden);
          console.log('hidden', thisBooksList.bookHidden);
        }
      }
    }

    determineRatingBgc(rating) {
      const thisBooksList = this;
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
    determineRatingWidth(rating) {
      const thisBooksList = this;
      const width = rating * 10;
      const limitedWidth = Math.min(Math.max(width, 0), 100);
      return limitedWidth;
    }
  }

  const app = new BooksList();
}
