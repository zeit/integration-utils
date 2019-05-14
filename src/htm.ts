import htmCore from 'htm';

export function renderAST(node: any) {
	if (node === null) {
		return 'null';
	}

	if (node === undefined) {
		return 'undefined';
	}

	if (typeof node === 'string') {
		return escapeContent(node);
	}

	if (node.map) {
		return node.map((item: any) => renderAST(item)).join('\n');
	}

	// This some other node
	if (!node.isAST) {
		return escapeContent(String(node));
	}

	const { type, propsString, children } = node;
	const childrenStr = children
		.map((child: any) => renderAST(child))
		.join('\n');
	return `<${type} ${propsString}>${childrenStr}</${type}>`;
}

function escapeContent(value: any) {
	const stringValue = String(value);
	var map: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '"',
		"'": "'"
	};

	return stringValue.replace(/[&<>"']/g, function(m) {
		return map[m];
	});
}

function escapePropValue(value: any) {
	const stringValue = String(value);
	var map: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot',
		"'": "'"
	};

	return stringValue.replace(/[&<>"']/g, function(m) {
		return map[m];
	});
}

function escapePropName(value: any) {
	const stringValue = String(value);
	var map: { [key: string]: string } = {
		'&': '',
		'<': '',
		'>': '',
		'"': '',
		"'": ''
	};

	return stringValue.replace(/[&<>"']/g, function(m) {
		return map[m];
	});
}

function buildASTNode(type: any, props: any, ...children: any[]) {
	if (typeof type === 'function') {
		return type({ ...props, children });
	}

	let propsString = '';
	Object.keys(props || {}).forEach(name => {
		const value = props[name];
		propsString += `${escapePropName(name)}="${escapePropValue(value)}" `;
	});

	return {
		isAST: true,
		type,
		propsString,
		children
	};
}

export const htm = htmCore.bind(buildASTNode);
