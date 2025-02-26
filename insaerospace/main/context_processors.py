def site_info(request):
    site_name = request.COOKIES.get("site_name", "Defaut")
    favicon = request.COOKIES.get("favicon", "")
    return {
        'site_name': site_name,
        'favicon': favicon,
    }