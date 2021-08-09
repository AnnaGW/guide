//вызывается в обработчике кликов на файлах в дереве, проверяет, открыт файл или нет, если нет, то забирает с сервера  json и отображает содержимое в окне просмотра;
//исключает повторный запрос на сервер, если файл уже открыт.

+function () {
  'use strict';

var onSuccessFile = function (url, serverData) {
  var fileFullName = serverData.fileName + '.' + serverData.fileType;

  //создаем закладку с именем файла
  //скрываем bookmarks__item--zero и убираем класс current у всех элем-тов
  $('.js-bookmarks__item--zero').addClass('to-delete');
  $('.bookmarks__item').removeClass('bookmarks__item--current');
  //создаем новый с id, который соотв файлу
  var bookmarkCloseButton = '<button class="bookmark__close"></button>';
  $('.bookmarks__list').prepend('<li class="bookmarks__item bookmarks__item--current" id="bookmark-' + serverData.fileId + '"><span>' + fileFullName + '</span>' + bookmarkCloseButton + '</li>');

  //возвращаем цвет шрифта в дереве в нормальный, он мог быть маркирован красным из-за ошибки
  $('#' + serverData.fileId).removeClass('errorFile');

  //отображение содержимого файла
  //скрываем js-text-area--zero
  $('.text-area textarea').addClass('to-delete');
  //создаем textarea для открываемого  файла
  $('.text-area').prepend('<textarea name="name" rows="8" cols="80" id="textarea-' + serverData.fileId + '"></textarea>');
  $('.text-area textarea').first().val(serverData.fileContent);

  $('#bookmark-' + serverData.fileId).children('.bookmark__close').click(window.bookmark.onBookmarkCloseClick);//прослушка для закрывашки
  $('#bookmark-' + serverData.fileId).click(window.bookmark.onBookmarkClick);//прослушка для переключения
  $('.text-area textarea').keyup(window.util.onTextareaInput); //прослушка для изменения

  //делаем доступными пункты меню для файлов
  window.menuAccyAttrs.menuForFile(serverData.fileId, fileFullName);
  //кнопку сохранить переводим в disabled
  $('.viewing__button').attr('disabled', 'true');
};

var onErrorFile = function (url, serverNoAnswer) {
  if (serverNoAnswer) {
    window.onError.errorMessageShow(serverNoAnswer);
  } else {
    window.onError.errorMessageShow('Содержимое файла не загружено');
  }
  //маркируем файл красным
  var fileId = url.replace('../jsons/', '').replace('.json', '');
  $('#' + fileId).addClass('errorFile');
  //снимаем атрибут data-opened
  $('#' + fileId).removeAttr('data-opened');
  $('.viewing__button').attr('disabled', 'true');
};

function fileView (selectedFileId) {
  //формируем адрес запроса в зависимости от выбранного файла
  var dataUrl = '../jsons/' + selectedFileId + '.json';
  //загружаем данные о файле с сервера, !!!пока статичные json-ы
  window.server.download(dataUrl, onSuccessFile, onErrorFile);
};

window.fileview = {
  fileView: fileView
};
}(window.jQuery);
