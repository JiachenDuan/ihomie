var paypalApiUrl = "https://api.sandbox.paypal.com"
var clientId = "Add3LX8D--vVVxlK5uYNecoLPHQs5p6CRkuWGIMQ0CFKkUc1Msskh-8WFds0SP0eV75QFx9aMhHpxxlm"
var secret = "EJha7cYA-_t_Od--8lHe9XLiSf1bOqreT7_1OyfmTdWFOw55LiBRttIBv57a7wjGwOgTPcXrae0lpZqR"

var getAccessToken = function(onError) {
  var paypalToken = $resource(paypalApiUrl + "/v1/oauth2/token")
  paypalToken.get().$promise
  return token
}

var payment = function(payer, onError) {
  var accessTokenPromise = getAccessToken(paypalApiUrl, onError)
  return redirectUrl
}
