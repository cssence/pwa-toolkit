const main = async (id, name) => {
	window.$ = document.querySelector.bind(document);
	window.$$ = document.querySelectorAll.bind(document);

	const config = {
		version: 2,
		mode: 'forward',
		apps: [
			{ id: 'bookmarks', name: 'Bookmarks', srcDesc: 'URL of a JSON file' },
			{ id: 'calendar', name: 'Calendar', srcDesc: 'URL of a JSON file' },
			{ id: 'console', name: 'Console'},
			{ id: 'notepad', name: 'Notepad'},
			{ id: 'settings', name: 'Settings', show: true, srcDesc: 'URL of a JSON file' },
			{ id: 'wallpaper', name: 'Wallpaper', srcDesc: 'URL of an image' }
		]
	};
	const src = window.localStorage.getItem('/settings/');
	let data;
	if (src) {
		try {
			await fetch(src);
			const response = await fetch(src);
			data = await response.json();
			if (!data || !data.version === 2 || !data.apps) throw new Error('Unknown JSON file format.');
			const configMap = {};
			config.apps.forEach((app, index) => configMap[app.id] = index); 
			const actualMap = {};
			data.apps.map((app, index) => {
				actualMap[app.id] = index;
				['name', 'srcDesc'].forEach((copy) => app[copy] = config.apps[configMap[app.id]][copy]);
			});
			config.apps.forEach((app) => {
				if (typeof actualMap[app.id] !== 'number') {
					console.info('added missing app', app); // TODO remove
					data.apps.push(app);
				}
			});
		} catch (err) {
			console.warn(err);
			data = config;
		}
	} else {
		data = config;
	}
	if (!id) return data;

	const options = [`<option value="${id}" selected>${name}</option>`];
	data.apps.forEach((app) => {
		if (!app.show) return;
		const selected = id === app.id ? ' selected' : '';
		if (selected) options[0] = '';
		options.push(`<option value="${app.id}"${selected}>${app.name}</option>`);
	});
	const heading = `<h1 id="top">${name}</h1>`;
	let switcher = '';
	if (options.length > 1) {
		const select = `<select name="switch" size="1">${options.join('')}</select>`;
		switcher = `<form id="switch" name="switch" action="." method="get" aria-label="Apps">${select}</form>`;
	}
	document.body.insertAdjacentHTML('afterbegin', `${heading}${switcher}`);
	if (switcher) {
		$('#switch select').addEventListener('change', (event) => {
			// if (event.target.tagName.toLowerCase() !== 'select') return;
			// event.preventDefault();
			const url = `/${event.target.value}/`;
			event.target.value = location.pathname.slice(1, -1);
			location.href = url;
		});
	}

	return data;
};

export default main;
