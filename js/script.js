//показывает анимированное всплывающее сообщение
+function () {
  'use strict';
  function removeAnimeClass () {
    $('.animated-message__popup').removeClass('animated-message__popup--animation');
  };
  function animatedMessageAppearance (text) {
    $('.animated-message__text').html(text);
    $('.animated-message__popup').addClass('animated-message__popup--animation');
    //обязательно снимать класс animated-message__popup--animation, иначе в след раз анимация не запустится
    setTimeout(removeAnimeClass, 6500);
  };

  window.animation = {
    animatedMessageAppearance: animatedMessageAppearance
  };

}(window.jQuery);

//обрабатывает клики на закладках, переключает и закрывает
+function () {
  'use strict';
  //закрывашка для закладки
  function onBookmarkCloseClick () {
    //найходим id файла, соотв удаляемой закладке
    var fileId = $(this).closest('.bookmarks__item').attr('id').replace('bookmark-', '');
    var fileName = $(this).closest('.bookmarks__item').html();

    //проверяем, был ли файл изменен
    if ($(this).closest('.bookmarks__item').hasClass('bookmarks__item--changed')) {
      window.util.doYouWantToSave (fileId, fileName);
    } else {
      window.util.viewAreaClose(fileId);
    }
  };
//-------------------------------------------------------------------
  //переключатель вкладок и textarea
  function onBookmarkClick() {
    $('.bookmarks__item').removeClass('bookmarks__item--current');
    $(this).addClass('bookmarks__item--current');
    //получаем id закладки без префикса
    var fileId = $(this).attr('id').replace('bookmark-', '');
    var fileFullName = $(this).children('span').html();

    //находим среди textarea элемент с соотв id
    $('.text-area textarea').addClass('to-delete');
    $('.text-area textarea').filter('#textarea-' + fileId).removeClass('to-delete');

    window.util.noMarker();
    $('.tree__files-atom').filter('#' + fileId).addClass('tree__atom-current');

    //формируем атрибуты пунктов меню
    window.menuAccyAttrs.menuForFile(fileId, fileFullName);

    if ($(this).hasClass('bookmarks__item--changed')) {
      $('.viewing__button').removeAttr('disabled');
      //$('.viewing__button').click(window.util.onSaveButtonClick);
    } else {
      $('.viewing__button').attr('disabled', 'true');
      $('.viewing__button').unbind('');
    }
  };

  window.bookmark = {
    onBookmarkCloseClick: onBookmarkCloseClick,
    onBookmarkClick: onBookmarkClick
  };
}(window.jQuery);

'use strict';

(function () {


})();

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
  //прослушки
  $('#bookmark-' + serverData.fileId).children('.bookmark__close').click(window.bookmark.onBookmarkCloseClick);//прослушка для закрывашки
  $('#bookmark-' + serverData.fileId).click(window.bookmark.onBookmarkClick);//прослушка для переключения
  $('#textarea-' + serverData.fileId).one('input', window.util.onTextareaInput); //прослушка для изменения

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
  var fileId = url.replace('https://annagw.github.io/guide/jsons/', '').replace('.json', '');
  $('#' + fileId).addClass('errorFile');
  //снимаем атрибут data-opened
  $('#' + fileId).removeAttr('data-opened');
  $('.viewing__button').attr('disabled', 'true');
};

function fileView (selectedFileId) {
  //формируем адрес запроса в зависимости от выбранного файла
  var dataUrl = 'https://annagw.github.io/guide/jsons/' + selectedFileId + '.json';
  //загружаем данные о файле с сервера, !!!пока статичные json-ы
  window.server.download(dataUrl, onSuccessFile, onErrorFile);
};

window.fileview = {
  fileView: fileView
};
}(window.jQuery);

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

