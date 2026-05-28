import { Component, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { AuthService } from "../../core/services/auth.service";
import { KeycloakService } from "../../features/auth/keycloak.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="w-full max-w-md">

        <!-- Brand header -->
        <div class="text-center mb-8">
          <mat-icon class="text-primary-600 text-5xl" style="font-size:48px">signal_cellular_alt</mat-icon>
          <h1 class="text-3xl font-bold text-gray-900 mt-2">Grupo NE</h1>
          <p class="text-gray-500 mt-1">Mantenimiento Predictivo de Flota</p>
        </div>

        <!-- Keycloak mode: single button -->
        @if (!useMockData) {
          <div class="bg-white rounded-lg shadow p-8 space-y-6">
            <h2 class="text-xl font-semibold text-gray-800 text-center">Iniciar Sesión</h2>
            <p class="text-sm text-gray-500 text-center">
              Será redirigido al servidor de autenticación para iniciar sesión de forma segura.
            </p>
            <button
              mat-raised-button
              color="primary"
              class="w-full"
              (click)="loginWithKeycloak()"
              [disabled]="loading()">
              @if (loading()) {
                <mat-icon class="animate-spin mr-2">refresh</mat-icon>
              }
              <mat-icon class="mr-2">lock</mat-icon>
              Iniciar sesión con Keycloak
            </button>
          </div>
        }

        <!-- Mock mode: form-based login -->
        @if (useMockData) {
          <div class="bg-white rounded-lg shadow p-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">Iniciar Sesión</h2>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">

              <mat-form-field class="w-full">
                <mat-label>Correo electrónico</mat-label>
                <input
                  type="email"
                  matInput
                  [formControl]="emailFormControl"
                  placeholder="usuario@ejemplo.com"
                  autocomplete="email">
                @if (emailFormControl.hasError('email') && !emailFormControl.hasError('required')) {
                  <mat-error>Ingrese un correo electrónico válido</mat-error>
                }
                @if (emailFormControl.hasError('required')) {
                  <mat-error>El correo electrónico es <strong>obligatorio</strong></mat-error>
                }
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Contraseña</mat-label>
                <input
                  matInput
                  [type]="showPassword() ? 'text' : 'password'"
                  [formControl]="passwordFormControl"
                  required
                  autocomplete="current-password" />
                <button mat-icon-button matSuffix type="button" (click)="showPassword.set(!showPassword())">
                  <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (passwordFormControl.hasError('required')) {
                  <mat-error>La contraseña es obligatoria</mat-error>
                }
                @if (passwordFormControl.hasError('minlength')) {
                  <mat-error>La contraseña debe tener al menos 6 caracteres</mat-error>
                }
              </mat-form-field>

              <div class="flex items-center justify-between">
                <mat-checkbox [formControl]="rememberMeFormControl" color="primary">
                  Recordarme
                </mat-checkbox>
                <a href="#" class="text-sm text-primary-600 hover:underline">¿Olvidó su contraseña?</a>
              </div>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="w-full mt-2"
                [disabled]="loginForm.invalid || loading()">
                @if (loading()) {
                  <mat-icon class="animate-spin mr-2">refresh</mat-icon>
                }
                Iniciar Sesión
              </button>

            </form>

            <mat-divider class="my-4"></mat-divider>
            <p class="text-xs text-gray-400 text-center">Modo simulación activo — usando datos de prueba</p>
          </div>
        }

      </div>
    </div>
  `,
})
export class LoginComponent {
  readonly useMockData = environment.useMockData;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  rememberMeFormControl = new FormControl(false);

  loginForm: FormGroup;
  loading = signal(false);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private keycloakService: KeycloakService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: this.emailFormControl,
      password: this.passwordFormControl,
      rememberMe: this.rememberMeFormControl,
    });
  }

  loginWithKeycloak(): void {
    this.loading.set(true);
    this.keycloakService.login();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);

      const credentials = this.loginForm.value;

      this.authService
        .mockLogin(credentials.email, credentials.password)
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            this.loading.set(false);
            const errorMessage = error?.message || "Error al iniciar sesión. Intente nuevamente.";
            this.snackBar.open(errorMessage, "Cerrar", { duration: 3000 });
          },
        });
    }
  }
}
