
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Category(models.Model):
    title = models.CharField(max_length=100, verbose_name=_('Title'))

    class Meta:
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        ordering = ['title']

    def __str__(self):
        return self.title


class Service(models.Model):
    title = models.CharField(max_length=100, verbose_name=_('Title'))
    category = models.ForeignKey(Category, verbose_name=_('Category'), on_delete=models.PROTECT)

    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')
        ordering = ['title']

    def __str__(self):
        return self.title


class FindMasterisUser(AbstractUser):
    ROLE_ADMIN = 'admin'
    ROLE_HANDYMAN = 'handyman'
    ROLE_CLIENT = 'client'

    ROLE_CHOICES = (
        (ROLE_ADMIN, 'Admin'),
        (ROLE_HANDYMAN, 'Handyman'),
        (ROLE_CLIENT, 'Client'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client', null=True, blank=True, verbose_name='Role')

class Handyman(FindMasterisUser):
    contact_email = models.EmailField(max_length=255, verbose_name=_('Contact email'))
    phone_no = models.CharField(max_length=20, verbose_name=_('Phone No'), null=True, blank=True, default=None)
    website = models.CharField(max_length=255, verbose_name=_('Website'), null=True, blank=True, default=None)

    class Meta:
        verbose_name = _('Handyman')
        verbose_name_plural = _('Handymen')
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

    def save(self, *args, **kwargs):
        self.role = 'handyman'
        super().save(*args, **kwargs)


class JobEntry(models.Model):
    title = models.CharField(max_length=100, verbose_name=_('Title'))
    description = models.TextField(verbose_name=_('Description'))
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    handyman = models.ForeignKey(Handyman, verbose_name=_('Handyman'), on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        verbose_name = _('Job entry')
        verbose_name_plural = _('Job entries')
        ordering = ['pk']

    def __str__(self):
        return self.title


class JobEntryFile(models.Model):
    job_entry = models.ForeignKey(JobEntry, verbose_name=_('Job entry'), on_delete=models.CASCADE, related_name='files')
    file = models.FileField(verbose_name=_('File'), upload_to='job_entry/files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Job entry file')
        verbose_name_plural = _('Job entry files')
        ordering = ['uploaded_at',]

    def __str__(self):
        return self.file.url


class Review(models.Model):
    rating = models.PositiveIntegerField(verbose_name=_('Rating'),
                                         validators=[MinValueValidator(1), MaxValueValidator(5)])
    description = models.CharField(max_length=100, verbose_name=_('Description'), null=True, blank=True, default=None)
    created_on = models.DateTimeField(auto_now_add=True)
    handyman = models.ForeignKey(Handyman, verbose_name=_('Handyman'), on_delete=models.CASCADE,
                                 related_name='received_reviews')
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    client = models.ForeignKey(FindMasterisUser, verbose_name=_('Client'), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['created_on']

    def __str__(self):
        return '%s %s' % (self.rating, self.description)


class RequestToAdd(models.Model):
    requested_by = models.ForeignKey(Handyman, verbose_name=_('Requested by'), on_delete=models.CASCADE,
                                     related_name='category_requests')
    request_sent = models.DateTimeField(verbose_name=_('Request sent at'), default=timezone.now)
    is_rejected = models.BooleanField(verbose_name=_('Is accepted'), default=False)


class RequestToAddCategory(RequestToAdd):
    title = models.CharField(max_length=100, verbose_name=_('Category title'))

    class Meta:
        verbose_name = _('Request to add category')
        verbose_name_plural = _('Requests to add category')
        ordering = ['request_sent', ]

    def __str__(self):
        return f'Requested by {self.requested_by.username} to add category {self.title}'


class RequestToAddService(RequestToAdd):
    category = models.ForeignKey(Category, verbose_name=_('Category'), on_delete=models.CASCADE)
    title = models.CharField(max_length=100, verbose_name=_('Service title'))

    class Meta:
        verbose_name = _('Request to add service')
        verbose_name_plural = _('Requests to add service')
        ordering = ['request_sent', ]

    def __str__(self):
        return f'Requested by {self.requested_by.username} to add service {self.title}'
