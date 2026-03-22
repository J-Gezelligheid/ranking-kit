const zhiwang = {};

zhiwang.rankingSpanProvider = [];

zhiwang.start = function() {
	setInterval(function() {
		zhiwang.addRankings();
	}, 2000);
}


zhiwang.addRankings = function() {
	var results = $("td.source a");

	results.each(function(index) {
		let result = $(this);
		var parent = result.closest("td");

		if (parent.attr("data-ranking-kit-injected") === "1") {
			return;
		}

		let source = result.text().trim();
		if (source.length != 0) {
			for (let getRankingSpan of zhiwang.rankingSpanProvider) {
				result.after(getRankingSpan(source));
			}
			// Mark the cell so we do not inject the same badges again on the next tick.
			parent.attr("data-ranking-kit-injected", "1");
		}
	});
};
