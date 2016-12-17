/*
*	描述：route_server脚本
*	作者：张亚磊
*	时间：2016/12/01
*/

require("js/route_server/route_user.js");

function init(node_info) {
	log_info('route_server init, node_type:',node_info.node_type,' node_id:',node_info.node_id,' node_name:',node_info.node_name);
	global.node_info = node_info;
	global.timer.init();

	var msg = new Object();
    msg.node_info = node_info;
    for(var i = 0; i < node_info.endpoint_list.length; ++i) {
    	if(node_info.endpoint_list[i].endpoint_type == Endpoint_Type.CONNECTOR) {
    		send_msg(node_info.endpoint_list[i].endpoint_id, 0, Msg.SYNC_NODE_INFO, Msg_Type.NODE_MSG, 0, msg);		
    	}
    }
}

function on_hotupdate(file_path) { }

function on_drop(cid) { }

function on_msg(msg) {
	log_debug('route_server on_msg, cid:',msg.cid,' msg_type:',msg.msg_type,' msg_id:',msg.msg_id,' sid:', msg.sid);
	
	if (msg.msg_type == Msg_Type.NODE_C2S) {
		process_route_client_msg(msg);
	} else if (msg.msg_type == Msg_Type.NODE_MSG) {
		process_route_node_msg(msg);
	}
}

function on_tick(timer_id) {
    var timer_handler = global.timer.get_timer_handler(timer_id);
	if (timer_handler != null) {
		timer_handler();
	}
}

function send_route_msg(cid, msg_id, sid, msg) {
	send_msg(Endpoint.ROUTE_SERVER, cid, msg_id, Msg_Type.NODE_MSG, sid, msg);
}

function process_route_client_msg(msg) {
    var route_user = global.sid_route_user_map.get(msg.sid);
    if (!route_user) {
		return log_error('process_route_client_msg, route_player not exist, game_cid:', msg.cid, ' sid:', msg.sid, ' msg_id:', msg.msg_id);
	}
	
	switch(msg.msg_id) {
	default:
		log_error('process_route_client_msg, msg_id not exist:', msg.msg_id);
		break;
	}
}

function process_route_node_msg(msg) {
    switch (msg.msg_id) {
        case Msg.SYNC_NODE_CODE:
            log_error("process_route_node_msg, node_code:", msg.node_code, " sid:", msg.sid);
            break;
            case Msg.SYNC_IM_ROUTE_LOGIN_LOGOUT: {
		    //im通知route玩家上线下线
		    if (msg.login) {
		        var route_user = global.sid_route_user_map.get(msg.sid);
		        if (route_user == null) {
		            route_user = new Route_User();
			    }
		        route_user.login(msg.cid, msg.sid, msg.user_info);
		    } 
		    else {
		        var route_user = global.sid_route_user_map.get(msg.sid);
		        if (route_user) {
		            route_user.logout();
			    }
		    }
		    break;
	    }
	    case Msg.SYNC_NODE_INFO:
	    	break;
	    default:
		    log_error('proceess_route_node_msg, msg_id not exist:', msg.msg_id);
		    break;
	}
}