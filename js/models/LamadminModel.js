LamadminModel = {
	tracer:function(){},
	structureObjectTree:null,
	structureObject:null,
	lamadminService:function(){},
	selectedItemObject:null,
	selectedItemIndex:0,
	itemEditorView:null,
	IMAGE_ADMIN_DIR_PATH: "../trunk/images/",
	IMAGE_THUMB_ADMIN_DIR_PATH: "../trunk/images/thumbnail/",
	encodeOU:function(p_inp){
	  p_inp = p_inp.replace(/ő/g,'#o#');
	  p_inp = p_inp.replace(/Ő/g,'#oo#');
	  p_inp = p_inp.replace(/ű/g,'#u#');
	  p_inp = p_inp.replace(/Ű/g,'#uu#');
	
	  return p_inp;	
	},
	decodeOU:function(p_inp){
	  p_inp = p_inp.replace(/#o#/g,'ő');
	  p_inp = p_inp.replace(/#oo#/g,'Ő');
	  p_inp = p_inp.replace(/#u#/g,'ű');
	  p_inp = p_inp.replace(/#uu#/g,'Ű');
	
	  return p_inp;	
	}		
}
