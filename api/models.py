from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
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


class User(models.Model):
    username = models.CharField(max_length=100, verbose_name=_('Username'), unique=True)
    password = models.CharField(max_length=255, verbose_name=_('Password'))
    email = models.EmailField(max_length=255, verbose_name=_('Email'))
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


class Handyman(User):
    first_name = models.CharField(max_length=100, verbose_name=_('First Name'))
    last_name = models.CharField(max_length=100, verbose_name=_('Last Name'))
    contact_email = models.CharField(max_length=255, verbose_name=_('Contact email'))
    phone_no = models.CharField(max_length=20, verbose_name=_('Phone No'), null=True, blank=True, default=None)
    website = models.CharField(max_length=255, verbose_name=_('Website'), null=True, blank=True, default=None)

    class Meta:
        verbose_name = _('Handyman')
        verbose_name_plural = _('Handymen')
        ordering = ['first_name', 'last_name']

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)


class Client(User):
    class Meta:
        verbose_name = _('Client')
        verbose_name_plural = _('Clients')
        ordering = ['username']


class JobEntry(models.Model):
    title = models.CharField(max_length=100, verbose_name=_('Title'))
    description = models.TextField(verbose_name=_('Description'))
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    handyman = models.ForeignKey(Handyman, verbose_name=_('Handyman'), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('Job entry')
        verbose_name_plural = _('Job entries')
        ordering = ['pk']

    def __str__(self):
        return self.title


class Review(models.Model):
    rating = models.PositiveIntegerField(verbose_name=_('Rating'),
                                         validators=[MinValueValidator(1), MaxValueValidator(5)])
    description = models.CharField(max_length=100, verbose_name=_('Description'), null=True, blank=True, default=None)
    created_on = models.DateTimeField(auto_now_add=True)
    handyman = models.ForeignKey(Handyman, verbose_name=_('Handyman'), on_delete=models.CASCADE)
    service = models.ForeignKey(Service, verbose_name=_('Service'), on_delete=models.PROTECT)
    client = models.ForeignKey(Client, verbose_name=_('Client'), on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['created_on']

    def __str__(self):
        return '%s %s' % (self.rating, self.description)
