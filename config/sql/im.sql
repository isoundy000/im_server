CREATE DATABASE IF NOT EXISTS `im` DEFAULT CHARACTER SET utf8;
USE im

DROP TABLE IF EXISTS `idx`;
CREATE TABLE `idx` (
	type varchar(120) NOT NULL default '',
	value int(11) NOT NULL default '0',
	PRIMARY KEY (type)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
	user_id bigint(20) NOT NULL default '0',
	user_name varchar(120) NOT NULL default '',
	account varchar(120) NOT NULL default '',
	level int(11) NOT NULL default '0',
	exp int(11) NOT NULL default '0',
	gender int(11) NOT NULL default '0',
	career int(11) NOT NULL default '0',
	create_time int(11) NOT NULL default '0',
	login_time int(11) NOT NULL default '0',
	logout_time int(11) NOT NULL default '0',
	PRIMARY KEY (user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
