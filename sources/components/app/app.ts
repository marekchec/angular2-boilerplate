/// <reference path="../../typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

@Component({
	selector: 'my-app'
})

@View({
	templateUrl: 'templates/app.html'
})

class AppComponent {
	name: string;
	
	/**
	 * Constructor - app initialization
	 */
	constructor() {
		this.name = 'Marek';
	}
}

bootstrap( AppComponent );