import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
	{
		canActivateChild:[publicGuard()],
		path: 'auth',
		loadChildren: () => import('./auth/auth.routes')
	},
	{
		canActivateChild:[privateGuard()],
		path: 'geovisor',
		loadComponent: () => import('./geovisor/geovisor.component'),
		loadChildren: () => import('./geovisor/geovisor.routes')
	},
	{
		path: '',
		redirectTo: 'auth',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: '/auth/error',
		pathMatch: 'full',
	},
];

