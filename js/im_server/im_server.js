/*
*	描述：im_server脚本
*	作者：张亚磊
*	时间：2016/12/01
*/

require("js/im_server/im_user.js");

function init(node_info) {
	log_info('im_server init, node_type:',node_info.node_type,' node_id:',node_info.node_id,' node_name:',node_info.node_name);
	global.node_info = node_info;
	global.timer.init();

	var msg = new Object();
    msg.node_info = node_info;
    for(var i = 0; i < node_info.endpoint_list.length; ++i) {
    	if(node_info.endpoint_list[i].endpoint_type == Endpoint_Type.CONNECTOR
    		&& node_info.endpoint_list[i].endpoint_name != "im_data_connector") {
    		send_msg(node_info.endpoint_list[i].endpoint_id, 0, Msg.SYNC_NODE_INFO, Msg_Type.NODE_MSG, 0, msg);		
    	}
    }
}

function on_hotupdate(file_path) { }

function on_drop(cid) {
    var session = global.cid_session_map.get(cid);
	if (session) {	
		on_remove_session(session);
	}
}

function on_msg(msg) {
	log_debug('im_server on_msg, cid:',msg.cid,' msg_type:',msg.msg_type,' msg_id:',msg.msg_id,' sid:', msg.sid);
	
	if (msg.msg_type == Msg_Type.TCP_C2S) {
		process_im_client_msg(msg);
	}
	else if (msg.msg_type == Msg_Type.NODE_MSG) {
		process_im_node_msg(msg);
	}
	else if (msg.msg_type == Msg_Type.NODE_S2C) {
	    var im_user = global.sid_im_user_map.get(msg.sid);
	    if (im_user) {
	        send_msg(Endpoint.IM_CLIENT_SERVER, im_user.cid, msg.msg_id, msg.msg_type, msg.sid, msg);
	    }
	}
}

function on_tick(timer_id) {
    var timer_handler = global.timer.get_timer_handler(timer_id);
    if (timer_handler != null) {
        timer_handler();
    }
}

function send_msg_to_db(msg_id, sid, msg) {
    send_msg(Endpoint.IM_DATA_CONNECTOR, 0, msg_id, Msg_Type.NODE_MSG, sid, msg);
}

function on_add_session(session) {
    global.cid_session_map.set(session.cid, session);
    global.sid_session_map.set(session.sid, session);
    global.account_session_map.set(session.account, session);
	
	//通知client
	var msg_res = new Object();
	msg_res.account = session.account;
	send_msg(Endpoint.IM_CLIENT_SERVER, session.cid, Msg.RES_CONNECT_IM, Msg_Type.TCP_S2C, 0, msg_res);
}

function on_remove_session(session) {
	//通知center
    var msg = new Object();
    send_msg(Endpoint.IM_CENTER_CONNECTOR, 0, Msg.SYNC_IM_CENTER_LOGOUT, Msg_Type.NODE_MSG, session.sid, msg);
	
    global.cid_session_map.delete(session.cid);
    global.sid_session_map.delete(session.sid);
	global.account_session_map.delete(session.account);
	var im_user = global.sid_im_user_map.get(session.sid);
	if (im_user) {
	    im_user.logout();
	}
}

function on_close_session(cid, error_code) {
	var msg = new Object();
	msg.error_code = error_code;
	send_msg(Endpoint.IM_CLIENT_SERVER, cid, Msg.RES_ERROR_CODE, Msg_Type.TCP_S2C, 0, msg);
	//关闭客户端网络层链接
	close_client(Endpoint.IM_CLIENT_SERVER, cid);
}

