import os
import requests
from django.http import JsonResponse
from django.templatetags.static import static

class SiteInfoMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        site_name = request.COOKIES.get("site_name")
        favicon = request.COOKIES.get("favicon")

        if not site_name or not favicon:
            api_token = os.getenv('API_TOKEN')
            headers = {
                'Authorization': f'Bearer {api_token}'
            }
            try:
                r = requests.get("http://localhost:1337/api/global", headers=headers)
                r.raise_for_status()
                data = r.json()

                # Access the nested data to get the site name and favicon URL
                site_data = data.get("data", {})
                site_name = site_data.get("siteName") or "INSAerospace"
                favicon_info = site_data.get("favicon") or {}
                favicon_path = favicon_info.get("url")
                if favicon_path and favicon_path is not None:
                    favicon = f'http://localhost:1337{favicon_path}'
                else:
                    favicon = static("/images/logo/favicon.svg")
            except requests.exceptions.RequestException:
                # SI l'API est down, on utilise la valeur par défaut, une image sockée côté frontend
                site_name = "INSAerospace"
                favicon = static("/images/logo/favicon.svg")

            # Add site_name and favicon to the request context
            request.site_name = site_name
            request.favicon = favicon

            # Create the response object and set cookies
            response = self.get_response(request)
            response.set_cookie("site_name", site_name, max_age=86400)  # Expires in 1 day
            response.set_cookie("favicon", favicon, max_age=86400)
            return response

        # If cookies are present, use them
        request.site_name = site_name
        request.favicon = favicon

        response = self.get_response(request)
        return response