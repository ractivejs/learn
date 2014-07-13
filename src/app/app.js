import AppView from 'ractive_components/app';

var view, data;

data = window.TUTORIAL_DATA;

view = new AppView({
	el: '.app-container',
	data: {
		manifest: data.manifest,
		title: data.title,
		index: data.index,
		step: data.step
	}
});
