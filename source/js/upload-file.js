//открываем окно выбора файла, скачиваем файл, отображаем его содержимое
+function () {
  'use strict';

  function onUploaded () {
    var reader = new FileReader();
  	reader.onload = function(e){

      //var fileFullName = ;

      //создаем закладку с именем файла
      //скрываем bookmarks__item--zero и убираем класс current у всех элем-тов
      $('.js-bookmarks__item--zero').addClass('to-delete');
      $('.bookmarks__item').removeClass('bookmarks__item--current');
      //создаем новый без id
      var bookmarkCloseButton = '<button class="bookmark__close"></button>';
      //$('.bookmarks__list').prepend('<li class="bookmarks__item bookmarks__item--current id="bookmark-new"><span>' + fileFullName + '</span>' + bookmarkCloseButton + '</li>');

      $('.bookmarks__list').prepend('<li class="bookmarks__item bookmarks__item--current" id="bookmark-new"><span>Новый файл</span>' + bookmarkCloseButton + '</li>');

      //отображение содержимого файла
      //скрываем js-text-area--zero
      $('.text-area textarea').addClass('to-delete');
      //создаем textarea для открываемого  файла
      $('.text-area').prepend('<textarea id="textarea-new" name="name" rows="8" cols="80"></textarea>');
      $('.text-area textarea').first().val(e.target.result);

      //как повесить прослшку если нет id???
      $('#bookmark-new').children('.bookmark__close').click(window.bookmark.bookmarkClose);//прослушка для закрывашки
      $('#bookmark-new').click(window.bookmark.bookmarkToggle);//прослушка для переключения

      //делаем недоступными пункты меню
      window.menuAccyAttrs.menuZeroState();
      //можно вынести это вынсти в отдельную функцию, но надо думать как правильно передать данные
  	};
  	reader.readAsText($('#upload-file')[0].files[0], 'UTF-8');
  };

  //обрабатываем событие change после выбора файла
  $('#upload-file').change(onUploaded);

}(window.jQuery);
