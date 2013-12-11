function ItemEditorView(){
	
	var container = $("#lamadmin");
	var hunTextArea;
	var engTextArea;
	var itemEditor;
	var imageHolder;
	var fileUploader;
	var selectedImageName = "";
	var selectedImageIndex = 0;
	
	function cleanView(){
		LamadminModel.tracer.log("removeItemEditor");
		if(itemEditor)
			itemEditor.remove();
		$("#main_container").show();
	}

	function drawView(){
		LamadminModel.tracer.log("openEditor");
		LamadminModel.tracer.log(LamadminModel.selectedItemObject);
		
		var nameHunTF = '<div class="elem nameHun"><p>Magyar név:</p><input type="text" value="' + LamadminModel.selectedItemObject.NAME_HUN + '"/></div>';
		var nameEngTF = '<div class="elem nameEng"><p>English name:</p><input type="text" value="' + LamadminModel.selectedItemObject.NAME_ENG + '"/></div>';
		
		// images
		var tempImages = '';
		for (var i= 0; i < LamadminModel.selectedItemObject.IMAGES.length;i++){
			var src = LamadminModel.IMAGE_THUMB_ADMIN_DIR_PATH + LamadminModel.selectedItemObject.IMAGES[i].name;
			tempImages +='<div class="imageElem"><img src="' + src + '"/><div class="remove"></div></div>';
		}
		if(LamadminModel.selectedItemObject.IMAGES.length == 0)
			tempImages = '<p>No image on this node.</p>';
		var imageHolderTemplate = '<div class="elem imageHolder">' + tempImages + '</div>';
		
		
		// uploader
		var fileUploader = '<br><hr><span class="btn btn-success fileinput-button"><i class="glyphicon glyphicon-plus"></i><span>Add files...</span><input id="fileupload" type="file" name="files[]" multiple=""></span>';
		fileUploader += '<br><div id="progress" class="progress"><div class="progress-bar"></div></div>';
		fileUploader += '<div id="files" class="files"></div>';
		
		var textContentHunTemplate = '<div class="elem"><textArea class="textContentHun" >' + LamadminModel.decodeOU(LamadminModel.selectedItemObject.TEXT_CONTENT_HUN) + '</textArea></div>';
		var textContentEngTemplate = '<div class="elem"><textArea class="textContentEng" >' + LamadminModel.decodeOU(LamadminModel.selectedItemObject.TEXT_CONTENT_ENG) + '</textArea></div>';
		
		var closer = '<p class="remover">close</p>';
		var saver = '<p class="saver">save</p>'
		var editorTemplate = '<div id="itemEditor"><div class="window">'  + nameHunTF + nameEngTF + imageHolderTemplate;
		editorTemplate += fileUploader + textContentHunTemplate + textContentEngTemplate + closer + saver + '</div></div>';
		
		
		container.append(editorTemplate);
		itemEditor = $("#itemEditor");
		
		$("#itemEditor .remover").click(cleanView);
		$("#itemEditor .saver").click(saveChanges);
		hunTextArea = $("#itemEditor textarea.textContentHun");
		engTextArea = $("#itemEditor textarea.textContentEng");
		addTinyMCE(hunTextArea);
		addTinyMCE(engTextArea);
		
		nameHun = $("#itemEditor .nameHun input");
		nameEng = $("#itemEditor .nameEng input");
		
		imageHolder = $("#itemEditor .imageHolder");
		$("#itemEditor .imageHolder .imageElem").click(onImageClicked);
		initFileUploader();
	}

	function updateImages(){
		var tempImages = '';
		for (var i= 0; i < LamadminModel.selectedItemObject.IMAGES.length;i++){
			var src = LamadminModel.IMAGE_THUMB_ADMIN_DIR_PATH + LamadminModel.selectedItemObject.IMAGES[i].name;
			tempImages +='<div class="imageElem"><img src="' + src + '"/><div class="remove"></div></div>';
		}
		if(LamadminModel.selectedItemObject.IMAGES.length == 0)
			tempImages = '<p>No image on this node.</p>';
		
		imageHolder.html(tempImages);
		$("#itemEditor .imageHolder .imageElem").click(onImageClicked);
	}
	
	function onImageClicked(e,data){
		LamadminModel.tracer.log(e.target);
		selectedImageIndex = $(this).index();
		selectedImageName = LamadminModel.selectedItemObject.IMAGES[selectedImageIndex].name;
		if($(e.target).hasClass("remove"))
			removeImage();
		else
			openImage();
	}
	function removeImage(){
		var dataObject = {};
		dataObject.nodeID = LamadminModel.selectedItemObject.id;
		dataObject.imageID = LamadminModel.selectedItemObject.IMAGES[selectedImageIndex].ID;
		dataObject.imageName = LamadminModel.selectedItemObject.IMAGES[selectedImageIndex].name;
		LamadminModel.lamadminService.removeImage(dataObject);
	};
	function openImage(){
		var href = LamadminModel.IMAGE_ADMIN_DIR_PATH + selectedImageName;
		window.open(href,"_blank");
	}
	function saveChanges(){
		LamadminModel.tracer.log(hunTextArea.html());
		
		var dataObject = {};
		dataObject.ID = LamadminModel.selectedItemObject.id;
		dataObject.NAME_HUN = nameHun[0].value;
		dataObject.NAME_ENG = nameEng[0].value;
		dataObject.TEXT_CONTENT_HUN = LamadminModel.encodeOU(hunTextArea.html());
		dataObject.TEXT_CONTENT_ENG = LamadminModel.encodeOU(engTextArea.html());
		
		LamadminModel.lamadminService.updateNode(dataObject);
	}
	function initFileUploader(){
			
		$(function () {
			/*jslint unparam: true, regexp: true */
			/*global window, $ */
	
		    'use strict';
		    // Change this to the location of your server-side upload handler:
		    var url = 'php/fileUploader/',
		        uploadButton = $('<button/>')
		            .addClass('btn btn-primary')
		            .prop('disabled', true)
		            .text('Processing...')
		            .on('click', function () {
		                var $this = $(this),
		                    data = $this.data();
		                $this
		                    .off('click')
		                    .text('Abort')
		                    .on('click', function () {
		                        $this.remove();
		                        data.abort();
		                    });
		                data.submit().always(function () {
		                    $this.remove();
		                });
		            });
		    $('#fileupload').fileupload({
		        url: url,
		        dataType: 'json',
		        autoUpload: false,
		        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		        maxFileSize: 5000000, // 5 MB
		        // Enable image resizing, except for Android and Opera,
		        // which actually support image resizing, but fail to
		        // send Blob objects via XHR requests:
		        disableImageResize: /Android(?!.*Chrome)|Opera/
		            .test(window.navigator.userAgent),
		        previewMaxWidth: 100,
		        previewMaxHeight: 100,
		        previewCrop: true
		    }).on('fileuploadadd', function (e, data) {
		        data.context = $('<div/>').appendTo('#files');
		        $.each(data.files, function (index, file) {
		            var node = $('<p/>')
		                    .append($('<span/>').text(file.name));
		            if (!index) {
		                node
		                    .append('<br>')
		                    .append(uploadButton.clone(true).data(data));
		            }
		            node.appendTo(data.context);
		        });
		    }).on('fileuploadprocessalways', function (e, data) {
		        var index = data.index,
		            file = data.files[index],
		            node = $(data.context.children()[index]);
		        if (file.preview) {
		            node
		                .prepend('<br>')
		                .prepend(file.preview);
		        }
		        if (file.error) {
		            node
		                .append('<br>')
		                .append(file.error);
		        }
		        if (index + 1 === data.files.length) {
		            data.context.find('button')
		                .text('Upload')
		                .prop('disabled', !!data.files.error);
		        }
		    }).on('fileuploadprogressall', function (e, data) {
		        var progress = parseInt(data.loaded / data.total * 100, 10);
		        $('#progress .progress-bar').css(
		            'width',
		            progress + '%'
		        );
		    }).on('fileuploaddone', function (e, data) {
		        $.each(data.result.files, function (index, file) {
		            var link = $('<a>')
		                .attr('target', '_blank')
		                .prop('href', file.url);
		            $(data.context.children()[index])
		                .wrap(link);
		                
		            saveImagePath(file.name);
		        });
		    }).on('fileuploadfail', function (e, data) {
		        $.each(data.result.files, function (index, file) {
		            var error = $('<span/>').text(file.error);
		            $(data.context.children()[index])
		                .append('<br>')
		                .append(error);
		        });
		    }).prop('disabled', !$.support.fileInput)
		        .parent().addClass($.support.fileInput ? undefined : 'disabled');
	
	
		});
	};
	
	function saveImagePath(p_name){
		LamadminModel.tracer.log(p_name);
		var dataObject = {ID:LamadminModel.selectedItemObject.id, fileName: p_name};
		LamadminModel.lamadminService.saveFile(dataObject);
	}
	
	function addTinyMCE(p_textArea){
		p_textArea.tinymce({
					// Location of TinyMCE script
					script_url : 'js/utils/tiny_mce/tiny_mce.js',
		
					// General options
					theme : "advanced",
					plugins : "autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",
					remove_linebreaks : true,
					convert_newlines_to_brs : true,
					//save_onsavecallback : testSave,
					// Theme options
					
					theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,styleselect,formatselect,fontselect,fontsizeselect,|,outdent,indent,|,undo,redo",
					theme_advanced_buttons2 : "",
					theme_advanced_buttons3 : "",
					theme_advanced_buttons4 : "",
					
					theme_advanced_toolbar_location : "top",
					theme_advanced_toolbar_align : "left",
					theme_advanced_statusbar_location : "bottom",
					theme_advanced_resizing : true,
		
					// Example content CSS (should be your site CSS)
					content_css : "css/lamadmin.css",
		
					// Drop lists for link/image/media/template dialogs
					template_external_list_url : "lists/template_list.js",
					external_link_list_url : "lists/link_list.js",
					external_image_list_url : "lists/image_list.js",
					media_external_list_url : "lists/media_list.js",
		
					// Replace values for the template plugin
					template_replace_values : {
						username : "jeno",
						staffid : "1"
					}
			});	
	}
	
	function openEditor(){	
		cleanView();
		drawView();
		$("#main_container").hide();
		LamadminEvents.subscribe(LamadminEvents.IMAGES_UPDATED_ON_NODE,updateImages);
	}
	
	return{
		open:openEditor
	}
}
