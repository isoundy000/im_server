#!/bin/bash
pid=(`ps aux | grep 'daemon_server' | grep -v 'grep' | awk '{print $2}'`)
if [ ! -n "$pid"  ]
then
	echo daemon_server process not found.
else
	kill $pid
	echo daemon_server process[$pid] be killed.
fi

killall chat_server

de_servers=(`ps aux | grep 'chat_server' | grep -v 'grep' | awk -F" " '{print \$2;}'`)
count=${#chat_servers[*]}

if [ $count -gt 0 ]
then
	for((i=0;i<$count;i++))
	do
		kill ${chat_servers[$i]}
	done
else
	echo all chat_server process be killed
fi

ps aux | grep chat_server
