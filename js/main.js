function node() {
	this.left = null;
	this.right = null;
	this.prob = null;
	this.value = null;
	this.code = "";
	this.parent = null;
	this.visited = false;
}



function kodiraj() {
	const input = document.getElementById("input").value;
	document.getElementById("input_length").innerHTML = input.length * 8;
	const probabilities = getProbabilities(input);
	const codes = getCodes(probabilities);
	const result = kodirajHuffman(input, codes);

	let temp = "";
	for (const elem in probabilities) {
		temp += elem + " = " + probabilities[elem] + "<br/>";
	}
	document.getElementById("probabilities").innerHTML = temp;

	temp = "";
	let label;
	for (const elem in codes) {
		label = elem == ' ' ? 'RAZMAK' : elem;
		temp += label + " = " + codes[elem] + "<br/>";
	}
	document.getElementById("codes").innerHTML = temp;
	document.getElementById("result").innerHTML = result;
	document.getElementById("result_length").innerHTML = result.length;
}

function getCodes(prob) {
	let tree = new Array();
	let secondTree = new Array();

	this.getNext = function () {
		if (tree.length > 0 && secondTree.length > 0 &&
			tree[0].prob < secondTree[0].prob)
			return tree.shift();

		if (tree.length > 0 && secondTree.length > 0 &&
			tree[0].prob > secondTree[0].prob)
			return secondTree.shift();

		if (tree.length > 0)
			return tree.shift();

		return secondTree.shift();
	}
	let sortedProb = new Array();
	let codes = new Array();

	let x = 0;
	for (const elem in prob) {
		sortedProb[x] = new Array(elem, prob[elem]);
		x = x + 1;
	}

	sortedProb = sortedProb.sort((a,b)=>{
		return a[1] - b[1];
	});
	x = 0;

	for (const elem in sortedProb) {
		tree[x] = new node();
		tree[x].prob = sortedProb[elem][1];
		tree[x].value = sortedProb[elem][0];
		x = x + 1;
	}
	while (tree.length + secondTree.length > 1) {
		const left = getNext();
		const right = getNext();
		const newnode = new node();
		newnode.left = left;
		newnode.right = right;
		newnode.prob = left.prob + right.prob;
		newnode.left.parent = newnode;
		newnode.right.parent = newnode;
		secondTree.push(newnode);
	}

	let currentnode = secondTree[0];
	let code = "";
	while (currentnode) {
		if (currentnode.value) {
			codes[currentnode.value] = code;
			code = code.substr(0, code.length - 1);
			currentnode.visited = true;
			currentnode = currentnode.parent;
		} else if (!currentnode.left.visited) {
			currentnode = currentnode.left;
			code += "0";
		} else if (!currentnode.right.visited) {
			currentnode = currentnode.right;
			code += "1";
		} else {
			currentnode.visited = true;
			currentnode = currentnode.parent;
			code = code.substr(0, code.length - 1);
		}
	}
	return codes;
}


function kodirajHuffman(input, codes) {
	const result = input.split("");
	for (const elem in result) {
		result[elem] = codes[result[elem]];
	}
	return result.join("");
}

function getProbabilities(input) {
	let prob = new Array();
	let x = 0;
	const len = input.length;
	while (x < len) {
		var chr = input.charAt(x);
		if (prob[chr]) {
			prob[chr] = prob[chr] + 1;
		} else {
			prob[chr] = 1;
		}
		x++;
	}

	for (const elem in prob) {
		prob[elem] = prob[elem] / len;
	}
	return prob;
}


kodiraj()