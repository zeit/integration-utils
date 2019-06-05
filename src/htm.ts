import htmCore from 'htm';

export const ZeitComponentTypes: string[] = [
	'Option',
	'Fieldset',
	'Button',
	'HR',
	'B',
	'P',
	'BR',
	'H1',
	'H2',
	'Select',
	'Textarea',
	'Input',
	'Img',
	'Code',
	'UL',
	'LI',
	// zeit tags
	'FsContent',
	'FsFooter',
	'FsTitle',
	'Notice',
	'Box',
	'ProjectSwitcher',
	'ClientState',
	'Checkbox',
	'Link',
	'AutoRefresh',
	'Page',
	'Container'
];

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

	const filteredType =
		ZeitComponentTypes.find(
			name => name.toLowerCase() === type.toLowerCase() && name !== type
		) || type;

	const childrenStr = children
		.map((child: any) => renderAST(child))
		.join('\n');
	return `<${filteredType} ${propsString}>${childrenStr}</${filteredType}>`;
}

function escapeContent(node: any) {
	const lines = node.split('\n');
	const value = lines
		.map((line: string, index: number) => {
			const nl = index < lines.length - 1 ? '\n' : '';
			return `{${JSON.stringify(line + nl)}}`;
		})
		.join('');

	return value;
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
