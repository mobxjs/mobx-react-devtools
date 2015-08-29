require("./devtools.css");
var $ = require('jquery');
var mobservableReact = require('mobservable-react');
var mobservable = require('mobservable');

var byNodeRegistery = mobservableReact.componentByNodeRegistery;
var highlightRegistery = new WeakMap();
var showRendering = true;

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
	if (!showRendering)
		return;

	var node = report.node;
	if (node && report.event === "render") {
		var offset = $(node).offset();
		var elem = getHighlightForComponent(report.component);
		var renderCount = (1 * elem.attr('data-render-count') || 0) + 1;

		elem
			.removeClass("mobservable-devtools-render-highlight-cheap mobservable-devtools-render-highlight-ok mobservable-devtools-render-highlight-expensive")
			.stop()
			.addClass("mobservable-devtools-render-highlight-" + (report.renderTime < 25 ? "cheap" : report.renderTime < 100 ? "ok" : "expensive"))
			.attr('data-render-count', renderCount)
			.text(renderCount + "x | " + report.renderTime + " / " + report.totalTime + " ms")
			.css({
				left: offset.left + $(node).outerWidth() - 70 - 2,
				top: offset.top,
				opacity: 1,
				display: 'block',
			})
			.fadeOut(5000)
	}
	if (report.event === "destroy") {
		destroyHighlight(report.component);
	}
});

$(document.body).mousemove(function(e) {
	var target = e.target;
	var component = byNodeRegistery.get(target);
	if (component) {
		$(target).css({
			'outline' : '2px solid red'
		});
	}
})

function toggleShowRenderings() {
	// TODO:change button state
	showRendering = !showRendering;
	if (!showRendering) {
		$(".render-highlight").remove();
		highlightRegistery = new WeakMap();
	}
}

function showDependencies() {
	setTimeout(function() {
		var handler = $(document.body).one('click', function(e) {
			var target = e.target;
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
			$(target).css("outline", "2px solid red");
			var dependencyTree = mobservable.extras.getDependencyTree(component);

			var transformTree = function(tree) {
				var res = {};
				res[tree.name] = !tree.dependencies ? true : tree.dependencies.map(transformTree);
				return res;
			};
			var transformedTree = transformTree(dependencyTree);
			console.dir(transformedTree);

			/*var graph = $("<div></div>")
				.addClass("mobservable-dependency-graph")
				.appendTo(document.body)
				//.click(() => graph.remove());

				render();
			*/

			console.dir(dependencyTree);
		});
	}, 1);
}

function renderToolbar() {
	var wrapper = $("<div></div>").addClass("mobservable-devtools-wrapper");
	var toggleRendering = $("<button></button")
		.text("Show renderings")
		.on('click', toggleShowRenderings)
		.appendTo(wrapper);

	var toggleDepTree = $("<button></button")
		.text("Show dependency tree")
		.on('click', showDependencies)
		.appendTo(wrapper);

	wrapper.appendTo(document.body);
}

renderToolbar();
