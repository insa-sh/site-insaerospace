import os
import requests
from django.shortcuts import render
import json
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.http import require_GET
from dotenv import load_dotenv

load_dotenv()

@require_GET
def fetch_caroussel(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }
    try:
        response = requests.get('http://127.0.0.1:1337/api/caroussel?populate=*', headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_caroussel: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)
    
    if response.status_code == 200:
        try:
            data = response.json()
            images = []
            if "data" in data:
                item_images = data["data"].get("Images", [])
                for img in item_images:
                    images.append({
                        'name': img['name'],
                        'url': f"http://localhost:1337{img['url']}"
                    })
            return JsonResponse({'images': images})
        except ValueError as e:
            print(f"Error parsing JSON: {e}")
            print(f"Response content: {response.content}")
            return JsonResponse({'error': 'Error parsing JSON response'}, status=500)
    else:
        print(f"Error fetching caroussel: {response.status_code}")
        print(f"Response content: {response.content}")
        return JsonResponse({'error': 'Error fetching caroussel: ' + str(response.content)}, status=response.status_code)


@require_GET
def fetch_projets(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }

    slug_projet = request.GET.get('slug')
    try:
        if slug_projet:
            response = requests.get(f'http://127.0.0.1:1337/api/projets?populate=*&filters[slug][$eq]={slug_projet}', headers=headers)
        else:
            response = requests.get('http://127.0.0.1:1337/api/projets?populate=*', headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_projets: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)
        
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
    
    base_url = 'http://127.0.0.1:1337/api/articles?populate=*'
    sort = '&sort=createdAt:desc'  # Descending order (antichronologique)

    if slug and projet:
        url = f"{base_url}&filters[slug][$eq]={slug}&filters[projet][slug][$eq]={projet}{sort}"
    elif slug:
        url = f"{base_url}&filters[slug][$eq]={slug}{sort}"
    elif projet:
        url = f"{base_url}&filters[projet][slug][$eq]={projet}{sort}"
    else:
        return JsonResponse({'error': 'a slug or projet parameter is required'}, status=400)

    try:
        response = requests.get(url, headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_articles: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)

    if response.status_code != 200:
        return JsonResponse({'error': 'Error fetching articles'}, status=500)

    return JsonResponse(response.json())


@require_GET
def fetch_membres(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }

    slug_membre = request.GET.get('slug')
    try:
        if slug_membre:
            response = requests.get(f'http://127.0.0.1:1337/api/membres?populate=*&filters[slug][$eq]={slug_membre}', headers=headers)
        else:
            response = requests.get('http://127.0.0.1:1337/api/membres?populate=*', headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_membres: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)
    
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching membres'}, status=500)
    

@require_GET
def fetch_roles(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }

    slug_role = request.GET.get('slug')
    slug_pole = request.GET.get('pole')

    try:
        if slug_role:
            response = requests.get(f'http://127.0.0.1:1337/api/role-membres?populate=*&filters[slug][$eq]={slug_role}', headers=headers)
        elif slug_pole:
            response = requests.get(f'http://127.0.0.1/api/role-membres?populate=*&filters[pole][slug][$eq]={slug_pole}', headers=headers)
        else:
            response = requests.get('http://127.0.0.1:1337/api/role-membres?populate=*', headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_roles: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)
    
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching roles'}, status=500)
    

@require_GET
def fetch_poles(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }

    slug_pole = request.GET.get('slug')
    try:
        if slug_pole:
            response = requests.get(f'http://127.0.0.1:1337/api/pole-roles?populate=*&filters[slug][$eq]={slug_pole}', headers=headers)
        else:
            response = requests.get('http://127.0.0.1:1337/api/pole-roles?populate=*', headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_poles: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)
    
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching poles'}, status=500)
    

@require_GET
def fetch_contact(request):
    api_token = os.getenv('API_TOKEN')
    headers = {
        'Authorization': f'Bearer {api_token}'
    }

    try:
        response = requests.get('http://127.0.0.1:1337/api/contact-page?fields=titre,contenu', headers=headers)
    except requests.exceptions.RequestException as e:
        print(f"Error contacting backend in fetch_contact: {e}")
        return JsonResponse({'error': 'Impossible d\'accéder au backend'}, status=503)
    
    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'Error fetching contact page'}, status=500)

    




def accueil(request):
    # Compter les membres actifs dans la base de données
    membres_count = 0
    try:
        # en utilisant fetch_membres() 
        response = fetch_membres(request)
        if response.status_code == 200:
            membres_count = len(json.loads(response.content).get('data', []))
            membres_count = len(response.json().get('data', []))
    except Exception as e:
        print(f"Error fetching membres: {e}")
        
    try:
        now = datetime.now()
        if (now.month, now.day) >= (2, 23):
            exp_years = now.year - 2023
        else:
            exp_years = now.year - 2023 - 1
    except Exception as e:
        print(f"Error calculating experience years: {e}")

    # Récupérer le nombre de micro-fusées depuis la table Global de la db
    nb_micro_fusees = 0
    try:
        api_token = os.getenv('API_TOKEN')
        headers = {
            'Authorization': f'Bearer {api_token}'
        }
        response = requests.get('http://127.0.0.1:1337/api/global', headers=headers)
        if response.status_code == 200:
            data = response.json().get('data', {})
            nb_micro_fusees = data.get('nombredemicrofusees', 0)
    except Exception as e:
        print(f"Error fetching global data: {e}")


        


    # Passer la variable au template
    return render(request, 'main/accueil.html', {'membres_count': membres_count, 'nb_micro_fusees': nb_micro_fusees, 'experience_years': exp_years})

def nosProjets(request):
    return render(request, 'main/nos-projets.html')

def article_detail(request, slug_project, slug_article):
    return render(request, 'main/article_detail.html')

def project_detail(request, slug_project):
    return render(request, 'main/project_detail.html')

def nosMembres(request):
    return render(request, 'main/nos-membres.html')

def contact(request):
    return render(request, 'main/contact.html')



def error_404(request):
    return render(request, 'main/404.html', status=404)