//определяет доступность пунктов главного меню в зависимости от кликов на закладках и элементах дерева и формирует их параметры в зависимости от выбранного файла или папки
+function () {
  'use strict';
  function menuForFile (fileId, fileFullName) {
    //делаем доступными пункты меню для файлов
    $('button.js-file-delete').removeAttr('disabled');
    $('button.js-rename').removeAttr('disabled');
    $('.js-file-download').attr('href', 'files/' + fileFullName);
    $('.js-file-download').removeClass('main-menu__item--disabled');
    //делаем недоступными пункты меню для папок
    $('button.js-folder-delete').attr('disabled', 'true');
    //формируем атрибуты всплывающих окон
    $('.deleting-file__text span').html(fileFullName);
    $('.deleting-file input').val(fileId);
    $('.renaming__text span').html(fileFullName);
  };

  function menuForFolder (folderId, folderName) {
    //делаем доступными пункты меню для папок
    $('button.js-rename').removeAttr('disabled');
    $('button.js-folder-delete').removeAttr('disabled');
    //делаем недоступными пункты меню для файлов
    $('.js-file-download').removeAttr('href');
    $('.js-file-download').addClass('main-menu__item--disabled');
    $('button.js-file-delete').attr('disabled', 'true');
    //формируем атрибуты всплывающих окон
    $('.deleting-folder__text span').html(folderName);
    $('.renaming__text span').html(folderName);
  };

  function menuZeroState () {
    //делаем недоступными пункты меню
    $('button.js-file-delete').prop('disabled', true);
    $('button.js-rename').prop('disabled', true);
    $('.js-file-download').removeAttr('href');
    $('.js-file-download').addClass('main-menu__item--disabled');
    $('button.js-folder-delete').attr('disabled', 'true');
    //очисщаем атрибуты всплывающих окон
    $('.deleting-file__text span').html('');
    $('.deleting-file input').val('');
    $('.renaming__text span').html('');
    $('.deleting-folder__text span').html('');
  };

  window.menuAccyAttrs = {
    menuForFile: menuForFile,
    menuForFolder: menuForFolder,
    menuZeroState: menuZeroState
  };

  }(window.jQuery);
