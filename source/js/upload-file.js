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
