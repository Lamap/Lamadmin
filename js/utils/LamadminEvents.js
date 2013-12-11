LamadminEvents = {
	
	STRUCTURE_LOADED: "LAMADMIN_STRUCTURE_LOADED",
	STRUCTURE_LOAD_ERROR: "LAMADMIN_STRUCTURE_LOAD_ERROR",
	IMAGE_SAVE_ERROR: "LAMADMIN_IMAGE_SAVE_ERROR",
	IMAGE_DELETE_ERROR: "LAMADMIN_IMAGE_DELETE_ERROR",
	NODE_UPDATE_ERROR: "LAMADMIN_NODE_UPDATE_ERROR",
	NODE_DELETE_ERROR: "LAMADMIN_NODE_DELETE_ERROR",
	OPEN_ITEM_EDITOR: "LAMADMIN_OPEN_ITEM_EDITOR",
	IMAGES_UPDATED_ON_NODE: "LAMADMIN_IMAGES_UPDATED_ON_NODE",
	NODE_UPDATED: "LAMADMIN_NODE_UPDATED",
	JSON_PARSE_ERROR: "LAMADMIN_JSON_PARSE_ERROR",
	NODE_DELETED: "LAMADMIN_NODE_DELETED",
	
	dispatchEvent:function(p_eventType,p_eventObject){
		var eventType = p_eventType;
		var eventObject = p_eventObject;
		LamadminModel.tracer.log("EVENT DISPATCHED:" + eventType);
		$(document).trigger(eventType,[eventObject]);
	},
	subscribe:function(event_type,callBack){
		$(document).on(event_type,callBack);
	},
	unSubscribe:function(event_type,callBack){
		$(document).off(event_type,callBack);
	}
}
