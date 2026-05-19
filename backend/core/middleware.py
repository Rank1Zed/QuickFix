class SimpleCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            from django.http import HttpResponse

            response = HttpResponse()
        else:
            response = self.get_response(request)

        response["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
