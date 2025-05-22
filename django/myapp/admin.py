from django.contrib import admin
from .models import User, ProblemCategory, ProblemReport, ClientPoints


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'user_type', 'phone', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'phone')


@admin.register(ProblemReport)
class ProblemReportAdmin(admin.ModelAdmin):
    list_display = ('reporter', 'category', 'status', 'date_reported', 'location_address')
    list_filter = ('status', 'category')
    search_fields = ('description', 'location_address')
    readonly_fields = ('date_reported',)


@admin.register(ClientPoints)
class ClientPointsAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ('user__username',)
    ordering = ('-balance',)

admin.site.register(ProblemCategory)
