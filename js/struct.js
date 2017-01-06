
function Idx_Info() {
	this.type = "";
	this.value = 0;
}

function Token_Info() {
	this.cid = 0;
	this.token = "";
	this.token_time = 0;
}

function Node_Info() {
	this.node_type = 0;
	this.node_id = 0;
	this.endpoint_gid = 0;
	this.max_session_count = 0;
	this.node_name = "";
	this.node_ip = "";
	this.endpoint_list = new Array();
}

function Endpoint_Info() {
	this.endpoint_type = 0;
	this.endpoint_gid = 0;
	this.endpoint_id = 0;
	this.endpoint_name = "";
	this.server_ip = "";
	this.server_port = 0;
	this.protocol_type = 0;
	this.heartbeat_timeout = 0;
}

function Node_Status() {
	this.node_type = 0;
	this.node_id = 0;
	this.node_name = "";
	this.start_time = 0;
	this.total_send = 0;
	this.total_recv = 0;
	this.send_per_sec = 0;
	this.recv_per_sec = 0;
	this.task_count = 0;
	this.msg_list = new Array();
	this.session_count = 0;
	this.cpu_percent = 0;
	this.vm_size = 0;
	this.vm_rss = 0;
	this.vm_data = 0;
	this.heap_total = 0;
	this.heap_used = 0;
	this.external_mem = 0;
}

function Msg_Count() {
	this.msg_id = 0;
	this.msg_count = 0;
}

function User_Info() {
	this.user_id = 0;
	this.user_name = "";
	this.account = "";
	this.level = 0;
	this.exp = 0;
	this.gender = 0;
	this.career = 0;
	this.create_time = 0;
	this.login_time = 0;
	this.logout_time = 0;
}

function Create_User_Info() {
	this.account = "";
	this.user_name = "";
	this.gender = 0;
	this.career = 0;
}
