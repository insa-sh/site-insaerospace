def site_name(request):
    site_name = request.COOKIES.get("site_name", "Nom du site par défaut")
    return {
        'site_name': site_name,
    }