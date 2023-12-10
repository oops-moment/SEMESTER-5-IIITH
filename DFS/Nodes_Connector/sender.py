import socket
import psutil
import subprocess as sp
import shutil
import uuid
import json
import sys
import select
import uuid
from redis import Redis
import time
import GPUtil
import os

rc = Redis(host='localhost', port=6379)

IP = socket.gethostbyname(socket.gethostname())
PORT = 5568
ADDR = (IP, PORT)
SIZE = 1024
FORMAT = "utf-8"
DISCONNECT_MSG = 'q'

def get_gpu_memory():
    command = "nvidia-smi --query-gpu=memory.free --format=csv"
    memory_free_info = sp.check_output(
        command.split()).decode('ascii').split('\n')[:-1][1:]
    memory_free_values = [int(x.split()[0])
                          for i, x in enumerate(memory_free_info)]
    return memory_free_values

def get_total_ram():
    command = "free --giga -h -t | grep \"Mem\" | awk '{print $2}'"
    result = sp.check_output(command, shell=True, text=True)
    
    # Convert the result to an integer and return
    return result.strip()

def get_network_interface_count():
    command = "sudo lshw -class network | grep 'logical name' | wc -l"
    
    # Run the command and capture the output
    result = sp.check_output(command, shell=True, text=True)
    
    # Convert the result to an integer and return
    return int(result.strip())

def get_available_GPUs():
    available_gpus = GPUtil.getAvailable()
    num_gpus = len(available_gpus)
    return num_gpus

def get_free_cpus():
    total_cpus = os.cpu_count()
    used_cpus = psutil.cpu_count(logical=False)  # Exclude hyperthreading
    free_cpus = total_cpus - used_cpus
    return free_cpus


def get_node_status():
    cpu_usage = psutil.cpu_percent(interval=2)
    cpu_usage_per_processor = psutil.cpu_percent(interval=2, percpu=True)

    # mpstat_command = "mpstat -P ALL 2 1 | awk 'NF>2 && $1 ~ /CPU/ {print $3}'"

    # cpu_usage_per_processor = sp.check_output(
    #     mpstat_command, shell=True).decode('utf-8').strip().split('\n')[1:]
    # cpu_usage_per_processor = [float(usage) for usage in cpu_usage_per_processor]
    
    cpu_count = len(cpu_usage_per_processor)
    free_gpu_memory = get_gpu_memory()  # In MB
    gpu_count = len(free_gpu_memory)
    free_ram = psutil.virtual_memory().available / (1024 ** 3)  # Convert Bytes to GB

    path = '/'
    stat = shutil.disk_usage(path)
    free_disk_space = stat.free / (1024 ** 3)  # Convert Bytes to GB
    topic = str(hex(uuid.getnode()))

    folders = ['/usr', '/bin', '/etc', '/tmp',
               '/lib', '/root']  # List of folders to monitor
    folder_memory_usage = {}

    for folder in folders:
        command = f"sudo du -h --max-depth=0 {folder}"
        memory_usage_info = sp.check_output(
            command, shell=True).decode('utf-8').strip().split('\t')
        memory_usage = memory_usage_info[0]
        folder_memory_usage[folder] = memory_usage

    topic = str(hex(uuid.getnode()))

    command_ethernet_ports = "lspci | grep -i ethernet | wc -l"

    free_cpu_count = "lscpu | grep '^On-line\|Thread(s) per core\|Core(s) per socket\|Socket(s)'"
    free_cpu_count = get_free_cpus()

    free_gpu_count = "nvidia-smi --query-gpu=memory.free --format=csv"
    free_gpu_count = get_available_GPUs()

    network_card = get_network_interface_count()

    # ethernet_port = "sudo lshw -class network | grep -A 6 ""Ethernet" 
    ethernet_port = int(sp.check_output(command_ethernet_ports, shell=True, text=True).strip())



    total_ram = get_total_ram()

    response = {
        'topic': topic,
        'stat': 1,

        'overall_cpu_usage': cpu_usage,
        'cpu_usage_per_process': cpu_usage_per_processor,

        'total_cpu_count': cpu_count,
        'free_cpu_count': free_cpu_count,

        'total_gpu_count': gpu_count,
        'free_gpu_count': free_gpu_count,

        'free_gpu_memory': free_gpu_memory,
        'total_ram': total_ram,
        'free_ram': free_ram,

        'free_disk_space': free_disk_space,
        'folder_memory_usage': folder_memory_usage,

        'network_card' : network_card,
        'ethernet_port' : ethernet_port
    }

    return response


def main():
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(ADDR)
    print(f"[CONNECTED] Client connected to server at {IP}:{PORT}")

    connected = True
    while connected:
        # msg = input("> ")
        msg = get_node_status()
        # msg['status'] = 1
        msg_json = json.dumps(msg)
        print(msg)
        client.send(msg_json.encode(FORMAT))
        # client.send(msg)

        # if msg == DISCONNECT_MSG:
        #     connected = False
        #     break
        # # else:
        # #     msg = client.recv(SIZE).decode(FORMAT)
        # #     print(f"[SERVER] {msg}")

        print("Type 'q' to quit")
        # Wait for input for 2 seconds
        rlist, _, _ = select.select([sys.stdin], [], [], 2)
        print("rlsit", rlist)
        if rlist:
            user_input = sys.stdin.readline().strip()
            if user_input.lower() == DISCONNECT_MSG:
                print("Hello")
                msg['stat'] = 0

                # Send the data one more time before disconnecting
                msg_json = json.dumps(msg)
                client.send(msg_json.encode(FORMAT))
                time.sleep(2)

                print("Connection closed by user.")
                connected = False
                break
                # Close the connection after sending the updated message

        else:
            print("No input. Continuing...")


if __name__ == "__main__":
    main()
