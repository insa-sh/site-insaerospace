import os
import requests
from django.http import JsonResponse
from django.templatetags.static import static
from dotenv import load_dotenv

load_dotenv()

api_url = os.getenv('API_URL')


class SiteInfoMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        site_name = request.COOKIES.get("site_name")
        favicon = request.COOKIES.get("favicon")
        site_description = request.COOKIES.get("site_description")

        if not site_name or not favicon or not site_description:
            api_token = os.getenv('API_TOKEN')
            headers = {
                'Authorization': f'Bearer {api_token}'
            }
            try:
                r = requests.get(f"{api_url}/api/global", headers=headers)
                r.raise_for_status()
                data = r.json()

                # Access the nested data to get the site name, favicon URL, and description
                site_data = data.get("data", {})
                site_name = site_data.get("siteName") or "INSAerospace"
                favicon_info = site_data.get("favicon") or {}
                favicon_path = favicon_info.get("url")
                if favicon_path and favicon_path is not None:
                    favicon = f'{api_url}{favicon_path}'
                else:
                    favicon = static("/images/logo/favicon.svg")
                site_description = site_data.get("siteDescription") or "INSAerospace, c'est l'association de passionnés d'aérospatiale et d'astronomie de l'INSA Haut-de-France !"
            except requests.exceptions.RequestException:
                # SI l'API est down, on utilise la valeur par défaut
                site_name = "INSAerospace"
                favicon = static("/images/logo/favicon.svg")
                site_description = "INSAerospace, c'est l'association de passionnés d'aérospatiale et d'astronomie de l'INSA Haut-de-France ! "

            # Add site_name, favicon, and site_description to the request context
            request.site_name = site_name
            request.favicon = favicon
            request.site_description = site_description

            # Create the response object and set cookies
            response = self.get_response(request)
            response.set_cookie("site_name", site_name, max_age=86400)  # Expires in 1 day
            response.set_cookie("favicon", favicon, max_age=86400)
            response.set_cookie("site_description", site_description, max_age=86400)
            return response

        # If cookies are present, use them
        request.site_name = site_name
        request.favicon = favicon
        request.site_description = site_description

        response = self.get_response(request)
        return response