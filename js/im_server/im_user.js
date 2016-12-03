/*
*	描述：im_user类
*	作者：张亚磊
*	时间：2016/12/01
*/

function Session() {
    this.cid = 0;	        //client与im连接的cid
    this.sid = 0;			//全局唯一session_id				
    this.account = "";		//client帐号名
    this.last_hb_time = 0;  //上次心跳时间
    this.latency = 0;	    //上次心跳到本次心跳经过的时间
}

Session.prototype.on_heartbeat = function (msg) {
    this.last_hb_time = util.now_sec();
    this.latency = this.last_hb_time - msg.client_time;
    if (this.latency < 0) this.latency = 0;
    var msg_res = new s2c_1();
    msg_res.server_time = this.last_hb_time;
    send_msg(Endpoint.IM_CLIENT_SERVER, msg.cid, Msg.RES_HEARTBEAT, Msg_Type.S2C, 0, msg_res);
}

function Im_User() {
	this.save_data_tick = util.now_sec();
	this.cid = 0;	//client与im连接的cid
	this.sid = 0;   //全局唯一session_id
	this.is_change = false;
	this.user_info = new User_Info();
}

//玩家上线，加载数据
Im_User.prototype.login = function(cid, sid, user_info) {
	log_info('********im user login, user_id:', user_info.user_id, ' user_name:', user_info.user_name, ' sid:', sid);
	this.cid = cid;
	this.sid = sid;
	this.user_info = user_info;
	this.user_info.login_time = util.now_sec();
	
	this.sync_login_to_client();
	this.sync_login_logout_to_route(true);
	global.sid_im_user_map.set(this.sid, this);
	global.uid_im_user_map.set(this.user_info.user_id, this);
	global.user_name_im_user_map.set(this.user_info.user_name, this);
}

//玩家离线，保存数据
Im_User.prototype.logout = function() {
    log_info('********im user logout, user_id:', this.user_info.user_id, " user_name:", this.user_info.user_name, ' sid:', this.sid);
	this.user_info.logout_time = util.now_sec();
	global.logout_map.set(this.sid, this.user_info.logout_time);
	
	this.sync_user_data_to_db(true);
	this.sync_login_logout_to_route(false);
	global.sid_im_user_map.delete(this.sid);
	global.uid_im_user_map.delete(this.user_info.user_id);
	global.user_name_im_user_map.delete(this.user_info.user_name);
}

Im_User.prototype.tick = function(now) {
	//同步玩家数据到数据库
	if(this.is_change){
	    if (now - this.save_data_tick >= 30) {
			this.sync_user_data_to_db(false);
			this.save_data_tick = now;
		}
	}
}

Im_User.prototype.send_success_msg = function(msg_id, msg) {
	this.is_change = true;
	send_msg(Endpoint.IM_CLIENT_SERVER, this.cid, msg_id, Msg_Type.S2C, this.sid, msg);
}

Im_User.prototype.send_error_msg = function(error_code) {
	var msg = new s2c_5();
	msg.error_code = error_code;
	send_msg(Endpoint.IM_CLIENT_SERVER, this.cid, Msg.RES_ERROR_CODE, Msg_Type.S2C, this.sid, msg);
}

Im_User.prototype.sync_login_to_client = function() {
	var msg = new s2c_4();
	msg.user_info = this.user_info;
	this.send_success_msg(Msg.RES_USER_INFO, msg);
}

Im_User.prototype.sync_login_logout_to_route = function(login) {
	var msg = new node_5();
	msg.login = login;
	msg.user_info = this.user_info;
	send_msg(Endpoint.IM_ROUTE_CONNECTOR, 0, Msg.SYNC_IM_ROUTE_LOGIN_LOGOUT, Msg_Type.NODE_MSG, this.sid, msg);
}

Im_User.prototype.sync_user_data_to_db = function(logout) {
	log_info('********sync_user_data_to_db,logout:', logout, ' user_id:', this.user_info.user_id, ' user_name:', this.user_info.user_name);
	var msg = new node_251();
	if(logout) {
		msg.save_type = Save_Type.SAVE_DB_CLEAR_CACHE;
	} else {
		msg.save_type = Save_Type.SAVE_CACHE;
	}
	msg.db_id = DB_Id.GAME;
	msg.struct_name = "User_Info";
	msg.data_type = DB_Data_Type.USER_DATA;
	msg.user_info = this.user_info;
	send_msg_to_db(Msg.SYNC_SAVE_DB_DATA, this.sid, msg);
	this.is_change = false;
}
