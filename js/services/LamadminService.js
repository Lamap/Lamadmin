function LamadminService(){
/////	
	var getStructureURL = "php/readStructure.php";
	function loadStructure(){
		$.ajax({
		  type: "POST",
		  url: getStructureURL,
		  dataType:"json",  
		}).always(onGetStructure);
	};
	function onGetStructure(data){
		LamadminModel.tracer.log(data);	
		
		if(!data.status)
		{
			LamadminEvents.dispatchEvent(LamadminEvents.JSON_PARSE_ERROR,data);
			return;
		}
		
		if(data.status == "OK")		
			{
				LamadminModel.structureObjectTree = parseCategoryObjectToTree(data.structure);
				LamadminModel.structureObject = parseCategoryObjectToPlain(LamadminModel.structureObjectTree);
				LamadminModel.structureObject = repairTextContents(LamadminModel.structureObject);
				LamadminEvents.dispatchEvent(LamadminEvents.STRUCTURE_LOADED,data);
			}					
		else
			LamadminEvents.dispatchEvent(LamadminEvents.STRUCTURE_LOAD_ERROR,data);
	};
//////	
	var saveFileURL = "php/saveFile.php";
	function saveFile(data){
		$.ajax({
		  type: "POST",
		  url: saveFileURL,
		  data: data,
		  dataType:"json",  
		}).always(onSaveFile);
	};
	function onSaveFile(data){
		LamadminModel.tracer.log(data);	
		
		if(!data.status)
		{
			LamadminEvents.dispatchEvent(LamadminEvents.JSON_PARSE_ERROR,data);
			return;
		}
		
		if(data.status == "OK")		
			{
				LamadminModel.selectedItemObject.IMAGES = data.IMAGES;
				LamadminModel.structureObject[LamadminModel.selectedItemIndex].IMAGES = data.IMAGES;
				LamadminEvents.dispatchEvent(LamadminEvents.IMAGES_UPDATED_ON_NODE);
			}					
		else
			LamadminEvents.dispatchEvent(LamadminEvents.IMAGE_SAVE_ERROR,data);
	};
//////	
	var updateNodeURL = "php/updateNode.php";
	function updateNode(data){
		$.ajax({
		  type: "POST",
		  url: updateNodeURL,
		  data: data,
		  dataType:"json",  
		}).always(onUpdateNode);
	};
	function onUpdateNode(data){
		LamadminModel.tracer.log(data);	
				
		if(!data.status)
		{
			LamadminEvents.dispatchEvent(LamadminEvents.JSON_PARSE_ERROR,data);
			return;
		}
		
		if(data.status == "OK")		
			{
				LamadminModel.selectedItemObject.NAME_HUN = data.NAME_HUN;
				LamadminModel.selectedItemObject.NAME_ENG = data.NAME_ENG;
				LamadminModel.selectedItemObject.TEXT_CONTENT_HUN = base64_decode(data.TEXT_CONTENT_HUN);
				LamadminModel.selectedItemObject.TEXT_CONTENT_ENG = base64_decode(data.TEXT_CONTENT_ENG);
				
				LamadminModel.structureObject[LamadminModel.selectedItemIndex] = LamadminModel.selectedItemObject;
				
				LamadminEvents.dispatchEvent(LamadminEvents.NODE_UPDATED,data);
			}					
		else
			LamadminEvents.dispatchEvent(LamadminEvents.NODE_UPDATE_ERROR,data);
	};
///////
	var removeImageURL = "php/removeImage.php";
	function removeImage(data){
		$.ajax({
		  type: "POST",
		  url: removeImageURL,
		  data: data,
		  dataType:"json",  
		}).always(onRemoveImage);
	};
	function onRemoveImage(data){
		LamadminModel.tracer.log(data);	
		
		if(!data.status)
		{
			LamadminEvents.dispatchEvent(LamadminEvents.JSON_PARSE_ERROR,data);
			return;
		}
		
		if(data.status == "OK")		
			{
				LamadminModel.selectedItemObject.IMAGES = data.IMAGES;
				LamadminModel.structureObject[LamadminModel.selectedItemIndex].IMAGES = data.IMAGES;
				LamadminEvents.dispatchEvent(LamadminEvents.IMAGES_UPDATED_ON_NODE);
			}					
		else
			LamadminEvents.dispatchEvent(LamadminEvents.IMAGE_DELETE_ERROR,data);
	};	
///////	
	var addItemURL = "php/addItem.php";
	function addItem(data){
		$.ajax({
		  type: "POST",
		  url: addItemURL,
		  dataType:"json",
		  data:data,  
		}).always(onGetStructure);
	};
////////	
	var removeNodeURL = "php/removeNode.php";
	function deleteNode(data){
		$.ajax({
		  type: "POST",
		  url: removeNodeURL,
		  dataType:"json",
		  data:data,  
		}).always(onRemoveNode);
	};
	function onRemoveNode(data){
		LamadminModel.tracer.log(data);	
		
		if(!data.status)
		{
			LamadminEvents.dispatchEvent(LamadminEvents.JSON_PARSE_ERROR,data);
			return;
		}
		
		if(data.status == "OK")		
			{
				LamadminEvents.dispatchEvent(LamadminEvents.NODE_DELETED,data);
			}					
		else
			LamadminEvents.dispatchEvent(LamadminEvents.NODE_DELETE_ERROR,data);
	};	
	
	function parseCategoryObjectToPlain(p_categories){
		var categories = [];
		var catArray = p_categories;
		categories.rootLength = catArray.length;
		//L1
		for(var L1 = 0; L1 < catArray.length;L1++){
			catArray[L1].childLength = catArray[L1].categories.length;
			catArray[L1].childrenIDs = [];
			categories.push(catArray[L1]);
			//L2
			for(var L2 = 0; L2 < catArray[L1].categories.length; L2++){
				catArray[L1].categories[L2].childLength = catArray[L1].categories[L2].categories.length;
				catArray[L1].categories[L2].childrenIDs = [];
				categories.push(catArray[L1].categories[L2]);
				catArray[L1].childrenIDs.push(catArray[L1].categories[L2].id);
				
				//L3
				for(var L3 = 0; L3 < catArray[L1].categories[L2].categories.length; L3++){
					catArray[L1].categories[L2].categories[L3].childLength = catArray[L1].categories[L2].categories[L3].categories.length;
					catArray[L1].categories[L2].categories[L3].childrenIDs = [];
					categories.push(catArray[L1].categories[L2].categories[L3]);
					catArray[L1].childrenIDs.push(catArray[L1].categories[L2].categories[L3].id);
					catArray[L1].categories[L2].childrenIDs.push(catArray[L1].categories[L2].categories[L3].id);
					//L4
					for(var L4 = 0; L4 < catArray[L1].categories[L2].categories[L3].categories.length; L4++){
						catArray[L1].categories[L2].categories[L3].categories[L4].childLength = catArray[L1].categories[L2].categories[L3].categories[L4].categories.length;
						catArray[L1].categories[L2].categories[L3].categories[L4].childrenIDs = [];
						categories.push(catArray[L1].categories[L2].categories[L3].categories[L4]);
						catArray[L1].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].id);
						catArray[L1].categories[L2].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].id);
						catArray[L1].categories[L2].categories[L3].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].id);
						//L5
						for(var L5 = 0; L5 < catArray[L1].categories[L2].categories[L3].categories[L4].categories.length; L5++){
							catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].childLength = catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories.length;
							catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].childrenIDs = [];
							categories.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5]);
							catArray[L1].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].id);
							catArray[L1].categories[L2].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].id);
							catArray[L1].categories[L2].categories[L3].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].id);
							catArray[L1].categories[L2].categories[L3].categories[L4].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].id);
							//L6
							for(var L6 = 0; L6 < catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories.length; L6++){
								catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6].childLength = catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories.length;
								categories.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6]);
								
								catArray[L1].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6].id);
								catArray[L1].categories[L2].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6].id);
								catArray[L1].categories[L2].categories[L3].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6].id);
								catArray[L1].categories[L2].categories[L3].categories[L4].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6].id);
								catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].childrenIDs.push(catArray[L1].categories[L2].categories[L3].categories[L4].categories[L5].categories[L6].id);
							}
						}
					}
					
				}
			}
		}
		
		return(categories);
	}
	
	function parseCategoryObjectToTree(p_categories){
		var catLength = p_categories.length;
		var catArray = p_categories;
		
		var categories = [];
		
		//LEVEL1
		for(var i = 0; i < catLength; i++){
			if(parseInt(catArray[i].parent_id) == 0){
				catArray[i].level = 1;
				categories.push(catArray[i]);
			}
		}
		//LEVEL2
		for(var j = 0; j < categories.length; j++){
			var id = parseInt(categories[j].id);
			categories[j].categories = [];
			for(var i = 0; i < catLength; i++){
				if(parseInt(catArray[i].parent_id) == id){
					catArray[i].level = 2;
					categories[j].categories.push(catArray[i]);
				}
			}
		}
		//LEVEL3
			for(var j = 0; j < categories.length; j++){
				for(var i = 0; i < categories[j].categories.length; i++){
					var id = parseInt(categories[j].categories[i].id);
					categories[j].categories[i].categories = [];
					for(var k = 0; k < catLength; k++){
						if(parseInt(catArray[k].parent_id) == id){
							catArray[k].level = 3;
							categories[j].categories[i].categories.push(catArray[k]);
						}
					}
				}
			}
			
			
		//LEVEL4
		for(var j = 0; j < categories.length; j++){
			for(var i = 0; i < categories[j].categories.length; i++){
					for(var n = 0; n < categories[j].categories[i].categories.length; n++){
						var id = parseInt(categories[j].categories[i].categories[n].id);
						categories[j].categories[i].categories[n].categories = [];
						for(var c = 0; c < catLength; c++){
							if(parseInt(catArray[c].parent_id) == id){
								catArray[c].level = 4;
								categories[j].categories[i].categories[n].categories.push(catArray[c]);
							}
						}
					}	
			}
		}	
			
		//LEVEL5
		for(var j = 0; j < categories.length; j++){
			for(var i = 0; i < categories[j].categories.length; i++){
					for(var n = 0; n < categories[j].categories[i].categories.length; n++){
						for(var p = 0; p < categories[j].categories[i].categories[n].categories.length; p++){
							var id = categories[j].categories[i].categories[n].categories[p].id;
							categories[j].categories[i].categories[n].categories[p].categories = [];
								for(var c = 0; c < catLength; c++){
								if(parseInt(catArray[c].parent_id) == id){
									catArray[c].level = 5;
									categories[j].categories[i].categories[n].categories[p].categories.push(catArray[c]);
								}
							}
						}					
					}	
			}
		}	
		
		//LEVEL6
		for(var j = 0; j < categories.length; j++){
			for(var i = 0; i < categories[j].categories.length; i++){
					for(var n = 0; n < categories[j].categories[i].categories.length; n++){
						for(var p = 0; p < categories[j].categories[i].categories[n].categories.length; p++){
							for(var q= 0; q < categories[j].categories[i].categories[n].categories[p].categories.length; q++){
							
								var id = categories[j].categories[i].categories[n].categories[p].categories[q].id;
								categories[j].categories[i].categories[n].categories[p].categories[q].categories = [];
									for(var c = 0; c < catLength; c++){
									if(parseInt(catArray[c].parent_id) == id){
										catArray[c].level = 6;
										categories[j].categories[i].categories[n].categories[p].categories[q].categories.push(catArray[c]);
									}
								}
							}
						}					
					}	
			}
		}
			
		//		
		return(categories);
	}
	
	function repairTextContents(p_structure){
		var structure = p_structure;
		
		for(var i = 0; i < structure.length; i++){
				structure[i].TEXT_CONTENT_HUN = base64_decode(structure[i].TEXT_CONTENT_HUN);
				structure[i].TEXT_CONTENT_ENG = base64_decode(structure[i].TEXT_CONTENT_ENG);
		}
		
		return structure;
	}
	
	function base64_decode (data) {
	  // http://kevin.vanzonneveld.net
	  // +   original by: Tyler Akins (http://rumkin.com)
	  // +   improved by: Thunder.m
	  // +      input by: Aman Gupta
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Onno Marsman
	  // +   bugfixed by: Pellentesque Malesuada
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +      input by: Brett Zamir (http://brett-zamir.me)
	  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	  // *     returns 1: 'Kevin van Zonneveld'
	  // mozilla has this native
	  // - but breaks in 2.0.0.12!
	  //if (typeof this.window['atob'] === 'function') {
	  //    return atob(data);
	  //}
	  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	    ac = 0,
	    dec = "",
	    tmp_arr = [];
	
	  if (!data) {
	    return data;
	  }
	
	  data += '';
	
	  do { // unpack four hexets into three octets using index points in b64
	    h1 = b64.indexOf(data.charAt(i++));
	    h2 = b64.indexOf(data.charAt(i++));
	    h3 = b64.indexOf(data.charAt(i++));
	    h4 = b64.indexOf(data.charAt(i++));
	
	    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
	
	    o1 = bits >> 16 & 0xff;
	    o2 = bits >> 8 & 0xff;
	    o3 = bits & 0xff;
	
	    if (h3 == 64) {
	      tmp_arr[ac++] = String.fromCharCode(o1);
	    } else if (h4 == 64) {
	      tmp_arr[ac++] = String.fromCharCode(o1, o2);
	    } else {
	      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
	    }
	  } while (i < data.length);
	
	  dec = tmp_arr.join('');
	
	  return dec;
	}
	
	return{
		loadStructure:loadStructure,
		addItem:addItem,
		saveFile:saveFile,
		removeImage:removeImage,
		updateNode:updateNode,
		deleteNode:deleteNode
	}
}
