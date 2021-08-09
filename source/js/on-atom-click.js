+function () {
  'use strict';
  //обработчики загрузки вложенного спииска с сервера
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

  function onErrorSubFolders (url, serverNoAnswer) {
    if (serverNoAnswer) {
      window.onError.errorMessageShow(serverNoAnswer);
    } else {
      window.onError.errorMessageShow('Ошибка загрузки данных о вложенных файлах и папках');
    }
  };

  function onFolderClick () {//выполняется только для непустой папки
    //маркируем
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $(this).addClass('tree__atom-current');
    var folderId = $(this).attr('id');
    var folderName = $(this).html();
    //делаем доступными пункты меню для папок
    window.menuAccyAttrs.menuForFolder(folderId, folderName);

    //проверяем, открыта папка или нет
    if ( $(this).hasClass('tree__folders-atom--closed') ) {
      $(this).removeClass('tree__folders-atom--closed');
      $(this).addClass('tree__folders-atom--opened');
        //проверяем, были ли уже данные загружены = есть ли соседний ul с классом  tree__sublist
        if ( $('ul#sublist-' + folderId ).length ) {
          $('ul#sublist-' + folderId ).removeClass('to-delete');
        } else {
          //запрашваем данные с сервера
          var subFoldersUrl = '../jsons/tree-' + $(this).attr('id') + '.json';
          window.server.download(subFoldersUrl, onSuccessSubFolders, onErrorSubFolders);
        }
    } else {
      $(this).removeClass('tree__folders-atom--opened');
      $(this).addClass('tree__folders-atom--closed');
      //скрываем подсписок
      $('ul#sublist-' + folderId).addClass('to-delete');
    }
  };

  function onFolderEmptyClick () {
    //только маркируем элемент
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $(this).addClass('tree__atom-current');
    var folderId = $(this).attr('id');
    var folderName = $(this).html();
//менять значок на открытую папку или нет????
    //делаем доступными пункты меню для папок
    window.menuAccyAttrs.menuForFolder(folderId, folderName);
  };

  function onFileClick () {
    //маркируем строку с именем файла в дереве
    window.util.noMarker();
    $(this).addClass('tree__atom-current');
    var fileId = $(this).attr('id');
    var fileName = $(this).html();

    //проверяем: открыт файл или нет;
    if ( !$(this).attr('data-opened') ) {
      $(this).attr('data-opened', 'opened');
      //если нет, вызываем функцию отображения содержимого файла
      window.fileview.fileView(this.id);
    } else {
      //если открыт, то переключаем вкладки
      //находим закладку соотв файлу в дереве и отдаем ее в
      $('.bookmarks__item').filter('#bookmark-' + fileId).trigger('click');
    }
  };

  window.onAtomClick = {
    onFileClick: onFileClick,
    onFolderEmptyClick: onFolderEmptyClick,
    onFolderClick: onFolderClick
  };
}(window.jQuery);
