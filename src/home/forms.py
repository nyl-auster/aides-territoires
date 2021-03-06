from django import forms
from django.utils.translation import ugettext_lazy as _


class MailingListForm(forms.Form):
    """Display the mailing list registering form."""

    email = forms.EmailField(
        required=True,
        label=_('Email'),
        help_text=_('We will send a validation link to this address.'),
    )
    organization = forms.CharField(
        required=True,
        label=_('Structure'),
        help_text=_('Tell us the name and nature of your organization.'),
    )
    zipcode = forms.CharField(
        required=True,
        label=_('Zip code')
    )