function process_im_client_msg(msg) {
	switch(msg.msg_id) {
	    case Msg.REQ_HEARTBEAT: {
	        var session = global.cid_session_map.get(msg.cid);
	        if (session) {
	            session.on_heartbeat(msg);
		    } else {
			    on_close_session(msg.cid, Error_Code.DISCONNECT_NOLOGIN);
		    }
		    break;
	    }
	    case Msg.REQ_CONNECT_IM:
		    connect_im(msg);
		    break;
	    case Msg.REQ_FETCH_USER_INFO:
	        fetch_user_info(msg);
	        break;
	    case Msg.REQ_CREATE_USER:
	        create_user(msg);
	        break;
	    default:
		    log_error('process_im_client_msg, msg_id not exist:', msg.msg_id);
		    break;
	}
}

function process_im_node_msg(msg) {
	switch(msg.msg_id) {
	    case Msg.SYNC_NODE_CODE:
		    process_node_code(msg);
		    break;
	    case Msg.SYNC_IM_CENTER_VERIFY_TOKEN:
		    verify_token(msg);
		    break;
	    case Msg.SYNC_DB_RET_CODE:
	        process_db_ret_code(msg);
	        break;
	    case Msg.SYNC_RES_SELECT_DB_DATA:
	        res_select_db_data(msg);
	        break;
	    case Msg.SYNC_RES_GENERATE_ID:
	        res_generate_id(msg);
	        break;
	    case Msg.SYNC_SAVE_DB_DATA: {
	        var session = global.sid_session_map.get(msg.sid);
	        var im_user = new Im_User();
	        im_user.login(session.cid, msg.sid, msg.user_info);
	        break;
	    }
	    default:
	        log_error('process_im_node_msg, msg_id not exist:', msg.msg_id);
		    break;
	}
}

function connect_im(msg) {
	if (global.account_session_map.get(msg.account)) {
		log_error('account in gate server, ', msg.account);
		return on_close_session(msg.cid, Error_Code.DISCONNECT_RELOGIN);	
	}
	
	var msg_res = new Object();
	msg_res.account = msg.account;
	msg_res.token = msg.token;
	msg_res.client_cid = msg.cid;
	send_msg(Endpoint.IM_CENTER_CONNECTOR, 0, Msg.SYNC_IM_CENTER_VERIFY_TOKEN, Msg_Type.NODE_MSG, msg.cid, msg_res);
}

function process_node_code(msg) {
	switch (msg.node_code) {
	    case Error_Code.TOKEN_ERROR:
	        on_close_session(Error_Code.TOKEN_ERROR);
	        break;
	    default:
	        break;
	}
}

function verify_token(msg) {
	var session = new Session();
	session.cid = msg.client_cid;
	session.sid = msg.sid;
	session.account = msg.account;
	on_add_session(session);
}

function process_db_ret_code(msg) {
    switch (msg.opt_msg_id) {
        case Msg.SYNC_SELECT_DB_DATA: {
            if (msg.ret_code == DB_Ret_Code.DATA_NOT_EXIST && msg.query_name == "user_id") {
                var session = global.sid_session_map.get(msg.sid);
                var msg_res = new Object();
                msg_res.error_code = Error_Code.NEED_CREATE_USER;
                send_msg(Endpoint.IM_CLIENT_SERVER, session.cid, Msg.RES_ERROR_CODE, Msg_Type.TCP_S2C, msg.sid, msg_res);
            }
            else if (msg.ret_code == DB_Ret_Code.OPT_FAIL) {
                log_error('select db data fail, sid:', msg.sid);
                on_remove_session(msg.sid, Error_Code.USER_DATA_ERROR);
            }
            break;
        }
        case Msg.SYNC_SAVE_DB_DATA: {
            if (msg.struct_name == "User_Info") {
                global.logout_map.delete(msg.sid);
            }
            break;
        }
        default:
            break;
    }
}

