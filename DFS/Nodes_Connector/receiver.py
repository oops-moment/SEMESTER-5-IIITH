import socket
import threading
from redis import Redis
import json

rc = Redis(host='localhost', port=6379)

IP = socket.gethostbyname(socket.gethostname())
PORT = 5568
ADDR = (IP, PORT)
SIZE = 1024
FORMAT = "utf-8"
DISCONNECT_MSG = "!DISCONNECT"
MAX_DATA_LENGTH = 5

def store_values(key, value):
    key_list = key
    rc.rpush(key_list, value)
    
    if rc.llen(key_list) > 5:
        rc.lpop(key_list)
        print(f"Popped the first value for key '{key}' to store the latest 5 values.")   


def handle_client(conn, addr):
    print(f"[NEW CONNECTION] {addr} connected.")

    connected = True
    while connected:
        data = conn.recv(SIZE).decode(FORMAT)
        if data == DISCONNECT_MSG:
            connected = False

        keyy=addr[0]
        # print("before",data)
        # valuee=json.dumps(data)
        # print("after",data)
        store_values(keyy,data)
        conn.send(data.encode(FORMAT))
        print(rc.lrange(keyy, 0, -1))
    conn.close()

def main():
    print("[STARTING] Server is starting...")
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(ADDR)
    server.listen()
    print(f"[LISTENING] Server is listening on {IP}:{PORT}")

    while True:
        conn, addr = server.accept()
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
        print(f"[ACTIVE CONNECTIONS] {threading.activeCount() - 1}")

if __name__ == "__main__":
    main()
