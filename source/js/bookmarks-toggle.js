+function () {
  'use strict';
  //закрывашка для закладки
  function viewFileClose() { //удаляет закладку и область просмотра,
    //найходим id удаляемой закладки-родителя
    var bookmarkId = $(this).closest('.bookmarks__item').attr('id').replace('bookmark-', '');
    $(this).closest('.bookmarks__item').remove();

    //по id найходим textarea и удаляем его
    $('.text-area textarea').filter('#textarea-' + bookmarkId).remove();
    //по нему найходим элемент в дереве файлов и снимаем атрибут data-open
    $('.tree__files-atom').filter('#' + bookmarkId).removeAttr('data-opened');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');

    //если удаляем последнюю закладку, то восстанавливаем bookmarks__item--zero и js-text-area--zero и прочее
    if ($('.bookmarks__item').length == 1) {
      $('.js-bookmarks__item--zero').removeClass('to-delete');
      $('.js-bookmarks__item--zero').removeClass('bookmarks__item--current');
      $('.js-bookmarks__item--zero button').remove();
      //восстановливаем js-text-area--zero
      $('.js-text-area--zero').removeClass('to-delete');
      //делаем недоступными пункты меню
      $('button.js-file-delete').prop('disabled', true);
      $('button.js-rename').prop('disabled', true);
      //$('.js-file-upload').addClass('main-menu__item--disabled');
      $('.js-file-download').removeAttr('href');
      $('.js-file-download').addClass('main-menu__item--disabled');
    } else {
      //находим первую закладку в наборе и даем ей current
      $('.bookmarks__item').first().addClass('bookmarks__item--current');
      var bookmarkNewCurrId = $('.bookmarks__item').first().attr('id').replace('bookmark-', '');
      //находим первый textarea и отображаем его, правильнее находить по id!!!
      $('.text-area textarea').first().removeClass('to-delete');
      $('.tree__files-atom').filter('#' + bookmarkNewCurrId).addClass('tree__atom-current');
    }
  };

  function bookmarkClose() {
    $('.bookmark__close').click(viewFileClose);
  };
//-------------------------------------------------------------------
  //переключатель вкладок и textarea
  function viewFileToggle() {
    $('.bookmarks__item').removeClass('bookmarks__item--current');
    $(this).addClass('bookmarks__item--current');
    //получаем id закладки без префикса
    var bookmarkId = $(this).attr('id').replace('bookmark-', '');

    //находим среди textarea элемент с соотв id
    $('.text-area textarea').addClass('to-delete');
    $('.text-area textarea').filter('#textarea-' + bookmarkId).removeClass('to-delete');

    //находим среди files-tree__atom элемент с соотв id маркируем его
    $('.tree__files-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__files-atom').filter('#' + bookmarkId).addClass('tree__atom-current');
  };


  function bookmarkToggle() {
    $('.bookmarks__item').click(viewFileToggle); //?? приоритет с bookmark__close???
  };


  window.bookmark = {
    bookmarkClose: bookmarkClose,
    bookmarkToggle: bookmarkToggle
  };
}(window.jQuery);
