//обрабатывает клики на файлах в дереве, проверяет, открыт файл или нет, если нет, то забирает с сервера  json и отображает содержимое в окне просмотра; исключает повторный запрос на сервер, если файл уже открыт.
//Делает доступными пункты меню для работы с файлами, формирует их атрибуты в зависимости от выбранного файла

+function () {
  'use strict';

var onSuccessFile = function (url, serverData) {
  //создаем закладку с именем файла
  //формируем содержимое закладки
  var fileFullName = serverData.fileName + '.' + serverData.fileType;
  //скрываем bookmarks__item--zero и убираем класс current у всех элем-тов
  $('.js-bookmarks__item--zero').addClass('to-delete');
  $('.bookmarks__item').removeClass('bookmarks__item--current');
  //создаем новый  с id, который соотв файлу
  var bookmarkCloseButton = '<button class="bookmark__close"></button>';
  $('.bookmarks__list').prepend('<li class="bookmarks__item bookmarks__item--current" id="bookmark-' + serverData.fileId + '"><span>' + fileFullName + '</span>' + bookmarkCloseButton + '</li>');
  //$('.bookmarks__item span').after('<button class="bookmark__close"></button>');
  window.bookmark.bookmarkClose();//прослушка для закрывашки

  //отображение содержимого файла
  //скрываем js-text-area--zero
  $('.text-area textarea').addClass('to-delete');
  //создаем textarea для открываемого  файла
  $('.text-area').prepend('<textarea name="name" rows="8" cols="80" id="textarea-' + serverData.fileId + '"></textarea>');
  $('.text-area textarea').first().val(serverData.fileContent);
  window.bookmark.bookmarkToggle();//прослушка для переключения

  //делаем доступными пункты меню для файлов
  $('button.js-file-delete').removeAttr('disabled');
  $('button.js-rename').removeAttr('disabled');
  $('.js-file-download').removeClass('main-menu__item--disabled');
  //делаем недоступными пункты меню для папок
  $('button.js-folder-delete').attr('disabled', 'true');

  //формируем атрибуты пунктов меню
  $('.deleting__text span').html(fileFullName);
  $('.renaming__text span').html(fileFullName);
  $('.main-menu__download').attr('href', 'files/' + fileFullName);
};

var onErrorFile = function () {
  window.onError.errorMessageShow('Содержимое файла не загружено');
};

function fileView (selectedFile) {
  //формируем адрес запроса в зависимости от выбранного файла
  var dataUrl = '../jsons/' + selectedFile.id + '.json';
  //загружаем данные о файле с сервера, !!!пока статичные json-ы
  window.server.download(dataUrl, onSuccessFile, onErrorFile);
};

window.fileview = {
  fileView: fileView
};
}(window.jQuery);
