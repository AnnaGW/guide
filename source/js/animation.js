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
