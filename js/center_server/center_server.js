/*
*	描述：center_server脚本
*	作者：张亚磊
*	时间：2016/12/01
*/

function init(node_info) {
    log_info('center_server init, node_type:', node_info.node_type, ' node_id:', node_info.node_id, ' node_name:', node_info.node_name);
    global.node_info = node_info;
    global.timer.init();
}

function on_hotupdate(file_path) { }

function on_drop(cid) { }

function on_msg(msg) {
	log_debug('center_server on_msg, cid:',msg.cid,' msg_type:',msg.msg_type,' msg_id:',msg.msg_id,' sid:', msg.sid);
	
	if (msg.msg_type == Msg_Type.TCP_C2S) {
		switch(msg.msg_id) {
		    case Msg.REQ_SELECT_IM:
			    select_im(msg);
			    break;	
		    default:
			    log_error('center_server process client msg, msg_id not exist:', msg.msg_id);
			    break;
		}
	} 
	else if (msg.msg_type == Msg_Type.NODE_MSG) {
		switch(msg.msg_id) {
		    case Msg.SYNC_NODE_INFO:
			    set_node_info(msg);
			    break;		
		    case Msg.SYNC_IM_CENTER_VERIFY_TOKEN:
			    verify_token(msg);
			    break;
		        case Msg.SYNC_IM_CENTER_LOGOUT:
		        global.sid_set.delete(msg.sid);
			    break;
		    default:
			    log_error('center_server process node msg, msg_id not exist:', msg.msg_id);
			    break;
		}	
	}
}

function on_tick(timer_id) {
    var timer_handler = global.timer.get_timer_handler(timer_id);
	if (timer_handler != null) {
		timer_handler();
	}
}

function on_close_session(account, cid, error_code) {	
    global.account_token_map.delete(account);
    if (error_code != Error_Code.RET_OK) {
        var msg = new Object();
        msg.error_code = error_code;
        send_msg(Endpoint.CENTER_CLIENT_SERVER, cid, Msg.RES_ERROR_CODE, Msg_Type.TCP_S2C, 0, msg);
    }
	//关闭客户端网络层链接
	close_client(Endpoint.CENTER_CLIENT_SERVER, cid);	
}

function select_im(msg) {
    if (global.account_token_map.get(msg.account)) {
		log_error('account in center_server:', msg.account);
		return on_close_session(msg.account, msg.cid, Error_Code.DISCONNECT_RELOGIN);
	}

	var token_info = new Object();
	token_info.cid = msg.cid;
	token_info.token = generate_token(msg.account);
	token_info.token_time = util.now_sec;
	global.account_token_map.set(msg.account, token_info);
	
    //根据账号hash值选择gate
	var hash_value = hash(msg.account);
	var im_len = global.im_list.length;
	var index = hash_value % im_len;
	var im_info = global.im_list[index];
	var msg_res = new Object();
	for (var i = 0; i < im_info.endpoint_list.length; ++i) {
	    if (im_info.endpoint_list[i].endpoint_gid == im_info.endpoint_gid &&
            im_info.endpoint_list[i].endpoint_id == Endpoint.IM_CLIENT_SERVER) {
	        msg_res.server_ip = im_info.endpoint_list[i].server_ip;
	        msg_res.server_port = im_info.endpoint_list[i].server_port;
	        break;
	    }
	}
	msg_res.token = token_info.token;
	send_msg(Endpoint.CENTER_CLIENT_SERVER, msg.cid, Msg.RES_SELECT_IM, Msg_Type.TCP_S2C, 0, msg_res);
}

function set_node_info(msg) {
    switch (msg.node_info.node_type) {
        case Node_Type.IM_SERVER:
            global.im_list.push(msg.node_info);
            break;
        case Node_Type.MASTER_SERVER:
            global.master_list.push(msg.cid);
            break;
        default:
            break;
    }
}

function verify_token(msg) {
    var token_info = global.account_token_map.get(msg.account);
	if (!token_info || token_info.token != msg.token) {		
		log_error('verify_token, token error, account:', msg.account, ' token:', msg.token);
		if (token_info) {
			on_close_session(msg.account, token_info.cid, Error_Code.TOKEN_ERROR);
		}
		var msg_res = new Object();
		msg_res.node_code = Error_Code.TOKEN_ERROR;
		return send_msg(Endpoint.CENTER_NODE_SERVER, msg.cid, Msg.SYNC_NODE_CODE, Msg_Type.NODE_MSG, msg.sid, msg_res);
	}

	++global.sid_idx;
	if (global.sid_idx > 4294967295) {
	    global.sid_idx = 0;
	}
	global.sid_set.add(global.sid_idx);
	var msg_res = new Object();
	msg_res.account = msg.account;
	msg_res.token = msg.token;
	msg_res.client_cid = msg.client_cid;
	send_msg(Endpoint.CENTER_NODE_SERVER, msg.cid, Msg.SYNC_IM_CENTER_VERIFY_TOKEN, Msg_Type.NODE_MSG, global.sid_idx, msg_res);
    //关闭session
	on_close_session(msg.account, token_info.cid, Error_Code.RET_OK);
}