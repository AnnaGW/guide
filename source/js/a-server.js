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
