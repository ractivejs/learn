export default function forceRedraw () {
	document.body.style.display = 'inline-block';
	document.body.offsetHeight; // no need to store this anywhere, the reference is enough
	document.body.style.display = 'block';
};
