import os
import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from dotenv import load_dotenv

load_dotenv()


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