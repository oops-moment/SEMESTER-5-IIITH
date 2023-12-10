from redis import Redis

rc = Redis(host='localhost', port=6379)

# print(rc.info())
# This will print information about the Redis server

rc.set('foo', ' bar')
# True 

print(rc.get('foo').decode('utf-8'))
# 'bar'