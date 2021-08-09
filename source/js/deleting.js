//обработка клика на "удалить" во всплывающем окне;
//по правильному должен отправляться запрос на сервер с id удаляемого файла, поле удаления файла на сервере в браузер приходит подтверждение, и следом уходит запрос на обновление папки, содержащей этот файл. Как быть, если есть еще вложенные папки и файлы, и они были открыты - пока не знаю.
+function () {
  'use strict';
  function fileDeleting () {
    var fileId = $('.deleting-file input').val();
    var filename = $('.deleting-file__text span').html();

    //удаляем элемент в дереве
    $('#' + fileId).remove(); //!!! будет работать только при условии, что коды файлов и папок не пересекаются!!!

    window.animation.animatedMessageAppearance('Файл ' + filename + ' удален');
    //удаляем закладку
    $('#bookmark-' + fileId).children('.bookmark__close').trigger('click');
    window.menuEvents.closePopupDeletingFile();
  };

  function folderDeleting () {
    var folderId = $('.deleting-file input').val();
    var foldername = $('.deleting-file__text span').html();
  };

  window.deleting = {
    fileDeleting: fileDeleting
  };

}(window.jQuery);
