from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_chat_and_professional_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="professional",
            name="password_hash",
            field=models.CharField(blank=True, max_length=128),
        ),
    ]
