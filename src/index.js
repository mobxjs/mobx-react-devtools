require("./devtools.css");
var $ = require('jquery');
var mobservableReact = require('mobservable-react');
var mobservable = require('mobservable');

/** MWE: yup, it's a mess in here. Feel free to tidy up and PR :) */

var byNodeRegistery = mobservableReact.componentByNodeRegistery;
var highlightRegistery = new WeakMap();

var showRenderings = false;

console.log("Starting mobservable-react-devtools...");

mobservableReact.trackComponents();

function getHighlightForComponent(component) {
	if (highlightRegistery.has(component))
		return highlightRegistery.get(component);
	var elem  = $("<div></div>")
		.addClass("mobservable-devtools-render-highlight")
		.appendTo(document.body);
	highlightRegistery.set(component, elem);
	return elem;
}

function destroyHighlight(component) {
	getHighlightForComponent(component).remove();
	highlightRegistery.delete(component);
}

mobservableReact.renderReporter.on(function(report) {
	if (!showRenderings)
		return;

	var node = report.node;
	if (node && report.event === "render") {
		var $node = $(node);
		var offset = $node.offset();
		var elem = getHighlightForComponent(report.component);
		var renderCount = (1 * elem.attr('data-render-count') || 0) + 1;

		elem
			.removeClass("mobservable-devtools-render-highlight-cheap mobservable-devtools-render-highlight-ok mobservable-devtools-render-highlight-expensive")
			.stop()
			.addClass("mobservable-devtools-render-highlight-" + (report.renderTime < 25 ? "cheap" : report.renderTime < 100 ? "ok" : "expensive"))
			.attr('data-render-count', renderCount)
			.text(renderCount + "x | " + report.renderTime + " / " + report.totalTime + " ms")
			.css({
				left: offset.left - 5,
				top: offset.top - 5,
				width: $node.outerWidth() - 10,
				height: $node.outerHeight() - 10,
				opacity: 0.8,
				display: 'block',
			})
			.fadeOut(2500)
	}
	if (report.event === "destroy") {
		destroyHighlight(report.component);
	}
});

var activeDomNode = null;
var selectionActive = true;
var inSelectorMode = false;

function highlightHoveredComponent(target) {
	if (activeDomNode)
		$(activeDomNode).removeClass("mobservable-devtools-selection-highlight");
	activeDomNode = target;
	var component = byNodeRegistery.get(activeDomNode);
	if (component) {
		$(activeDomNode).addClass("mobservable-devtools-selection-highlight");
	}
}
$(document.body).mousemove(function(e) {
	if (inSelectorMode) {
		highlightHoveredComponent(e.target);
	}
});

$(document.body).click(function(e) {
	if (inSelectorMode) {
		e.stopPropagation();
		e.preventDefault();
		highlightHoveredComponent(e.target);
		inSelectorMode = false;
		selectionActive = true;
		$('#mobservable-devtools-btn-deptree').toggleClass("active", false);		
		showDependencies(findComponent(activeDomNode));
	}
});

function toggleSelectorEnabled(e) {
	inSelectorMode = !inSelectorMode;
	selectionActive = false;
	if (!inSelectorMode && activeDomNode)
		$(activeDomNode).removeClass("mobservable-devtools-selection-highlight");
	$('#mobservable-devtools-btn-deptree').toggleClass("active", inSelectorMode);
	e.stopPropagation();
}

function toggleShowRenderings(e) {
	showRenderings = !showRenderings;
	if (!showRenderings) {
		$(".mobservable-devtools-render-highlight").remove();
		highlightRegistery = new WeakMap();
	}
	$('#mobservable-devtools-btn-updates').toggleClass("active");
	e.stopPropagation();
}

var logListenerDisposer;
function toggleLogEnabled(e) {
	if (logListenerDisposer) {
		logListenerDisposer();
		logListenerDisposer = null;
	} else { 
		logListenerDisposer = mobservable.extras.trackTransitions();
	}
	$('#mobservable-devtools-btn-log').toggleClass("active");
	e.stopPropagation();
}

