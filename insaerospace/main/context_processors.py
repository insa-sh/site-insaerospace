def site_info(request):
    site_name = getattr(request, 'site_name', request.COOKIES.get("site_name", "default"))
    favicon = getattr(request, 'favicon', request.COOKIES.get("favicon", ""))
    site_description = getattr(request, 'site_description', request.COOKIES.get("site_description", "default"))
    return {
        'site_name': site_name,
        'favicon': favicon,
        'site_description': site_description,
    }