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
    response = requests.get('http://127.0.0.1:1337/api/articles?populate=*', headers=headers)
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching articles'}, status=500)

# Create your views here.
def accueil(request):
    return render(request, 'main/accueil.html')

def nosProjets(request):
    return render(request, 'main/nos-projets.html')

def article_detail(request, slug):
    return render(request, 'main/article_detail.html')

def nosMembres(request):
    return render(request, 'main/nos-membres.html')