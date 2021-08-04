//удаление файла / папки;
+function () {
  'use strict';
  function fileDeleting (evt) {
    console.log($('.deleting-file input').val());
    $('#' + $('.deleting-file input').val()).remove();
    window.menuEvents.closePopupDeletingFile();
    var filename = $('.deleting-file__text span').html();
    window.animation.animatedMessageAppearance('Файл ' + filename + ' удален');
  };

  window.deleting = {
    fileDeleting: fileDeleting
  };

}(window.jQuery);
