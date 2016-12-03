/*
*	描述：route_user信息类
*	作者：张亚磊
*	时间：2016/12/2
*/

function Route_User() {
	this.im_cid = 0;
	this.sid = 0;
	this.user_info = new User_Info();
}

//玩家上线，加载数据
Route_User.prototype.login = function(im_cid, sid, user_info) {
	log_info('********im user login, im_cid:', im_cid, ' sid:', sid, ' user_id:', user_info.user_id);
	this.im_cid = im_cid;
	this.sid = sid;
	this.user_info = user_info;
	global.sid_route_user_map.set(this.sid, this);
	global.uid_route_user_map.set(this.user_info.user_id, this);
}

//玩家离线，保存数据
Route_User.prototype.logout = function() {
	log_info('********im user logout, user_id:', this.user_info.user_id, ' sid:', this.sid, " user_name:", this.user_info.user_name);
	global.sid_route_user_map.delete(this.sid);
	global.uid_route_user_map.delete(this.user_info.user_id);
}

Route_User.prototype.send_success_msg = function(msg_id, msg) {
	send_msg(Endpoint.ROUTE_SERVER, this.im_cid, msg_id, Msg_Type.NODE_S2C, this.sid, msg);
}

Route_User.prototype.send_error_msg = function(error_code) {
	var msg = new s2c_5();
	msg.error_code = error_code;
	send_msg(Endpoint.ROUTE_SERVER, this.im_cid, Msg.RES_ERROR_CODE, Msg_Type.NODE_S2C, this.sid, msg);
}
