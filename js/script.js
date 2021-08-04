//показывает анимированное всплывающее сообщение
+function () {
  'use strict';
  function animatedMessageAppearance (text) {
    $('.animated-message__text').html(text);
    $('.animated-message__popup').addClass('animated-message__popup--animation');
  };

  window.animation = {
    animatedMessageAppearance: animatedMessageAppearance
  };

}(window.jQuery);

+function () {
  'use strict';
  //закрывашка для закладки
  function viewFileClose() { //удаляет закладку и область просмотра,
    //найходим id удаляемой закладки-родителя
    var bookmarkId = $(this).closest('.bookmarks__item').attr('id').replace('bookmark-', '');
    $(this).closest('.bookmarks__item').remove();

    //по id найходим textarea и удаляем его
    $('.text-area textarea').filter('#textarea-' + bookmarkId).remove();
    //по нему найходим элемент в дереве файлов и снимаем атрибут data-open
    $('.tree__files-atom').filter('#' + bookmarkId).removeAttr('data-opened');
    $('.tree__files-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');

    //если удаляем последнюю закладку, то восстанавливаем bookmarks__item--zero и js-text-area--zero и прочее
    if ($('.bookmarks__item').length == 1) {
      $('.js-bookmarks__item--zero').removeClass('to-delete');
      $('.js-bookmarks__item--zero').removeClass('bookmarks__item--current');
      $('.js-bookmarks__item--zero button').remove();
      //восстановливаем js-text-area--zero
      $('.js-text-area--zero').removeClass('to-delete');
      //делаем недоступными пункты меню
      $('button.js-file-delete').prop('disabled', true);
      $('button.js-rename').prop('disabled', true);
      //$('.js-file-upload').addClass('main-menu__item--disabled');
      $('.js-file-download').removeAttr('href');
      $('.js-file-download').addClass('main-menu__item--disabled');
    } else {
      //находим первую закладку в наборе и даем ей current
      $('.bookmarks__item').first().addClass('bookmarks__item--current');
      var bookmarkNewCurrId = $('.bookmarks__item').first().attr('id').replace('bookmark-', '');
      //находим первый textarea и отображаем его, правильнее находить по id!!!
      $('.text-area textarea').first().removeClass('to-delete');
      $('.tree__files-atom').filter('#' + bookmarkNewCurrId).addClass('tree__atom-current');
    }
  };

  function bookmarkClose() {
    $('.bookmark__close').click(viewFileClose);
  };
//-------------------------------------------------------------------
  //переключатель вкладок и textarea
  function viewFileToggle() {
    $('.bookmarks__item').removeClass('bookmarks__item--current');
    $(this).addClass('bookmarks__item--current');
    //получаем id закладки без префикса
    var bookmarkId = $(this).attr('id').replace('bookmark-', '');

    //находим среди textarea элемент с соотв id
    $('.text-area textarea').addClass('to-delete');
    $('.text-area textarea').filter('#textarea-' + bookmarkId).removeClass('to-delete');

    //находим среди files-tree__atom элемент с соотв id маркируем его
    $('.tree__files-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom').removeClass('tree__atom-current');
    $('.tree__folders-atom--empty').removeClass('tree__atom-current');
    $('.tree__files-atom').filter('#' + bookmarkId).addClass('tree__atom-current');
  };


  function bookmarkToggle() {
    $('.bookmarks__item').click(viewFileToggle); //?? приоритет с bookmark__close???
  };


  window.bookmark = {
    bookmarkClose: bookmarkClose,
    bookmarkToggle: bookmarkToggle
  };
}(window.jQuery);

'use strict';

(function () {


})();

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

  function onErrorFirstFolders () {
    window.onError.errorMessageShow('Ошибка загрузки данных о папках первого уровня');
  };

  $(window).load(function () {
    var treeUrl = '../jsons/tree0.json';
    window.server.download(treeUrl, onSuccessFirstFolders, onErrorFirstFolders);
  });

}(window.jQuery);

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
  $('.deleting-file__text span').html(fileFullName);
  $('.deleting-file input').val(serverData.fileId);
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

//обрабатываем нажатия на пункты меню, открываем всплывающие окна
+function () {
  'use strict';

function closePopupDeletingFile () {
  $('.deleting-file').addClass('to-delete');

  //очистка поля с именем файла/папки
  $('.js-popup-close-deleting').unbind('click', closePopupDeletingFile);
};

function openPopupDeletingFile () {
  $('.deleting-file').removeClass('to-delete');
  $('.js-popup-close-deleting').click(closePopupDeletingFile);
  $('.js-popup-button-delete').click(window.deleting.fileDeleting);
  $('body').keydown(function(evt){
    if(evt.key === "Escape") {
      closePopupDeletingFile();
    }
  });
};

//----------------------------------------------------------

function closePopupDeletingFolder () {
  $('.deleting-folder').addClass('to-delete');

  //очистка поля с именем файла/папки
  $('.js-popup-close-deleting').unbind('click', closePopupDeletingFolder);
};

function openPopupDeletingFolder () {
  $('.deleting-folder').removeClass('to-delete');
  $('.js-popup-close-deleting').click(closePopupDeletingFolder);
  $('.js-popup-button-delete').click(closePopupDeletingFolder);
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
  $('.js-validation-message').addClass('to-delete');//убрали возможное сообщение об ошибке валидации
  $('.js-popup-button-rename').attr('disabled', 'true');//поставили disabled
  $('.js-popup-input-rename').val('');
  $('.js-popup-close-renaming').unbind('click', closePopupRenaming);
};

function openPopupRenaming () {
  $('.renaming').removeClass('to-delete');
  $('.js-popup-close-renaming').click(closePopupRenaming);
  $('body').keydown(function(evt){
    if(evt.key === "Escape") {
      closePopupRenaming();
    }
  });
  $('.js-popup-input-rename').on('input',function() {
    $('.js-popup-button-rename').removeAttr('disabled');//убрали disabled
    $('.js-validation-message').addClass('to-delete');//убрали возможное сообщение об ошибке валидации
    if ($(this).val() === '') {
      $('.js-popup-button-rename').attr('disabled', 'true');//поставили disabled
    }
  });
  $('.js-popup-input-rename').on('change',function() {
    var value = $(this).val();//получили значение input
    if (window.validation.fileNameValidation(value) ) {
      //отправка формы, пока просто закрываем
      closePopupRenaming();
    } else {
      //вывод сообщения об ошибке
      $('.js-validation-message').html('имя должно быть на латинице');
      $('.js-validation-message').removeClass('to-delete');
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
    $('.deleting-folder__text span').html(folderName);
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
    var folderName = $(this).html();
    $('.deleting-folder__text span').html(folderName);
    $('.renaming__text span').html(folderName);
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

+function () {
  'use strict';

  function errorMessageShow (textMessage) {
    $('.message').removeClass('to-delete');
    $('.message__dynamic-text').html(textMessage);
    $('.js-popup-button-clear').click(function () {
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
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout / 1000 + 'с');
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

//открываем окно выбора файла, скачиваем файл, отображаем его содержимое
+function () {
  'use strict';

  function onUploaded () {
    var reader = new FileReader();
  	reader.onload = function(e){
  		$("#viewing-area-1").val(e.target.result);
  	};
  	reader.readAsText($('#upload-file')[0].files[0], 'UTF-8');
  };

  //обрабатываем событие change после выбора файла
  $('#upload-file').change(onUploaded);

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
