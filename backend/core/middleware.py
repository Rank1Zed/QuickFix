from django.conf import settings


class SimpleCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            from django.http import HttpResponse

            response = HttpResponse()
        else:
            response = self.get_response(request)

        origin = request.headers.get("Origin", "")
        if self._origin_allowed(origin):
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
        elif not origin:
            response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PATCH, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-Admin-Token, Authorization"
        response["Access-Control-Max-Age"] = "86400"
        response["Vary"] = "Origin"
        return response

    @staticmethod
    def _origin_allowed(origin: str) -> bool:
        if not origin:
            return False
        if origin in getattr(settings, "CORS_ALLOWED_ORIGINS", []):
            return True
        if settings.DEBUG and origin.startswith(("http://127.0.0.1:", "http://localhost:")):
            return True
        return origin.startswith("https://") and origin.endswith(".vercel.app")
