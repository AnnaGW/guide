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
