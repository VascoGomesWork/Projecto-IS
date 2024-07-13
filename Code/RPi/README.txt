Execution steps to START PARKING LOOK UP IN RPI:

1 - Run broker:
    1.1 - execute the command:
        $ mosquitto -c mosquitto.conf (start broker)
        $ python mainMosquitto.py     (code running in RPI)
        
        mosquitto user -> park
        mosquitto pass -> park123

2 - Run fastApi:
    2.1 - execute the command 
        $ uvicorn mainFastApiIS:app --host 0.0.0.0 --port 8000 --reload (testing)
        $ uvicorn mainFastApiIS:app --host 0.0.0.0 --port 8000        (prd)

2 - Run node-wot:
    2.1 - execute the command 
        $ uvicorn mainFastApiIS:app --host 0.0.0.0 --port 8000 --reload (testing)


IMPORTANT INFORMATION:

For this project the firewall is opened in 3 ports:

	1 - One port to wireguard comunication (SSH propose) - port 51820/udp;
	2 - One port to real vnc comunication (VNC propose)  - port 5900/tcp;
	3 - One port to API comunications (FastApi propose)  - port 8877/tcp;
	
Command line help:

	1 - add port	: sudo firewall-cmd --zone=public --add-port=8877/tcp --permanent
	2 - rmv port	: sudo firewall-cmd --zone=public --remove-port=8877/tcp --permanent
	3 - list ports	: sudo firewall-cmd --list-ports
	4 - reload		: sudo firewall-cmd --reload


Mongo ATLA BD user anb pass:

	1 - user: joaomrpica
	2 - pass: ***************

Broker Mosquitto user anb pass:

	1 - user: park
	2 - pass: *********


OUTROS COMANDOS


1 - Validar se o servicço do mosquitto server está activo:
	- abrir um terminar;
	- correr a montagem de broker que está no ficheiro mosquitto.conf
		dentro da pasta server do trabalho:
			- mosquitto -c mosquitto.conf
			- comandos para o mosquitto:
				 - sudo service mosquitto stop
				 - sudo service mosquitto start
				 - sudo service mosquitto restart
	- sudo systemctl status mosquitto.service.

2 - Correr a acção de susbcribe:
	- abrir terminal na pasta do ficheiro;
	- correr o comando:
		- python3 client_sub.py
	
2 - Correr a acção de publish:
	- abrir terminal na pasta do ficheiro;
	- correr o comando:
		- python3 client_pub.py
 
 
Notas:
- https://www.youtube.com/watch?v=ebsXSCKsHeQ
