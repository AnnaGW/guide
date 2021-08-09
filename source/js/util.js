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