//обрабатываем нажатия на пункты меню, открываем всплывающие окна
+function () {
  'use strict';

function closePopupDeletingFile () {
  $('.deleting-file').addClass('to-delete');
  $('.js-deleting-file__popup-button').unbind();
  $('.js-deleting-file__popup-close').unbind();
};

function openPopupDeletingFile () {
  $('.deleting-file').removeClass('to-delete');
  $('.js-deleting-file__popup-button').click(window.deleting.fileDeleting);
  $('.js-deleting-file__popup-close').click(closePopupDeletingFile);
  $('body').keydown(function(evt){
    if(evt.key === "Escape") {
      closePopupDeletingFile();
    }
  });
};

//----------------------------------------------------------

function closePopupDeletingFolder () {
  $('.deleting-folder').addClass('to-delete');
  $('.js-deleting-folder__popup-button').unbind();
  $('.js-deleting-folder__popup-close').unbind();
};

function openPopupDeletingFolder () {
  $('.deleting-folder').removeClass('to-delete');
  $('.js-deleting-folder__popup-button').click(closePopupDeletingFolder);
  $('.js-deleting-folder__popup-close').click(closePopupDeletingFolder);
  $('body').keydown(function(evt){
    if(evt.key === "Escape") {
      closePopupDeletingFolder();
    }
  });
};

//----------------------------------------------------------

function closePopupRenaming () {
  $('.renaming').addClass('to-delete');
  //очистка поля с именем файла/папки
  $('.js-renaming__validation-message').addClass('to-delete');//убрали возможное сообщение об ошибке валидации
  $('.js-renaming__popup-button').attr('disabled', 'true');//поставили disabled
  $('.js-renaming__popup-input').val('');
  $('.js-renaming__popup-close').unbind();
  $('.js-renaming__popup-input').unbind();
};

function openPopupRenaming () {
  $('.renaming').removeClass('to-delete');
  $('.js-renaming__popup-close').click(closePopupRenaming);
  $('body').keydown(function(evt){
    if(evt.key === "Escape") {
      closePopupRenaming();
    }
  });
  $('.js-renaming__popup-input').on('input',function() {
    $('.js-renaming__popup-button').removeAttr('disabled');//убрали disabled
    $('.js-renaming__validation-message').addClass('to-delete');//убрали возможное сообщение об ошибке валидации
    if ($(this).val() === '') {
      $('.js-renaming__popup-button').attr('disabled', 'true');//поставили disabled
    }
  });
  $('.js-renaming__popup-input').on('change',function() {
    var value = $(this).val();//получили значение input
    if (window.validation.fileNameValidation(value) ) {
      //отправка формы, пока просто закрываем
      closePopupRenaming();
    } else {
      //вывод сообщения об ошибке
      $('.js-renaming__validation-message').html('имя должно быть на латинице');
      $('.js-renaming__validation-message').removeClass('to-delete');
    }
  });
};

//---------------------------------------------------------------

function closePopupCreation () {
  $('.creation').addClass('to-delete');
  $('.js-validation-message').addClass('to-delete');//убрали возможное сообщение об ошибке валидации
  $('.js-popup-button-create').attr('disabled', 'true');//поставили disabled
  $('.js-popup-input-create').val('');
  $('.js-popup-close-creation').unbind('click', closePopupCreation);
};

function openPopupCreation () {
  $('.creation').removeClass('to-delete');
  $('.js-popup-close-creation').click(closePopupCreation);
  $('body').keydown(function(evt){
    if(evt.key === "Escape") {
      closePopupCreation();
    }
  });
  $('.js-popup-input-create').on('input',function() {
    $('.js-popup-button-create').removeAttr('disabled');//убрали disabled
    $('.js-validation-message').addClass('to-delete');//убрали возможное сообщение об ошибке валидации
    if ($(this).val() === '') {
      $('.js-popup-button-create').attr('disabled', 'true');//поставили disabled
    }
  });
  $('.js-popup-input-create').on('change',function() {
    var value = $(this).val();//получили значение input
    if (window.validation.folderNameValidation(value) ) {
      //отправка формы, пока просто закрываем
      closePopupCreation();
    } else {
      //вывод сообщения об ошибке
      $('.js-validation-message').html('не правильно, пишите на латинице');
      $('.js-validation-message').removeClass('to-delete');
    }
  });
};

//----------------------------------------------------

$('.js-folder-create').click(openPopupCreation);
$('.js-folder-delete').click(openPopupDeletingFolder);
$('.js-file-delete').click(openPopupDeletingFile);
$('.js-rename').click(openPopupRenaming);


window.menuEvents = {
  closePopupDeletingFile: closePopupDeletingFile
};

}(window.jQuery);

+function () {
  'use strict';


}(window.jQuery);

