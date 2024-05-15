from intasend import APIService

token = "ISSecretKey_test_15c8d49b-c0d6-4b12-8331-1fa2ea6dd160"
publishable_key = "ISPubKey_test_73158406-58db-43d2-8b6d-4e1c2b391929"
service = APIService(token=token, publishable_key=publishable_key, test=True)




token = "YOUR-API-TOKEN"
service = APIService(token="token")

response = service.chargebacks.create(invoice="<invoice-id>", amount=50, reason = "fraud", reason_details = "fraud")
print(response)

publishable_key = "ISPubKey_test_73158406-58db-43d2-8b6d-4e1c2b391929"

service = APIService(publishable_key=publishable_key)

response = service.collect.mpesa_stk_push(phone_number=2547.,
                                  email="joe@doe.com", amount=15, narrative="Purchase")

print(response)

response = service.collect.status(invoice_id="<invoice-id>")
print(response)