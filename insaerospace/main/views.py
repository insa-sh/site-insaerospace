from django.shortcuts import render
from django.http import HttpResponse



# Create your views here.
def accueil(request):
    return render(request, 'main/accueil.html')



def nosProjets(request):
    return render(request, 'main/nos-projets.html')