+function () {
  'use strict';
  //обработчики загрузки вложенного спииска с сервера
  function onSuccessSubFolders (url, serverData) {
    //выделяем id родительской папки из url
    var parentFolderId = url.replace('https://annagw.github.io/guide/jsons/tree-', '').replace('.json', '');
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
          var subFoldersUrl = 'https://annagw.github.io/guide/jsons/tree-' + $(this).attr('id') + '.json';
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

+function () {
  'use strict';

  function errorMessageShow (textMessage) {
    $('.message').removeClass('to-delete');
    $('.message__dynamic-text').html(textMessage);
    $('.js-popup-button-message').click(function () {
      $('.message__dynamic-text').html('');
      $('.message').addClass('to-delete');
    });
  };
  window.onError = {
    errorMessageShow: errorMessageShow
  };
}(window.jQuery);

'use strict';

(function () {
  var download = function (urlGet, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json'; // !!!
    xhr.open('GET', urlGet);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        //console.log('xhr.status' + xhr.status);
        onSuccess(urlGet, xhr.response);
      } else {
        //onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        onError(urlGet, '');
      }
    });
    xhr.addEventListener('error', function () {
      onError(urlGet, 'Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError(urlGet, 'Запрос не успел выполниться за ' + xhr.timeout / 1000 + 'с');
    });
    xhr.timeout = 4000;

    xhr.send();
  };

  var upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess();
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError();
    });
    xhr.addEventListener('timeout', function () {
      onError();
    });
    xhr.timeout = 4000;

    xhr.open('POST', window.consts.URL_POST);
    xhr.send(data);
  };

  window.server = {
    download: download,
    upload: upload
  };
})();

//открывает всплывающие подсказки к файлам
+function () {
  'use strict';

  function tooltipShow(evt) {
    //позиционируем: получаем координаты мыши внутри files-tree__atom, задаем значения top и left для подсказки
    var coordX = evt.pageX - $(this).offset().left;
    var coordY = evt.pageY - $(this).offset().top;
    $(this).next().css({'top': coordY, 'left': coordX});
    $(this).next().removeClass('to-delete');

    //перемещаем подсказку при движении мыши в пределах элемента
    function tooltipMove (evt) {
      var coordX = evt.pageX - $(this).offset().left;
      var coordY = evt.pageY - $(this).offset().top;
      $(this).next().css({'top': coordY, 'left': coordX});
    };
    $('.tree__files-atom').mousemove(tooltipMove);
  };

  function tooltipHide() {
    $(this).next().addClass('to-delete');
  };

  //$('.tree__files-atom').hover(tooltipShow, tooltipHide);

  window.tooltip = {
    tooltipShow: tooltipShow,
    tooltipHide: tooltipHide
  };

}(window.jQuery);

//построение списка папок первого уровня; допущение: файлов нет;
+function () {
  'use strict';

  function onSuccessFirstFolders (url, serverData) {
    for (var i = 0; i < serverData.length; i++) {
      //проверяeм на основе данных из БД по свойству empty: пустая папка или нет; даем соотв-й класс(ы)
      if (serverData[i].empty == 'empty') {
        $('.tree__list').append('<li><p id="' + serverData[i].folderID + '" class="tree__folders-atom--empty">' + serverData[i].folderName + '</p></li>');
      } else {
        $('.tree__list').append('<li><p id="' + serverData[i].folderID + '" class="tree__folders-atom tree__folders-atom--closed">' + serverData[i].folderName + '</p></li>');
      }
    }
    $('.tree__folders-atom').click(window.onAtomClick.onFolderClick);
    $('.tree__folders-atom--empty').click(window.onAtomClick.onFolderEmptyClick);
  };

  function onErrorFirstFolders (url, serverNoAnswer) {
    if (serverNoAnswer) {
      window.onError.errorMessageShow(serverNoAnswer);
    } else {
      window.onError.errorMessageShow('Ошибка загрузки данных о папках первого уровня');
    }
  };

  $(window).load(function () {
    var treeUrl = 'https://annagw.github.io/guide/jsons/tree0.json';
    window.server.download(treeUrl, onSuccessFirstFolders, onErrorFirstFolders);
  });

}(window.jQuery);

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

