from opensdk.sdk import OpenSDK

host = "https://api.baobab.klaytn.net:8651"

sdk = OpenSDK(host)
eth_response = sdk.eth.syncing()

print(eth_response)