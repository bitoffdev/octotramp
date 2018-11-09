from django.shortcuts import redirect, render
from django.http import JsonResponse
from octotramp.models import Leader

def home(request):
    return render(request, 'home/index.html')

def leaderboard(request):
    name = request.GET.get("name", None)
    score = request.GET.get("score", None)

    if name and score:
        leader = Leader(name=name, score=score)
        leader.save()

    leaders = Leader.objects.order_by('-score')[:20]
    return JsonResponse({
        "leaders": [{"name": l.name, "score": l.score} for l in leaders]
    })