function fetch_user_info(msg) {
    if (global.sid_im_user_map.get(msg.sid) || global.logout_map.get(msg.sid)) {
        log_error('relogin account:', msg.account);
        var session = sid_session_map.get(msg.sid);
        return on_remove_session(session, Error_Code.DISCONNECT_RELOGIN);
    }

    log_info('fetch_user_info, get table index from db, account:', msg.account, ' cid:', msg.cid, ' sid:', msg.sid);
    var session = global.cid_session_map.get(msg.cid);
    var msg_res = new Object();
    msg_res.db_id = DB_Id.GAME;
    msg_res.struct_name = "User_Info";
    msg_res.condition_name = "account";
    msg_res.condition_value = msg.account;
    msg_res.query_name = "user_id";
    msg_res.query_type = "int64";
    msg_res.data_type = Select_Data_Type.INT64;
    send_msg_to_db(Msg.SYNC_SELECT_DB_DATA, session.sid, msg_res);
}

function res_select_db_data(msg) {
    switch (msg.data_type) {
        case Select_Data_Type.INT64: {
            if (msg.query_name == "user_id" && msg.query_value > 0) {
                var msg_res = new Object();
                msg_res.db_id = DB_Id.GAME;
                msg_res.key_index = msg.query_value;
                msg_res.struct_name = "User_Info";
                msg_res.data_type = DB_Data_Type.USER_DATA;
                send_msg_to_db(Msg.SYNC_LOAD_DB_DATA, msg.sid, msg_res);
            }
            break;
        }
    }
}

function create_user(msg) {
    if (msg.user_info.account.length <= 0 || msg.user_info.user_name.length <= 0 || global.logout_map.get(msg.sid)) {
        log_error('create_user parameter invalid, account:', msg.user_info.account, ' user_name:', msg.user_info.user_name);
        var session = sid_session_map.get(msg.sid);
        return on_remove_session(session, Error_Code.CLIENT_PARAM_ERROR);
    }

    log_info('create_user, generate id from db, account:', msg.user_info.account, ' gate_cid:', msg.cid, ' sid:', msg.sid);
    //将创建用户信息保存起来，等待从db生成user_id后，将用户信息保存到db
    var session = global.cid_session_map.get(msg.cid);
    global.sid_create_user_map.set(session.sid, msg.user_info);
    var msg_res = new Object();
    msg_res.type = "user_id";
    send_msg_to_db(Msg.SYNC_GENERATE_ID, session.sid, msg_res);
}

function res_generate_id(msg) {
    if (msg.id <= 0) {
        var session = global.sid_session_map.get(msg.sid);
        var msg_res = new Object();
        msg_res.error_code = Error_Code.GENERATE_ID_ERROR;
        send_msg(Endpoint.IM_CLIENT_SERVER, session.cid, Msg.RES_ERROR_CODE, Msg_Type.TCP_S2C, msg.sid, msg_res);
    } else {
        //创建角色时候，既保存到缓存，又保存到db
        var msg_res = new Object();
        msg_res.save_type = Save_Type.SAVE_DB_AND_CACHE;
        msg_res.vector_data = false;
        msg_res.db_id = DB_Id.GAME;
        msg_res.struct_name = "User_Info";
        msg_res.data_type = DB_Data_Type.USER_DATA;
        var user_info = global.sid_create_user_map.get(msg.sid);
        msg_res.user_info = new Object();
        msg_res.user_info.user_id = msg.id;
        msg_res.user_info.account = user_info.account;
        msg_res.user_info.user_name = user_info.user_name;
        msg_res.user_info.level = 1;
        msg_res.user_info.exp = 0;
        msg_res.user_info.gender = user_info.gender;
        msg_res.user_info.career = user_info.career;
        msg_res.user_info.create_time = util.now_sec();
        msg_res.user_info.login_time = msg_res.user_info.create_time;
        msg_res.user_info.logout_time = 0;
        send_msg_to_db(Msg.SYNC_SAVE_DB_DATA, this.sid, msg_res);

        //成功登陆
        var session = global.sid_session_map.get(msg.sid);
        var im_user = new Im_User();
        im_user.login(session.cid, session.sid, msg_res.user_info);
    }
}