
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
	this.receive_timeout = 0;
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

function node_255() {
	this.struct_name = "";
	this.key_index = 0;
}

function node_253() {
	this.struct_name = "";
	this.key_index = 0;
	this.data_type = 0;
}

function node_252() {
	this.db_id = 0;
	this.struct_name = "";
	this.index_list = new Array();
}

function node_251() {
	this.save_type = 0;
	this.vector_data = false;
	this.db_id = 0;
	this.struct_name = "";
	this.user_info = new User_Info();
	this.data_type = 0;
}

function node_250() {
	this.db_id = 0;
	this.struct_name = "";
	this.key_index = 0;
	this.data_type = 0;
}

function node_249() {
	this.type = "";
	this.id = 0;
}

function node_248() {
	this.type = "";
}

function node_247() {
	this.db_id = 0;
	this.struct_name = "";
	this.query_name = "";
	this.query_value = 0;
	this.data_type = 0;
}

function node_246() {
	this.db_id = 0;
	this.struct_name = "";
	this.condition_name = "";
	this.condition_value = "";
	this.query_name = "";
	this.query_type = "";
	this.data_type = 0;
}

function node_6() {
}

function node_5() {
	this.login = false;
	this.user_info = new User_Info();
}

function node_254() {
	this.struct_name = "";
	this.key_index = 0;
	this.data_type = 0;
}

function node_4() {
	this.account = "";
	this.token = "";
	this.client_cid = 0;
}

function node_3() {
	this.node_status = new Node_Status();
}

function node_2() {
	this.node_info = new Node_Info();
}

function node_1() {
	this.node_code = 0;
}

function http_201() {
	this.node_list = new Array();
}

function http_3() {
	this.file_list = new Array();
}

function http_2() {
}

function http_1() {
	this.node_type = 0;
	this.node_id = 0;
	this.endpoint_gid = 0;
	this.node_name = "";
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
	this.cpu_percent = 0;
	this.vm_size = 0;
	this.vm_rss = 0;
	this.vm_stk = 0;
	this.vm_exe = 0;
	this.vm_data = 0;
}

function s2c_5() {
	this.error_code = 0;
}

function c2s_5() {
	this.user_info = new Create_User_Info();
}

function s2c_4() {
	this.user_info = new User_Info();
}

function c2s_4() {
	this.account = "";
}

function s2c_3() {
}

function c2s_3() {
	this.account = "";
	this.token = "";
}

function s2c_2() {
	this.server_ip = "";
	this.server_port = 0;
	this.token = "";
}

function c2s_2() {
	this.account = "";
}

function s2c_1() {
	this.server_time = 0;
}

function c2s_1() {
	this.client_time = 0;
}
