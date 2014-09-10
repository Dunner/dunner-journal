'use strict';

/**
 * @ngdoc directive
 * @name Dunner.directive:ngJournal
 * @description
 * # ngBook
 */
angular.module('dunner.journal', [])
  .directive('dnrJournal', function () {
    return {
      restrict: 'EA',
      replace: 'true',
      transclude: 'true',
      compile: function (tElem, tAttrs) {
        var pages = tElem.children();
        var tabpages = 0;
        for (var i = 0; i < pages.length; i++) {
          var page = angular.element(pages[i]);

          if (i % 2) {
            page.addClass('backside');
            page.attr('ng-click', 'pageFlip(0)');
          }else{
            page.attr('ng-click', 'pageFlip(1)');
          }

          if (i <= 1 || i >= pages.length-2) {
            page.addClass('bookcover');
          }else{
            page.addClass('bookpage');
          }

          //Initial styling
          if (i <= 1 || i >= pages.length-2) {}else{
            var tabWidth = tAttrs.tabwidth || 0;
            var tabHeight = tAttrs.tabheight || 0;
            var width = pages[i].offsetWidth + i ;
            var margin = (width*+('0.'+tabWidth)) + 20;
            page.css({
              'width': width-margin + 'px',
              'margin-right': margin - i + 'px'
            });
            var pageTab = angular.element(page[0].children[0]);
            if (pageTab[0].className === 'tab') {
              var tabTop = parseInt(tabHeight)+tabHeight*tabpages;
              console.log(tabTop);
              pageTab.css({
                'top': tabTop + '%',
                'right': -tabWidth + '%',
                'width': tabWidth + '%',
                'height': parseInt(tabHeight)+1 + '%'
              });
              pageTab.attr('ng-click', 'pageSkip('+i+')');
              tabpages++;
            }
          }
          page.css({'z-index': pages.length - i});
          page.attr('id', 'page-'+i+'');

        }
        return function(scope) { //Link

          var currentPage = 0;
          var browseBackward = function() {
            var previous = angular.element(pages[currentPage-1]),
                previous2 = angular.element(pages[currentPage-2]);

            previous.removeClass('flipped');
            setTimeout(function() {
              previous.css({'z-index': pages.length - currentPage});
            },200);
            previous2.removeClass('flipped');
            setTimeout(function() {
              previous2.css({'z-index': pages.length - (currentPage-1)});
            },200);
            currentPage = currentPage-2;
          };

          var browseForward = function() {
            var page = angular.element(pages[currentPage]),
                next = angular.element(pages[currentPage+1]);

            page.addClass('flipped');
            setTimeout(function() {
              page.css({'z-index':currentPage});
            },200);
            next.addClass('flipped');
            setTimeout(function() {
              next.css({'z-index':currentPage+1});
            },200);
            currentPage = currentPage+2;
          };

          scope.pageFlip = function(dir) {
            if (dir === 0 && currentPage !== 0)            {browseBackward();}
            if (dir === 1 && currentPage !== pages.length) {browseForward();}
          };

          scope.pageSkip = function(to) {
            var c = currentPage;
            console.log(to);
            if (to !== currentPage) {
              if (to > currentPage) {
                var forward = setInterval(function() {
                  if(c > to-4) {clearInterval(forward);}else{c=c+2; browseForward();}
                }, 250);
              }
              if (to < currentPage) {
                var backward = setInterval(function() {
                  if(c < to) {clearInterval(backward);}else{c=c-2; browseBackward();}
                }, 250);
              }
            }
          };

        };
      },
      templateUrl: function(elem,attrs) {
        // Feeds the book from path
        return attrs.bookurl || 'views/books/default.html';
      }
    };
  });
