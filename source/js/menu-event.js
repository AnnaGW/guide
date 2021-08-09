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