//утилитарные функции для всякого
+function () {
  'use strict';

  //сбрасывает маркеры со всех элементов дерева
  function noMarker () {
    $('.tree__files-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
  };

  function onTextareaInput () {
    //получить id из this
    var id = $(this).attr('id').replace('textarea-', '');
    //по id найти соотв закладку и дать ей класс --changed
    $('.bookmarks__item').filter('#bookmark-' + id).addClass('bookmarks__item--changed');
    //снять disabled с кнопки
    $('.viewing__button').removeAttr('disabled');
    $('.viewing__button').click(window.util.onSaveButtonClick);
  };

  function onSaveButtonClick () {
    var fileName = $('.bookmarks__item').filter('.bookmarks__item--current').children('span').html();
    var fileId = $('.bookmarks__item').filter('.bookmarks__item--current').attr('id').replace('bookmark-', '');
    $('.bookmarks__item').filter('.bookmarks__item--current').removeClass('bookmarks__item--changed');
    $('.viewing__button').attr('disabled', 'true');
    $('.viewing__button').unbind('');
    window.animation.animatedMessageAppearance ('файл ' + fileName + ' сохранен');
  };

  function doYouWantToSave (fileId, fileName) {
    $('.message-tosave__text-1').html('Файл ' + fileName + ' был изменен.');
    $('.message-tosave__text-2').html('Сохранить изменения?');
    $('.message-tosave').removeClass('to-delete');
    $('.js-tosave-button-esc').click(function () {
      $('.message-tosave').addClass('to-delete');
      console.log('esc');
      $('.js-tosave-button-esc').unbind('');
      $('.js-tosave-button-no').unbind('');
      $('.js-tosave-button-yes').unbind('');
      return;
    });
    $('.js-tosave-button-no').click(function () {
      $('.message-tosave').addClass('to-delete');
      console.log('no');
      window.util.viewAreaClose(fileId);
      $('.js-tosave-button-esc').unbind('');
      $('.js-tosave-button-no').unbind('');
      $('.js-tosave-button-yes').unbind('');
    });
    $('.js-tosave-button-yes').click(function () {
      $('.message-tosave').addClass('to-delete');
      console.log('yes');
      $('.viewing__button').trigger('click');
      window.util.viewAreaClose(fileId);
      $('.js-tosave-button-esc').unbind('');
      $('.js-tosave-button-no').unbind('');
      $('.js-tosave-button-yes').unbind('');
    });
  };
  function viewAreaClose (fileId) {
    console.log('viewAreaClose ' + fileId);
    $('.bookmarks__item').filter('#bookmark-' + fileId).remove();
    //по id найходим textarea и удаляем его
    $('.text-area textarea').filter('#textarea-' + fileId).remove();
    //по id найходим элемент в дереве файлов и снимаем атрибут data-open
    $('.tree__files-atom').filter('#' + fileId).removeAttr('data-opened');
    window.util.noMarker();

    //если удаляем последнюю закладку, то восстанавливаем bookmarks__item--zero и js-text-area--zero и прочее
    if ($('.bookmarks__item').length == 1) {
      $('.js-bookmarks__item--zero').removeClass('to-delete');
      $('.js-bookmarks__item--zero').removeClass('bookmarks__item--current');
      $('.js-bookmarks__item--zero button').remove();
      //восстановливаем js-text-area--zero
      $('.js-text-area--zero').removeClass('to-delete');
      //делаем недоступными пункты меню
      window.menuAccyAttrs.menuZeroState();
      //кнопку сохранить переводим в disabled
      $('.viewing__button').attr('disabled', 'true');
      $('.viewing__button').unbind('');
    } else {
      //находим первую закладку в наборе и даем ей current
      $('.bookmarks__item').removeClass('bookmarks__item--current');
      $('.bookmarks__item').first().addClass('bookmarks__item--current');
      var fileNewCurrId = $('.bookmarks__item').first().attr('id').replace('bookmark-', '');
      var fileNewFullName = $('.bookmarks__item').first().children('span').html();

      $('.text-area textarea').addClass('to-delete');
      //находим по id соответствующий textarea и отображаем его
      $('.text-area textarea').filter('#textarea-' + fileNewCurrId).removeClass('to-delete');
      $('.tree__files-atom').filter('#' + fileNewCurrId).addClass('tree__atom-current');

      //формируем атрибуты пунктов меню
      window.menuAccyAttrs.menuForFile(fileNewCurrId, fileNewFullName);
      $('#bookmark-' + fileId).children('.bookmark__close').unbind('');
      if ($('.bookmarks__item').first().hasClass('bookmarks__item--changed')) {
        $('.viewing__button').removeAttr('disabled');
        $('.viewing__button').click(window.util.onSaveButtonClick);
      } else {
        $('.viewing__button').attr('disabled', 'true');
        $('.viewing__button').unbind('');
      }
    }
  };

  window.util = {
    noMarker: noMarker,
    onTextareaInput: onTextareaInput,
    onSaveButtonClick: onSaveButtonClick,
    doYouWantToSave: doYouWantToSave,
    viewAreaClose: viewAreaClose
  };
}(window.jQuery);

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
