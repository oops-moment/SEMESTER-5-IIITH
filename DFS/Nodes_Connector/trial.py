from redis import Redis

rc = Redis(host='localhost', port=6379)

def store_latest_five_values(key, value):
    # List to store the values for the key
    key_list = f"{key}_list"
    
    # Add the value to the list
    rc.rpush(key_list, value)
    
    # Check if the list has more than 5 values
    if rc.llen(key_list) > 5:
        # Pop the first value from the list
        rc.lpop(key_list)
        print(f"Popped the first value for key '{key}' to store the latest 5 values.")

# Example usage:
key_example = 'common_key'
store_latest_five_values(key_example, 'value1')
store_latest_five_values(key_example, 'value2')
store_latest_five_values(key_example, 'value3')
store_latest_five_values(key_example, 'value4')
store_latest_five_values(key_example, 'value5')
store_latest_five_values(key_example, 'value6')

# Retrieve the latest 5 values for the key
latest_values = rc.lrange(f"{key_example}_list", 0, -1)
print(f"Latest 5 values for key '{key_example}': {latest_values}")