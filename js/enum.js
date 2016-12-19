/*
*	描述：枚举类型
*	作者：张亚磊
*	时间：2016/12/01
*/

if (typeof Error_Code == "undefined") {
	var Error_Code = {};

	Error_Code.RET_OK				= 0;	//成功返回	
	Error_Code.NEED_CREATE_USER		= 1;	//需要创建用户
	Error_Code.DISCONNECT_SELF 		= 2;	//服务主动关闭
	Error_Code.DISCONNECT_RELOGIN	= 3;	//账号重登录
	Error_Code.DISCONNECT_NOLOGIN 	= 4;	//账号没有登录
	Error_Code.TOKEN_ERROR			= 5;	//token错误
	Error_Code.TOKEN_TIMEOUT		= 6;	//token到期
	Error_Code.CLIENT_PARAM_ERROR 	= 7;	//客户端参数错误
	Error_Code.CONFIG_ERROR 		= 8;	//配置文件错误
	Error_Code.GENERATE_ID_ERROR 	= 9;	//生成id错误
	Error_Code.USER_DATA_ERROR	    = 10;	//玩家数据错误
	Error_Code.USER_NOT_EXIST 	    = 11;	//玩家不存在
	Error_Code.USER_KICK_OFF 		= 12;	//玩家被踢下线
}

if (typeof Msg_Type == "undefined") {
	var Msg_Type = {};
	Msg_Type.TCP_C2S	= 1;	//客户端发到服务器的消息
	Msg_Type.TCP_S2C	= 2;	//服务器发到客户端的消息
	Msg_Type.NODE_C2S   = 3;	//客户端经过gate中转发到服务器的消息
	Msg_Type.NODE_S2C   = 4;	//服务器经过gate中转发到客户端的消息
	Msg_Type.NODE_MSG   = 5;	//服务器进程节点间通信的消息
	Msg_Type.DATA_MSG   = 6;    //经过data中转发到data子进程的消息
	Msg_Type.HTTP_MSG	= 7;	//http消息
}

if (typeof Node_Type == "undefined") {
	var Node_Type = {};
	Node_Type.CENTER_SERVER = 1;
	Node_Type.DATA_SERVER	= 2;
	Node_Type.MASTER_SERVER	= 3;
	Node_Type.ROUTE_SERVER	= 4;
	Node_Type.IM_SERVER    = 5;
}

if (typeof Endpoint_Type == "undefined") {
	var Endpoint_Type = {};
	Endpoint_Type.CLIENT_SERVER = 1;	//接受客户端链接的server
	Endpoint_Type.SERVER 	= 2;		//接受内部节点连接的server
	Endpoint_Type.CONNECTOR	= 3;		//内部节点链接器
}

if (typeof Endpoint == "undefined") {
	var Endpoint = {};

	Endpoint.CENTER_CLIENT_SERVER	= 1;
	Endpoint.CENTER_NODE_SERVER		= 2;
	
	Endpoint.DATA_SERVER            = 1;
	Endpoint.DATA_MASTER_CONNECTOR  = 2;
	Endpoint.DATA_CONNECTOR         = 1;
	
	Endpoint.MASTER_SERVER			= 1;
	Endpoint.MASTER_HTTP_SERVER		= 2;
	Endpoint.MASTER_CENTER_CONNECTOR= 3;
	
	Endpoint.ROUTE_SERVER			= 1;
	Endpoint.ROUTE_MASTER_CONNECTOR = 2;
	
	Endpoint.IM_CLIENT_SERVER      = 1;
	Endpoint.IM_CENTER_CONNECTOR   = 2;
	Endpoint.IM_DATA_CONNECTOR	   = 3;
	Endpoint.IM_MASTER_CONNECTOR   = 4;
	Endpoint.IM_ROUTE_CONNECTOR    = 5;
}

if (typeof Select_Data_Type == "undefined") {
    var Select_Data_Type = {};
    Select_Data_Type.INT64  = 1;     //查询int64类型值
    Select_Data_Type.STRING = 2;    //查询string类型值
}

if (typeof DB_Data_Type == "undefined") {
	var DB_Data_Type = {};
	DB_Data_Type.USER_DATA	= 1;    //用户数据
}

if (typeof DB_Id == "undefined") {
	var DB_Id = {};
	DB_Id.GAME	= 1001;	
}

if (typeof DB_Ret_Code == "undefined") {
    var DB_Ret_Code = {};
    DB_Ret_Code.RET_OK = 0;
    DB_Ret_Code.OPT_FAIL = -1;
    DB_Ret_Code.DATA_NOT_EXIST = -2;
}

if (typeof Save_Type == "undefined") {
	var Save_Type = {};
	Save_Type.SAVE_CACHE 		  = 1;    //保存缓存
	Save_Type.SAVE_DB_AND_CACHE   = 2;    //保存数据库和缓存
	Save_Type.SAVE_DB_CLEAR_CACHE = 3;    //保存数据库清空缓存
}