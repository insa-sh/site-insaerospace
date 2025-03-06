import os
import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from dotenv import load_dotenv

load_dotenv()


# def get_site_info(request):
#     site_name = request.COOKIES.get("site_name")
#     favicon = request.COOKIES.get("favicon")

#     if site_name and favicon:
#         return JsonResponse({"site_name": site_name, "favicon": favicon})

#     api_token = os.getenv('API_TOKEN')
#     headers = {
#         'Authorization': f'Bearer {api_token}'
#     }
#     response = requests.get("http://localhost:1337/api/global", headers=headers)
#     if response.status_code == 200:
#         data = response.json()
#         print(data)  # Print the content of the data variable for debugging

#         site_name = data.get("site_name", "Nom du site par défaut")
#         favicon = data.get("favicon", "")

#         response = JsonResponse({"site_name": site_name, "favicon": favicon})
#         response.set_cookie("site_name", site_name, max_age=86400)  # Expires in 1 day
#         response.set_cookie("favicon", favicon, max_age=86400)
#         return response

#     return JsonResponse({"error": "Impossible de récupérer les données"}, status=500)


# Récupérer les projets
@require_GET
def fetch_projets(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }

    slug_projet = request.GET.get('slug')

    if slug_projet:
        response = requests.get(f'http://127.0.0.1:1337/api/projets?populate=*&filters[slug][$eq]={slug_projet}', headers=headers)
    else:
        response = requests.get('http://127.0.0.1:1337/api/projets?populate=*', headers=headers)
        
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching articles'}, status=500)

@require_GET
def fetch_articles(request):
    api_token = os.getenv('API_TOKEN')
    headers = {'Authorization': f'Bearer {api_token}'}
    slug = request.GET.get('slug')
    projet = request.GET.get('projet')


    if slug and projet:
        url = f'http://127.0.0.1:1337/api/articles?populate=*&filters[slug][$eq]={slug}&filters[projet][slug][$eq]={projet}'
    elif slug and not projet:
        url = f'http://127.0.0.1:1337/api/articles?populate=*&filters[slug][$eq]={slug}'
    elif projet and not slug:
        url = f'http://127.0.0.1:1337/api/articles?populate=*&filters[projet][slug][$eq]={projet}&sort=publishedAt:asc'
        # url = f'http://127.0.0.1:1337/api/articles?populate=*'
    else:
        return JsonResponse({'error': 'a slug or projet parameter is required'}, status=400)

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return JsonResponse({'error': 'Error fetching articles'}, status=500)

    
    return JsonResponse(response.json())


    




# Create your views here.
def accueil(request):
    return render(request, 'main/accueil.html')

def nosProjets(request):
    return render(request, 'main/nos-projets.html')

def article_detail(request, slug_project, slug_article):
    return render(request, 'main/article_detail.html')

def project_detail(request, slug_project):
    return render(request, 'main/project_detail.html')

def nosMembres(request):
    return render(request, 'main/nos-membres.html')
