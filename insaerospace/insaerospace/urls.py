"""
URL configuration for insaerospace project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.accueil, name='accueil'),
    path('nos-projets/', views.nosProjets, name='nos-projets'),
    path('nos-membres/', views.nosMembres, name='nos-membres'),
    path('api/fetch_projets/', views.fetch_projets, name='fetch_projets'),
    path('api/fetch_articles/', views.fetch_articles, name='fetch_articles'),
    path('nos-projets/<slug:slug_project>/<slug:slug_article>/', views.article_detail, name='article_detail'),
    path('nos-projets/<slug:slug_project>/', views.project_detail, name='project_detail'),
    path('test/', views.test, name='test'),
    path('api/fetch_upload/', views.fetch_upload, name='fetch_upload'),
]
