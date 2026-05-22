from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_professional_password"),
    ]

    operations = [
        migrations.AddField(
            model_name="professional",
            name="resume_file",
            field=models.FileField(blank=True, null=True, upload_to="professionals/resumes/%Y/%m/"),
        ),
        migrations.CreateModel(
            name="ProfessionalDocument",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("doc_type", models.CharField(choices=[("diploma", "Diploma")], default="diploma", max_length=20)),
                ("file", models.FileField(upload_to="professionals/diplomas/%Y/%m/")),
                ("uploaded_at", models.DateTimeField(auto_now_add=True)),
                (
                    "professional",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="documents",
                        to="core.professional",
                    ),
                ),
            ],
            options={"ordering": ["uploaded_at"]},
        ),
    ]