function findComponent(target) {
	var elem, component;
	while(target) {
		elem = $(target).closest("[data-reactid]")[0];
		if (!elem) {
			console.log("No react component found");
			return;
		}
		component = byNodeRegistery.get(elem);
		if (component)
			break;
		target = target.parentNode;
	}
	return component;
}

function showDependencies(component) {
	if (!component)
		return;
	var dependencyTree = mobservable.extras.getDependencyTree(component.render);

	console.dir(dependencyTree);

	var html = [];
	deduplicateDependencies(dependencyTree);
	var height = renderTree(html, dependencyTree, 20, 20);

	var graph = $("<div></div>")
		.addClass("mobservable-dependency-graph")
		.appendTo(document.body)
		.html("<svg height='" + (height + 40) + "'>" + html.join("") + "</svg>")
		.click(function() {
			graph.remove();
		});
}

function deduplicateDependencies(depTree) {
	if (!depTree.dependencies)
		return;
	for(var i = depTree.dependencies.length -1; i >= 0; i--) {
		var name = depTree.dependencies[i].name;
		for(var i2 = i - 1; i2 >= 0; i2--) {
			if (depTree.dependencies[i2].name === name) {
				depTree.dependencies[i2].dependencies = [].concat(depTree.dependencies[i2].dependencies || [], depTree.dependencies[i].dependencies || []);
				depTree.dependencies.splice(i, 1);
				break;
			}
		}
	}
	depTree.dependencies.forEach(deduplicateDependencies);
}

var BOXH = 30;
var HBOXH = 0.5 * BOXH;

function box(x, y, caption) {
	return ["<rect x='", x, "' y='", y, "' height='", BOXH, "' width='", 20 + caption.length * 8, "' class='mobservable-devtools-depbox'></rect>",
		"<text x='", x, "' y='", y, "'>", caption, "</text>"
	].join("");
}

function line(x1, y1, x2, y2, x3, y3) {
	return ["<path d='M", x1, " ", y1, " L", x2, " ", y2, " L", x3, " ", y3, "'/>"].join("");
}

function renderTree(html, tree, basex, basey) {
	var height = BOXH + HBOXH;
	html.push(box(basex, basey, tree.name));

	if (tree.dependencies) {
		tree.dependencies.forEach(function(child) {
			html.push(line(
				basex + HBOXH, basey + BOXH,
				basex + HBOXH, basey + height + HBOXH,
				basex + BOXH, basey + height + HBOXH));
			height += renderTree(html, child, basex + BOXH, basey + height);

		});
	}
	return height;
}

function renderToolbar() {
	var wrapper = $("<div>Mobservable Devtools&nbsp;&nbsp;</div>").addClass("mobservable-devtools-wrapper");
	$("<button id='mobservable-devtools-btn-updates' title='Highlight components whenever they are re-rendered'></button")
		.text("Show updates")
		.on('click', toggleShowRenderings)
		.appendTo(wrapper);
	$("<button id='mobservable-devtools-btn-deptree' title='Select a component to show its dependency tree'></button")
		.text("Show dependency tree")
		.on('click', toggleSelectorEnabled)
		.appendTo(wrapper);
	$("<button id='mobservable-devtools-btn-log' title='Log all changes to the console'></button")
		.text("Enable log")
		.on('click', toggleLogEnabled)
		.appendTo(wrapper);
	wrapper.appendTo(document.body);
	
	console.log("Initialized mobservable-react-devtools.");
	setTimeout(function() {
		if ($(".mobservable-devtools-wrapper").length === 0)
			console.error("Initalized mobservable-react-devtools, but the toolbar has been removed from the DOM. Was React mounted on document.body?");
	}, 500);
}

renderToolbar();
