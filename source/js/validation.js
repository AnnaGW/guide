//валидация значений во всплывающих окнах; для имен файлов и папок
+function () {
  'use strict';
  function fileNameValidation (name) {
    //исключаем кириллицу
    var onlyLetters =  /[А-Яа-я]/;
    if (onlyLetters.test(name)) {
      return false;
    } else {
      return true;
    }
  };

  function folderNameValidation (name) {
    //исключаем кириллицу
    var onlyLetters = /[А-Яа-я]/;
    if (onlyLetters.test(name)) {
      return false;
    } else {
      return true;
    }
  };

  window.validation = {
    fileNameValidation: fileNameValidation,
    folderNameValidation: folderNameValidation
  };

}(window.jQuery);
