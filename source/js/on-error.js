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
