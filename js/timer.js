/*
*	描述：定时器系统
*	作者：张亚磊
*	时间：2016/12/01
*/

function Timer() {
	var timer_map = new Map();
	var timer_id = 1;
	
	this.init = function() {
	    //注册node_server定时器，时间间隔2s
	    this.register_timer(2000, 0, this.node_server_handler);

	    switch(global.node_info.node_type) {
		case Node_Type.CENTER_SERVER: {
			//注册清除token定时器，时间间隔2s
		    this.register_timer(2000, 0, this.center_token_handler);
			break;
		}
		case Node_Type.IM_SERVER: {
			//注册玩家定时器，时间间隔500ms
		    this.register_timer(500, 0, this.im_user_handler);
			break;
		}
		default: {
		    break;
		}
		}
	}
	
	this.register_timer = function(interval, next_tick, handler) {
		register_timer(timer_id, interval, next_tick);
		timer_map.set(timer_id, handler);
		timer_id++;
	}

	this.get_timer_handler = function(timer_id) {
		return timer_map.get(timer_id);
	}
	
    /////////////////////////////////定时器处理函数/////////////////////////////////
	this.node_server_handler = function() {
	    switch(global.node_info.node_type) {
	        case Node_Type.CENTER_SERVER: {
	            for(var i = 0; i < global.master_list.length; ++i) {
	                util.sync_node_status(Endpoint.CENTER_NODE_SERVER, global.master_list[i], 0);
	            }
	            break;
	        }
	        case Node_Type.DATA_SERVER: {
	            util.sync_node_status(Endpoint.DATA_MASTER_CONNECTOR, 0, 0);
	            break;
	        }
	        case Node_Type.MASTER_SERVER: {
	            var node_status = util.get_node_status();
	            node_status.session_count = 0;
	            global.node_status_map.set(node_status.node_id, node_status);
	            break;
	        }
	        case Node_Type.ROUTE_SERVER: {
	            util.sync_node_status(Endpoint.ROUTE_MASTER_CONNECTOR, 0, global.sid_route_user_map.size);
	            break;
	        }
	        case Node_Type.IM_SERVER: {
	            util.sync_node_status(Endpoint.IM_MASTER_CONNECTOR, 0, global.sid_im_user_map.size);
	            break;
	        }
	        default: {
	            break;
	        }
	    }
	}

	this.center_token_handler = function() {
		var now = util.now_sec();
		global.account_token_map.forEach(function(value, key, map) {
			if (now - value.token_time >= 2) {
				on_close_session(key, value.cid, Error_Code.TOKEN_TIMEOUT);	
			}
		});
	}
	
	this.im_user_handler = function() {
		var now = util.now_sec();
		for (var value of global.uid_im_user_map.values()) {
  			value.tick(now);
		}
    }
}
