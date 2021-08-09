//открываем окно выбора файла, скачиваем файл, отображаем его содержимое
+function () {
  'use strict';

  function onUploaded () {
    var uploadedFile = $(this)[0].files[0];
    var uploadedFileName = uploadedFile.name;

    var reader = new FileReader();
    reader.readAsText(uploadedFile);
    reader.onload = function(evt) {
      $('.js-bookmarks__item--zero').addClass('to-delete');
      $('.bookmarks__item').removeClass('bookmarks__item--current');
      var bookmarkCloseButton = '<button class="bookmark__close"></button>';
      $('.bookmarks__list').prepend('<li class="bookmarks__item bookmarks__item--current" id="bookmark-new"><span>' + uploadedFileName + '</span>' + bookmarkCloseButton + '</li>');
      //отображение содержимого файла
      $('.text-area textarea').addClass('to-delete');
      //создаем textarea для открываемого  файла
      $('.text-area').prepend('<textarea id="textarea-new" name="name" rows="8" cols="80"></textarea>');
      $('.text-area textarea').first().val(evt.target.result);
      //прослушки
      $('#bookmark-new').children('.bookmark__close').click(window.bookmark.onBookmarkCloseClick);//прослушка для закрывашки
      $('#bookmark-new').click(window.bookmark.onBookmarkClick);//прослушка для переключения
      $('.text-area textarea').keyup(window.util.onTextareaInput); //прослушка для изменения
    };
  };

  //обрабатываем событие change после выбора файла
  $('#upload-file').change(onUploaded);

}(window.jQuery);
