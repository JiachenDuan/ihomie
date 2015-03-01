var PaypalApiUrl = "https://api.sandbox.paypal.com"
var PaypalClientId = "Add3LX8D--vVVxlK5uYNecoLPHQs5p6CRkuWGIMQ0CFKkUc1Msskh-8WFds0SP0eV75QFx9aMhHpxxlm"
var PaypalSecret = "EJha7cYA-_t_Od--8lHe9XLiSf1bOqreT7_1OyfmTdWFOw55LiBRttIBv57a7wjGwOgTPcXrae0lpZqR"

var GetAccessToken = function() {
  var auth = Base64.encode(PaypalClientId + ":" + PaypalSecret);
  var Token = $resource(PaypalApiUrl + "/v1/oauth2/token:grant_type", {
    "grant_type": "client_credentials",
  }, {
    post: {
      headers: {
        "Authorization": "Basic " + auth,
        "Accept": "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      isArray: false,
    },
  });
  return Token.post().$promise;
}

var Payment = function(amount, succeedUrl, cancelUrl, onError) {
  getAccessToken().then(function(token) {
    var Payment = $resource(PaypalApiUrl + "/v1/payments/payment", {}, {
      post: {
        headers: {
          "Authorization": token.token_type + " " + token.access_token,
          "Content-Type": "application/json",
        },
        isArray: false,
      },
    });
    Payment.post({
      "intent": "sale",
      "payer": {"payment_method": "paypal"},
      "redirect_urls": {"return_url": succeedUrl, "cancel_url": cancelUrl},
      "transactions": [{"amount": {"total": amount, "currency": "USD"}, "description": "Donation to homeless"}],
    }).$promise.then(function(payment) {
      for (var i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel == "approval_url") {
          window.location.replace(payment.links[i].href);
          return;
        }
      }
    }, function(resp) {
      onError();
    });
  }, function(resp) {
    onError();
  });
}

var Base64 = function() {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
  
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
  
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
  
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
  
            return output;
        },
  
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
  
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
  
                output = output + String.fromCharCode(chr1);
  
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
  
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
  
            } while (i < input.length);
  
            return output;
        }
    };
}();
