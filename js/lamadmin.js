$(document).ready(onReady);
function onReady(){
	
	LamadminModel.tracer = new Tracer();
	
	LamadminModel.tracer.log("ready");
	
	LamadminModel.lamadminService = new LamadminService();
	LamadminModel.itemEditorView = new ItemEditorView(); 
	
	// addListeners
	LamadminEvents.subscribe(LamadminEvents.STRUCTURE_LOADED,onStructureLoaded);
	LamadminEvents.subscribe(LamadminEvents.STRUCTURE_LOAD_ERROR,onStructureLoadError);
	LamadminEvents.subscribe(LamadminEvents.NODE_UPDATED,drawListView);
	LamadminEvents.subscribe(LamadminEvents.NODE_DELETED,onNodeDeleted);
	
	// startUp
	LamadminModel.lamadminService.loadStructure();
	

	var structureElemsArray = $("#main_container .structureElem.notRoot");
	var addItemButtonsToNodes = $("#main_container .structureElem.notRoot .addItem");
	var addItemButtonToRoot = $("#main_container .structureElem .addItem");
	var deleteNode = $("#main_container .structureElem .delItem");
	var editItemButtons = $("#main_container .structureElem .editItem");

	addItemButtonToRoot.click(addItemToRoot);

	var structureHolder =  $("#main_container");
	
	
	
	function onStructureLoaded(e,data){
		drawListView();
	}
	function onStructureLoadError(e,data){
		alert(data.message);
	}
	
	///
	function drawListView(){
		//clean
			structureElemsArray.remove();
			
		
		//draw
		for(var i = 0; i < LamadminModel.structureObject.length; i++)
		{
			var cssClass = "structureElem notRoot strLevel" + LamadminModel.structureObject[i].level;
			var opener = '<div class="opener">+</div>';
			var title = '<p class = "title">' + LamadminModel.structureObject[i].NAME_HUN + "/" + LamadminModel.structureObject[i].NAME_ENG + '</p>';
			var addItemTempl = '<p class="addItem">addChild</p>';
			var delItemTempl = '<p class="delItem">delete</p>';
			var editTempl = '<p class="editItem">edit node</p>'
			var elemTemplate = '<div class="' + cssClass +'">' + opener + title + addItemTempl + delItemTempl + editTempl + '</div>';
			
			structureHolder.append(elemTemplate);
		}
		structureElemsArray = $("#main_container .structureElem.notRoot");
		addItemButtonsToNodes = $("#main_container .structureElem.notRoot .addItem");
		addItemButtonsToNodes.click(addItemToNodes);

		deleteNode = $("#main_container .structureElem .delItem");
		deleteNode.click(onDeleteNode);		
		
		editItemButtons = $("#main_container .structureElem .editItem");
		editItemButtons.click(onEditItemClicked);
	};
	
	function addItemToNodes(){
		LamadminModel.tracer.log("addItem");
		var index = $(this).parent().index() - 1;
		
		var parentId = LamadminModel.structureObject[index].id;
		var parentLevel = LamadminModel.structureObject[index].level;
		LamadminModel.tracer.log(parentId);
		var dataObject = {parent:parentId, order:LamadminModel.structureObject[index].childLength, parentLevel:parentLevel};
		
		LamadminModel.lamadminService.addItem(dataObject);
		
	}
	function addItemToRoot(){
		var dataObject = {parent:0,order:LamadminModel.structureObject.rootLength, parentLevel:0};
		LamadminModel.lamadminService.addItem(dataObject);
	}
	
	function onEditItemClicked(){
		LamadminModel.selectedItemIndex = $(this).parent().index() - 1;
		LamadminModel.selectedItemObject = LamadminModel.structureObject[LamadminModel.selectedItemIndex];
		LamadminModel.itemEditorView.open();
	}
	function onDeleteNode(){
		var index = $(this).parent().index() - 1;
		
		var ID = LamadminModel.structureObject[index].id;
		var childrenIDs = LamadminModel.structureObject[index].childrenIDs; 
		var dataObject = {};
		dataObject.ID = ID;
		dataObject.childrenIDs = (childrenIDs && childrenIDs.length != 0) ? childrenIDs : 0;
		
		LamadminModel.lamadminService.deleteNode(dataObject);
	}
	function onNodeDeleted(){
		LamadminModel.lamadminService.loadStructure();
	}
}