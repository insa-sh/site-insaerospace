import os
import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from dotenv import load_dotenv

load_dotenv()

@require_GET
def fetch_projets(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }
    response = requests.get('http://127.0.0.1:1337/api/articles?populate=*&filters[category][$null]=true', headers=headers)
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching articles'}, status=500)

@require_GET
def fetch_articles(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }
    slug = request.GET.get('slug')
    if not slug:
        return JsonResponse({'error': 'Slug parameter is required'}, status=400)

    # Récupérer l'article parent
    parent_url = f'http://127.0.0.1:1337/api/articles?populate=*&filters[slug][$eq]={slug}'
    parent_response = requests.get(parent_url, headers=headers)
    if parent_response.status_code != 200:
        return JsonResponse({'error': 'Error fetching parent article'}, status=500)
    
    parent_article = parent_response.json().get('data')
    if not parent_article:
        return JsonResponse({'error': 'Parent article not found'}, status=404)
    
    parent_article = parent_article[0]  # Assuming the response is a list of articles

    # Récupérer les articles enfants
    child_url = f'http://127.0.0.1:1337/api/articles?populate=*&filters[category][slug][$eq]={slug}'
    child_response = requests.get(child_url, headers=headers)
    if child_response.status_code != 200:
        return JsonResponse({'error': 'Error fetching child articles'}, status=500)
    
    child_articles = child_response.json().get('data', [])

    # Combiner l'article parent et les articles enfants dans la réponse
    response_data = {
        'parent_article': parent_article,
        'child_articles': child_articles
    }

    return JsonResponse(response_data)

# Create your views here.
def accueil(request):
    return render(request, 'main/accueil.html')

def nosProjets(request):
    return render(request, 'main/nos-projets.html')

def article_detail(request, slug):
    return render(request, 'main/article_detail.html')

def nosMembres(request):
    return render(request, 'main/nos-membres.html')