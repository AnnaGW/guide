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
