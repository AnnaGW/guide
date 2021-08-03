//открывает всплывающие подсказки к файлам
+function () {
  'use strict';

  function tooltipShow(evt) {
    //позиционируем: получаем координаты мыши внутри files-tree__atom, задаем значения top и left для подсказки
    console.log('hover');
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
