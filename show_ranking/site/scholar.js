const scholar = {};

scholar.rankSpanList = [];
scholar.rankSpanListSwufe = [];
scholar.refreshTimer = null;

scholar.run = function() {
	scholar.refresh();
	scholar.observe();
};

scholar.observe = function() {
	if (scholar.observer != null || document.body == null) {
		return;
	}

	scholar.observer = new MutationObserver(function(mutations) {
		for (let mutation of mutations) {
			if (mutation.addedNodes != null && mutation.addedNodes.length > 0) {
				scholar.scheduleRefresh();
				return;
			}
		}
	});

	scholar.observer.observe(document.body, {
		childList: true,
		subtree: true
	});
};

scholar.scheduleRefresh = function() {
	if (scholar.refreshTimer != null) {
		clearTimeout(scholar.refreshTimer);
	}

	scholar.refreshTimer = setTimeout(function() {
		scholar.refreshTimer = null;
		scholar.refresh();
	}, 200);
};

scholar.refresh = function() {
	let pathname = window.location.pathname;

	if (pathname === "/scholar") {
		scholar.appendSearchRanks();
	} else if (pathname === "/citations") {
		scholar.appendProfileRanks();
	}
};

scholar.appendSearchRanks = function() {
	let elements = $(".gs_r.gs_or.gs_scl");

	elements.each(function() {
		let result = $(this);
		if (result.attr("data-ranking-kit-checked") === "1") {
			return;
		}

		let container = result.find(".gs_ri").first();
		if (!container.length) {
			container = result;
		}

		let node = container.find(".gs_rt a:first");
		if (!node.length) {
			node = container.find(".gs_rt").first();
		}

		let journal = scholar.extractSearchSource(container);
		if (node.length && journal.length) {
			scholar.injectRankings(node, journal);
		}

		result.attr("data-ranking-kit-checked", "1");
	});
};

scholar.appendProfileRanks = function() {
	let elements = $("tr.gsc_a_tr");

	elements.each(function() {
		let row = $(this);
		if (row.attr("data-ranking-kit-checked") === "1") {
			return;
		}

		let node = row.find("a.gsc_a_at:first");
		if (!node.length) {
			node = row.find("td.gsc_a_t > a:first");
		}

		let journal = scholar.extractProfileSource(row);
		if (node.length && journal.length) {
			scholar.injectRankings(node, journal);
		}

		row.attr("data-ranking-kit-checked", "1");
	});
};

scholar.injectRankings = function(node, sourceName) {
	let anchor = $(node);
	let normalizedName = scholar.normalizeRankingName(sourceName);

	for (let getRankSpan of scholar.rankSpanListSwufe) {
		let span = getRankSpan(normalizedName);
		if (span == null || span.length === 0) {
			continue;
		}

		anchor.after(span);
		anchor = span;
	}
};

scholar.extractSearchSource = function(container) {
	let metaText = container.find(".gs_a").first().text();
	return scholar.extractSourceFromMeta(metaText);
};

scholar.extractProfileSource = function(row) {
	let metaBlocks = row.find("div.gs_gray");
	if (metaBlocks.length < 2) {
		return "";
	}

	return scholar.cleanSourceName($(metaBlocks[1]).text());
};

scholar.extractSourceFromMeta = function(metaText) {
	let normalized = scholar.normalizeScholarText(metaText);
	if (normalized.length === 0) {
		return "";
	}

	let segments = normalized.split(/\s+-\s+/).map(function(segment) {
		return segment.trim();
	}).filter(function(segment) {
		return segment.length > 0;
	});

	if (segments.length >= 2) {
		let candidate = scholar.cleanSourceName(segments[1]);
		if (candidate.length > 0) {
			return candidate;
		}
	}

	let match = normalized.match(/-\s*(.*?)(?:,\s*(?:19|20)\d{2}\b|$)/);
	if (match != null) {
		return scholar.cleanSourceName(match[1]);
	}

	return "";
};

scholar.cleanSourceName = function(text) {
	let name = scholar.normalizeScholarText(text);
	if (name.length === 0) {
		return "";
	}

	name = name.replace(/^\[[^\]]+\]\s*/, "");
	name = name.replace(/^\.{3}\s*/, "");
	name = name.replace(/\s*\.{3}\s*$/, "");
	name = name.replace(/,\s*(?:19|20)\d{2}\b.*$/, "");
	name = name.replace(/\s+(?:19|20)\d{2}\b.*$/, "");
	name = name.replace(/^["']+|["']+$/g, "");

	return name.trim();
};

scholar.normalizeScholarText = function(text) {
	return (text || "")
		.replace(/\u2026/g, "...")
		.replace(/[\u2013\u2014]/g, "-")
		.replace(/\s+/g, " ")
		.trim();
};

scholar.normalizeRankingName = function(name) {
	let cleaned = scholar.cleanSourceName(name);
	if (/[a-z]/i.test(cleaned)) {
		return cleaned.toUpperCase();
	}

	return cleaned;
};
