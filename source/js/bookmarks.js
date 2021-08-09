//обрабатывает клики на закладках, переключает и закрывает
+function () {
  'use strict';
  //закрывашка для закладки
  function onBookmarkCloseClick () {
    //найходим id файла, соотв удаляемой закладке
    var fileId = $(this).closest('.bookmarks__item').attr('id').replace('bookmark-', '');
    var fileName = $(this).closest('.bookmarks__item').html();
    //пока без проверки, был ли файл изменен и запроса на сохранение
      window.util.viewAreaClose(fileId);
  };
//-------------------------------------------------------------------
  //переключатель вкладок и textarea
  function onBookmarkClick() {
    $('.bookmarks__item').removeClass('bookmarks__item--current');
    $(this).addClass('bookmarks__item--current');
    //получаем id закладки без префикса
    var fileId = $(this).attr('id').replace('bookmark-', '');
    var fileFullName = $(this).children('span').html();

    //находим среди textarea элемент с соотв id
    $('.text-area textarea').addClass('to-delete');
    $('.text-area textarea').filter('#textarea-' + fileId).removeClass('to-delete');

    window.util.noMarker();
    $('.tree__files-atom').filter('#' + fileId).addClass('tree__atom-current');

    //формируем атрибуты пунктов меню
    window.menuAccyAttrs.menuForFile(fileId, fileFullName);

    if ($(this).hasClass('bookmarks__item--changed')) {
      $('.viewing__button').removeAttr('disabled');
      $('.viewing__button').click(window.util.onSaveButtonClick);
    } else {
      $('.viewing__button').attr('disabled', 'true');
      $('.viewing__button').unbind('');
    }
  };

  window.bookmark = {
    onBookmarkCloseClick: onBookmarkCloseClick,
    onBookmarkClick: onBookmarkClick
  };
}(window.jQuery);
