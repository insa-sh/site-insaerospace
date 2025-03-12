import os
import requests
from django.http import JsonResponse

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
            response = requests.get("http://localhost:1337/api/global?populate=*", headers=headers)
            if response.status_code == 200:
                data = response.json()

                # Access the nested data to get the site name and favicon URL
                site_data = data.get("data", {})
                site_name = site_data.get("siteName") or "INSAerospace"
                favicon_info = site_data.get("favicon") or {}
                favicon_path = favicon_info.get("url")
                if favicon_path:
                    favicon = f'http://localhost:1337{favicon_path}'
                else:
                    favicon = ""

                # Add site_name and favicon to the request context
                request.site_name = site_name
                request.favicon = favicon

                # Create the response object first
                response = self.get_response(request)
                response.set_cookie("site_name", site_name, max_age=86400)  # Expires in 1 day
                response.set_cookie("favicon", favicon, max_age=86400)
                return response

        # Add site_name and favicon to the request context if cookies are already set
        request.site_name = site_name
        request.favicon = favicon

        response = self.get_response(request)
        return response