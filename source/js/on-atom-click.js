+function () {
  'use strict';
  //обработчики загрузки данных с сервера
  function onSuccessSubFolders (url, serverData) {
    //выделяем id родительской папки из url
    var parentFolderId = url.replace('../jsons/tree-', '').replace('.json', '');
    $('#' + parentFolderId).after('<ul id="sublist-' + parentFolderId + '" class="tree__sublist"></ul>');
    //запускаем цикл по массиву объектов;
    for (var i = 0; i < serverData.length; i++) {
      //проверяем: папка или файл
      if (serverData[i].hasOwnProperty('folderId')) {

        //проверяем, пустая ли папка
        if (serverData[i].empty == 'empty') {
          $('#sublist-' + parentFolderId).append('<li><p id="' + serverData[i].folderId + '" class="tree__folders-atom--empty">' + serverData[i].folderName + '</p></li>');
        } else {
          $('#sublist-' + parentFolderId).append('<li><p id="' + serverData[i].folderId + '" class="tree__folders-atom tree__folders-atom--closed">' + serverData[i].folderName + '</p></li>');
        }

      } else if (serverData[i].hasOwnProperty('fileId')) {
        $('#sublist-' + parentFolderId).append('<li><p id="' + serverData[i].fileId + '" class="tree__files-atom"><span></span>' + serverData[i].fileName + '.' + serverData[i].fileType + '</p></li>');
        var iconUrl = 'url("' + serverData[i].fileIcon + '")';
        $('#' + serverData[i].fileId + ' span').css('background-image', iconUrl);
        $('#' + serverData[i].fileId).after('<p class="tree__files-description to-delete">' + serverData[i].fileDescription + '</p>');
      } else {
        window.onError.errorMessageShow('загрузили непонятно что...');
      }
    }
    //поставить соотв обработчики событий;
    $('.tree__files-atom').click(window.onAtomClick.onFileClick);
    $('.tree__folders-atom--empty').click(window.onAtomClick.onFolderEmptyClick);
    //$('.tree__folders-atom').click(window.onAtomClick.onFolderClick);
    $('#sublist-' + parentFolderId + ' .tree__folders-atom').click(window.onAtomClick.onFolderClick);
    $('.tree__files-atom').hover(window.tooltip.tooltipShow, window.tooltip.tooltipHide);
  };

  function onErrorSubFolders () {
    window.onError.errorMessageShow('Ошибка загрузки данных о вложенных файлах и папках');
  };

  function onFolderClick () {//выполняется только для непустой папки
    //id кликнутого элемента - $(this).attr('id');
    //маркируем
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $(this).addClass('tree__atom-current');
    //делаем доступными пункты меню для папок
    $('button.js-rename').removeAttr('disabled');
    $('button.js-folder-delete').removeAttr('disabled');
    var folderName = $(this).html();
    $('.deleting__text span').html(folderName);
    $('.renaming__text span').html(folderName);
    //делаем недоступными пункты меню для файлов
    $('button.js-file-download').attr('disabled', 'true');
    $('button.js-file-download').removeAttr('href');
    $('button.js-file-delete').attr('disabled', 'true');

    //проверяем, открыта папка или нет
    if ( $(this).hasClass('tree__folders-atom--closed') ) {
      $(this).removeClass('tree__folders-atom--closed');
      $(this).addClass('tree__folders-atom--opened');
        //проверить, есть ли соседний ul с классом  tree__sublist
        if ( $('ul#sublist-' + $(this).attr('id') ).length ) {
          $('ul#sublist-' + $(this).attr('id') ).removeClass('to-delete');
        } else {
          //запрашваем данные с сервера
          var subFoldersUrl = '../jsons/tree-' + $(this).attr('id') + '.json';
          window.server.download(subFoldersUrl, onSuccessSubFolders, onErrorSubFolders);
        }
    } else {
      $(this).removeClass('tree__folders-atom--opened');
      $(this).addClass('tree__folders-atom--closed');
      //скрываем подсписок
      $('ul#sublist-' + $(this).attr('id') ).addClass('to-delete');
    }
  };

  //----------------------------------------------------------------------

  function onFileClick () {
    //маркируем строку с именем файла в дереве
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $(this).addClass('tree__atom-current');

    //проверяем: открыт файл или нет; если не открыт тогда выполняем запрос на сервер и отображение
    if ( !$(this).attr('data-opened') ) {
      $(this).attr('data-opened', 'opened');
      //вызываем функцию отображения содержимого файла
      window.fileview.fileView(this);
    } else {
      //если открыт, то переключаем вкладки
      //получаем id выбранного файла, по нему находим закладку и textarea
      var fileId = $(this).attr('id');
      $('.bookmarks__item').removeClass('bookmarks__item--current');
      $('.bookmarks__item').filter('#bookmark-' + fileId).addClass('bookmarks__item--current');

      $('.text-area textarea').addClass('to-delete');
      $('.text-area textarea').filter('#textarea-' + fileId).removeClass('to-delete');
    }
  };

  function onFolderEmptyClick () {
    //только маркируем элемент
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $(this).addClass('tree__atom-current');
  //менять значок на открытую папку или нет????
    //делаем доступными пункты меню для папок
    $('button.js-rename').removeAttr('disabled');
    $('button.js-folder-delete').removeAttr('disabled');
    //делаем недоступными пункты меню для файлов
    $('button.js-file-download').attr('disabled', 'true');
    $('button.js-file-download').removeAttr('href');
    $('button.js-file-delete').attr('disabled', 'true');

  };

  window.onAtomClick = {
    onFileClick: onFileClick,
    onFolderEmptyClick: onFolderEmptyClick,
    onFolderClick: onFolderClick
  };
}(window.jQuery);
