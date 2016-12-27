/*
*	描述：全局变量管理器
*	作者：张亚磊
*	时间：2016/12/01
*/

require("js/enum.js");
require("js/message.js");
require("js/config.js");
require("js/util.js");
require("js/timer.js");

//全局变量类
var global = function () {};

//进程节点信息
global.node_info = new Object();
//配置管理器
global.config = new Config();
global.config.init();
//定时器
global.timer = new Timer();

///////////////////center_server变量////////////////////////
//sid idx
global.sid_idx = 0;
//sid set
global.sid_set = new Set();
//im服务器列表
global.im_list = new Array();
//master cid列表
global.master_list = new Array();
//account--Token_Info
global.account_token_map = new Map();

///////////////////master_server变量////////////////////////
//node_id--master_cid
global.node_cid_map = new Map();
//node_id--node_status
global.node_status_map = new Map();

///////////////////im_server变量////////////////////////
//cid--Session
global.cid_session_map = new Map();
//sid--Session
global.sid_session_map = new Map();
//account--Session
global.account_session_map = new Map();
//sid--im_user
global.sid_im_user_map = new Map();
//user_id---im_user
global.uid_im_user_map = new Map();
//user_name---im_user
global.user_name_im_user_map = new Map();
//sid--Create_User_Info
global.sid_create_user_map = new Map();
//sid--logout_time
global.logout_map = new Map();

///////////////////public_server变量////////////////////////
//sid----route_user
global.sid_route_user_map = new Map();
//user_id---route_user
global.uid_route_user_map = new Map();