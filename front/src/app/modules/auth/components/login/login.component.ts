import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    //Initialise le formulaire de connexion avec les champs email et mot de passe
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    //Récupère l'URL de retour depuis les paramètres de la route ou utilise '/admin/dashboard' par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }

  // Convenience getter for easy access to form fields
  //Accesseur pratique pour un accès facile aux champs du formulaire
  get f() { return this.loginForm.controls; }

  //Gère la soumission du formulaire de connexion
  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    //Appelle le service d'authentification pour se connecter
    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value
    })
      //Gère la réponse de l'authentification
      .subscribe({
        //Gère la réponse réussie
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        //Gère la réponse d'erreur
        error: (error: any) => {
          //Affiche le message d'erreur fourni par le backend ou un message par défaut
          this.error = error.error?.message || 'Identifiants incorrects';
          this.loading = false;
        }
      });
  }
}
