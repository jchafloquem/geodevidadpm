import { Routes } from '@angular/router';

export default [
			{
				path: 'login',
				loadComponent: () => import('./pages/login/login.component'),
			},
			{
				path: 'welcome',
				loadComponent: () => import('./pages/welcome/welcome.component'),
			},
			{
				path: 'register',
				loadComponent: () => import('./pages/register/register.component'),
			},
			{
				path: 'error',
				loadComponent: () => import('./pages/error404/error404.component'),
			},
			{
				path: '',
				redirectTo: 'welcome',
				pathMatch: 'full',
			},
] as Routes
