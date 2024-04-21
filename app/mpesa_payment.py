import requests, base64
from datetime import datetime
from os import environ

class MpesaPayment():
    HOST = "https://sandbox.safaricom.co.ke"
    
    def __init__(self, config, phone_number) -> None:
        self._phone_number = phone_number
        self._consumer_key = config.get("FLASK_MPESA_CONSUMER_KEY")
        self._consumer_secret = config.get("FLASK_MPESA_CONSUMER_SECRET")
        self._business_short_code = config.get("FLASK_MPESA_BUSINESS_SHORTCODE")
        self._passkey = config.get("FLASK_MPESA_PASSKEY")
        
    def get_auth(self):
        token = f"{self._consumer_key}:{self._consumer_secret}"
        return base64.b64encode(bytes(token, 'utf8')).decode("utf8")
        
        
    def authorization(self):
        endpoint="/oauth/v1/generate?grant_type=client_credentials"
        url = f"{self.HOST}{endpoint}"
        token = "Basic %s" % self.get_auth()
        
        response = requests.request("GET", url, headers = { 'Authorization': token })
        return response.content
        
    def stk_push(self, token, amount, callback_url, reference, description):
        endpoint="/mpesa/stkpush/v1/processrequest"
        url = f"{self.HOST}{endpoint}"
        
        passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        
        raw_password = f"{self._business_short_code}{passkey}{timestamp}"
        password = base64.b64encode(bytes(raw_password, "utf8")).decode("utf8")
        
        headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer %s' % token
        }
        
        payload = {
            "BusinessShortCode": self._business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": self._phone_number,
            "PartyB": self._business_short_code,
            "PhoneNumber": self._phone_number,
            "CallBackURL": callback_url,
            "AccountReference": reference,
            "TransactionDesc": description 
        }
        
        response = requests.request("POST", url, headers=headers, json=payload)
        return response.content